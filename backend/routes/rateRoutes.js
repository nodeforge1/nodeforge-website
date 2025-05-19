// routes/rateRoutes.js
const express = require('express');
const router = express.Router();
const { getDollarToNaira } = require('../controllers/rateController');

router.get('/usd-ngn', getDollarToNaira);

module.exports = router;
