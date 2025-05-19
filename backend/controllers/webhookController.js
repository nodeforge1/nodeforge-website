const crypto = require('crypto');

exports.handleWebhook = async (req, res) => {

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
        console.log(`Order ${reference} marked as paid`);
        // Send a response to Paystack
        // to acknowledge receipt of the event
        // This is important to prevent Paystack from retrying the event
        // and sending it multiple times
       
        
        res.json({
            status: "success",
            message: "Payment verified successfully",
            data: event.data,
        })
    } else {
        res.status(400).json({
            status: "error",
            message: "Payment verification failed",
            error: event.message,
        });
    }
}
