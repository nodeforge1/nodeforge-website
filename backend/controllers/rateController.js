const axios = require("axios");

exports.getDollarToNaira = async (req, res) => {
    try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/latest/USD`);
        const nairaRate = response.data.conversion_rates.NGN;
        res.json({
            rate: nairaRate,
            base: 'USD',
            target: 'NGN',
          });
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch exchange rate',
            error: error.message
        });
    }
}