const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

// Set Stripe webhook secret from your dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post("/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.order_id;

    // Update order status in the database
    await Order.findByIdAndUpdate(orderId, { payment_status: "paid" });

    console.log(`Order ${orderId} marked as paid`);
  }

  res.json({ received: true });
});

module.exports = router;
