const paystack = require("../utils/paystack");
const { v4: uuidv4 } = require("uuid");
const getExchangeRate = require("../utils/getExchangeRate");
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
exports.initiatePayment = async (req, res) => {
  const {
    line_items,
    order_description,
    shippingInfo,
    customer,
  } = req.body;

  // console.log(line_items);


  if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
    return res.status(400).json({ message: "Invalid product details" });
  }

  // Calculate total price
  const totalAmountUSD = line_items.reduce((sum, item) => {
    return sum + (item.price_data.unit_amount / 100) * (item.quantity || 1);
  }, 0);

  // Generate a unique order ID
  const orderID = "ORD" + Date.now();

  // Create an order with 'Pending' status
  const order = new Order({
    orderID,
    order_description,
    shippingInfo,
    customer,
    totalPrice: totalAmountUSD,
    orderStatus: "pending",
    paymentMethod: "card",
    subtotal: totalAmountUSD,
    warranty: "2 years",
    shippingPolicy: "Free shipping on orders above $500",
    customerSupport: "24/7 Customer support via Live chat and Telegram",
  });

  const savedOrder = await order.save();

  try {
    const rate = await getExchangeRate();
    // console.log(rate);
    const amountInNaira = totalAmountUSD * rate; // Convert amount to Naira using the exchange rate
    // console.log(amountInNaira);
    const amountInKobo = amountInNaira * 100; // Convert to Kobo for Paystack
    // console.log(amountInKobo);

    const response = await paystack.post("/transaction/initialize", {
      email: customer.email,
      amount: Math.ceil(amountInKobo), // Paystack requires the amount in kobo
      reference: uuidv4(),
      metadata: order_description,
      currency: "NGN",
      callback_url: `${process.env.DOMAIN_2}/payments/callback`,
      cancel_url: `${process.env.DOMAIN_2}/canceled`
    });

    // console.log(response.data);

    res.json({
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
      changed_ngn: amountInNaira,
      usdAmount: amount,
      exchangeRate: rate,
      status: response.data.status,
      message: response.data.message,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error initiating payment",
      error: error.response ? error.response.data : error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const { reference } = req.query;

  try {
    const response = await paystack.get(`/transaction/verify/${reference}`);

    if (response.data.status === "success") {
      // Todo: Update order status in your database
      const order = await Order.findOneAndUpdate(
        { orderID: response.data.data.metadata },
        { payment_status: "paid" },
        { new: true }
      );
      // console.log(`Order ${order.orderID} marked as paid`);
      // Send a confirmation email to the customer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: order.customer.email,
        subject: "Payment Confirmation",
        text: `Dear ${order.customer.name},\n\nYour payment of ${response.data.data.amount} has been successfully received.\n\nThank you for your order!\n\nBest regards,\nNodeForge Team`,
      };
      await transporter.sendMail(mailOptions);
      // console.log("Payment confirmation email sent");
      // Send a response to the client
      res.json({
        status: response.data.status,
        message: "Payment verified successfully",
        data: response.data.data,
      });
    } else {
      res.status(400).json({
        status: response.data.status,
        message: "Payment verification failed",
        error: response.data.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error verifying payment",
      error: error.response ? error.response.data : error.message,
    });
  }
};

exports.paymentCallback = async (req, res) => {
  const { reference } = req.query;

  res.send(`
    <html>
        <head>
            <title>Payment Callback</title>
        </head>
        <body>
            <h1>Payment Callback</h1>
            <p>Reference: ${reference}</p>
            <p>Please check your payment status.</p>
        </body>
    </html>
    `);
};
