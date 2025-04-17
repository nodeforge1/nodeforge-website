require("dotenv").config();
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const nodemailer = require("nodemailer");

const YOUR_DOMAIN = process.env.DOMAIN;

// Set up the Nodemailer transporter (example uses Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email address from .env
    pass: process.env.EMAIL_PASS, // your email password or app-specific password
  },
});

// Route to create a Stripe checkout session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { line_items, order_description, shippingInfo } = req.body;

    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return res.status(400).json({ message: "Invalid product details" });
    }

    // Calculate total price
    const totalAmount = line_items.reduce(
      (sum, item) => sum + (item.price_data.unit_amount / 100) * (item.quantity || 1),
      0
    );

    // Generate a unique order ID
    const orderID = "ORD" + Date.now();

    // Create a new order in the database with 'Pending' payment status
    const order = new Order({
      orderID,
      order_description,
      shippingInfo: {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: shippingInfo.country,
        email: shippingInfo.email, // ensure email is stored here
      },
      totalPrice: totalAmount,
      orderStatus: "Pending",
      warranty: "2 years",
      shippingPolicy: "Free shipping on orders above $500",
      customerSupport: "24/7 Customer support via Live chat and Telegram",
    });

    const savedOrder = await order.save();

    // Create Stripe checkout session (passing email from shippingInfo)
    const session = await stripe.checkout.sessions.create({
      submit_type: "pay",
      line_items,
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/canceled`,
      metadata: { order_id: savedOrder._id.toString(), order_description },
      customer_email: shippingInfo.email,
      billing_address_collection: "auto",
    });

    // Update order with the Stripe session ID
    savedOrder.stripe_session_id = session.id;
    await savedOrder.save();

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({
      message: "Error creating checkout session",
      error: error.message,
    });
  }
});

// Stripe Webhook to handle payment success, update order, and send email
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        // Retrieve shipment details from session (if available)
        const shipmentDetails = session.customer_details?.address || {};

        // Find the order in the database using metadata
        const order = await Order.findOne({ _id: session.metadata.order_id });

        if (!order) {
          return res.status(404).send("Order not found");
        }

        // Update order with shipment details and mark as completed
        order.shippingInfo = {
          ...order.shippingInfo,
          ...shipmentDetails,
        };
        order.orderStatus = "Completed";

        await order.save();

        // Send confirmation email to the customer
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: order.shippingInfo.email,
          subject: "Order Received - We are processing your order",
          text: `Hi ${order.shippingInfo.firstName},

Your order (${order.orderID}) has been received and will be processed shortly.

Thank you for your purchase!

Best regards,
Your Company Name`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });

        res.status(200).json({ received: true });
      } catch (error) {
        console.error("Error handling webhook:", error);
        return res.status(500).send("Internal Server Error");
      }
    }

    res.status(200).json({ received: true });
  }
);

module.exports = router;
