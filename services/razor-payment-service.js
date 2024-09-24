/** @format */

const Razorpay = require('razorpay');
const env = require('../env-loader');

const razorpay = new Razorpay({
	key_id: env.RAZOR_API_KEY,
	key_secret: env.RAZOR_SECRET,
});

module.exports = razorpay;
