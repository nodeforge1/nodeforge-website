const axios = require('axios');

const getExchangeRate = async (req, res) => {
    const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

    response = await axios.get(url);
    return response.data.conversion_rates.NGN; // USD to NGN
}
module.exports = getExchangeRate;