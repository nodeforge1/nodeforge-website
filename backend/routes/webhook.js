const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const crypto = require('crypto');
// Set Stripe webhook secret from your dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
      const secret = process.env.PAYSTACK_SECRET_KEY;
  
      const hash = crypto.createHmac('sha512', secret)
          .update(JSON.stringify(req.body))
          .digest('hex');

      const signature = req.headers['x-paystack-signature'];
      if (hash !== signature) {
          return res.status(401).json({
              status: "error",
              message: "Invalid signature",
          });
      }
  const event = req.body;
  if (event.event === "charge.success") {
      const {reference} = event.data;
      // Update order status in your database
      await Order.findByIdAndUpdate(reference, {payment_status: "paid"});
      // console.log(`Order ${reference} marked as paid`);
      // Send a response to Paystack
      // to acknowledge receipt of the event
      // This is important to prevent Paystack from retrying the event
      // and sending it multiple times
      res.json({ received: true });
  } else {
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
