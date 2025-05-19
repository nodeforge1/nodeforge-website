const express = require('express');
const router = express.Router();

const { initiatePayment, verifyPayment } = require('../controllers/paymentController');

router.post('/initiate', initiatePayment);
router.get('/verify', verifyPayment);

module.exports = router;