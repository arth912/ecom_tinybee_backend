/** @format */

const cartHelper = require('../helper/cart-helper');
const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../utils/error-handler');

exports.getCart = async (req, res) => {
	try {
		let userInfo = req.decoded;
		let result = await cartHelper.getCart(userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.addToCart = async (req, res) => {
	try {
		let userInfo = req.decoded;
		let { product_code, quatity } = req.body;

		if (!product_code) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'product_code is requried',
			});
		}

		if (!parseInt(quatity)) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'quatity is missing or invalid : expected value > 0',
			});
		}

		let result = await cartHelper.addToCart(product_code, quatity, userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.removeFromCart = async (req, res) => {
	try {
		let userInfo = req.decoded;
		let { product_code } = req.query;

		if (!product_code) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'product_code is requried',
			});
		}

		let result = await cartHelper.removeProductFromCart(product_code, userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};
