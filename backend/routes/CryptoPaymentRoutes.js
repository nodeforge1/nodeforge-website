require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
const { custom } = require("wagmi");
const validator = require('validator');

// Initialize Nodemailer transporter (example using Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your email password or app-specific password
  },
});

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = process.env.NOWPAYMENTS_API_URL;
const YOUR_DOMAIN = process.env.DOMAIN;

// Route to create a NowPayments crypto payment
router.post("/create-crypto-payment", async (req, res) => {
  try {
    // console.log("Received request to create crypto payment:", req.body);
    const { line_items, order_description, shippingInfo, pay_currency, customer } = req.body;

    if (!shippingInfo || !customer) {
      console.error("Missing shippingInfo object");
      return res.status(400).json({ error: "Missing shippingInfo object" });
    }

    const orderID = "CRYPTO-" + Date.now();
    const email = customer.email?.trim();
    console.log("Email address:", email);
    if (!validator.isEmail(email)) {
      // handle error
      console.error("Invalid email address");
      return res.status(400).json({ error: "Invalid email address" });
    }
    console.log("Email address is valid:", email);
    const totalAmountUSD = line_items.reduce((sum, item) => {
      return sum + (item.price_data.unit_amount / 100) * (item.quantity || 1);
    }, 0);

    console.log("Total amount calculated in USD:", totalAmountUSD);

    // Create an order with 'Pending' status
    const order = new Order({
      orderID,
      order_description,
      shippingInfo,
      customer,
      totalPrice: totalAmountUSD,
      orderStatus: "pending",
      paymentMethod: "crypto",
      subtotal: totalAmountUSD,
      warranty: "2 years",
      shippingPolicy: "Free shipping on orders above $500",
      customerSupport: "24/7 Customer support via Live chat and Telegram",
    });

    const savedOrder = await order.save();
    console.log("Order saved successfully:", savedOrder);

    // Create a payment request on NowPayments
    const response = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: totalAmountUSD,
        price_currency: "usd",
        pay_currency: pay_currency || "ethbase",
        order_id: savedOrder._id.toString(),
        order_description: JSON.stringify(order_description),
        ipn_callback_url: `${YOUR_DOMAIN}/api/crypto/webhook`,
        success_url: `${YOUR_DOMAIN}/success`,
        cancel_url: `${YOUR_DOMAIN}/canceled`,
      },
      {
        headers: {
          "x-api-key": NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("NowPayments response:", response.data);

    if (!response.data || !response.data.id) {
      console.error("Failed to create crypto payment", response.data);
      return res.status(500).json({ message: "Failed to create crypto payment" });
    }

    // Save the payment ID in the order
    savedOrder.payment_id = response.data.id;
    await savedOrder.save();
    console.log("Updated order with payment ID:", savedOrder);

    res.json({
      invoice_url: `https://nowpayments.io/payment/?iid=${response.data.id}`,
      payment_status: response.data.payment_status,
      order_id: response.data.order_id,
      payment_currency: response.data.pay_currency,
      payment_amount: response.data.pay_amount,
      payment_address: response.data.pay_address,
      payment_id: response.data.id,
    });
  } catch (error) {
    console.error(
      "Error processing crypto payment:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Failed to create crypto payment",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// Webhook to handle NowPayments payment status updates and send confirmation email
router.post("/webhook", async (req, res) => {
  try {
    console.log("Received webhook request:", req.body);
    const { payment_id, payment_status, order_id } = req.body;

    if (!payment_id || !payment_status || !order_id) {
      console.error("Invalid webhook data");
      return res.status(400).json({ message: "Invalid webhook data" });
    }

    // Find the order in the database by matching the orderID field
    const order = await Order.findOne({ orderID: order_id });
    if (!order) {
      console.error("Order not found for payment_id:", payment_id);
      return res.status(404).send("Order not found");
    }

    console.log("Order found, updating status...");
    // Update order status based on payment status
    if (payment_status === "confirmed" || payment_status === "finished") {
      order.orderStatus = "Completed";
    } else if (payment_status === "failed" || payment_status === "expired") {
      order.orderStatus = "Failed";
    } else if (payment_status === "waiting" || payment_status === "pending") {
      order.orderStatus = "Pending";
    }

    await order.save();
    console.log("Order status updated successfully:", order);

    // If payment is completed, send a confirmation email
    if (payment_status === "confirmed" || payment_status === "finished") {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.shippingInfo.email,
        subject: "Your order has been received",
        text: `Hi ${order.shippingInfo.firstName},\n\nYour order (${order.orderID}) has been received and will be processed shortly.\n\nThank you for your purchase!\n\nBest regards,\nYour Company Name`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error.stack);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
