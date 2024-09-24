/** @format */

const wishlistHelper = require('../helper/wishlist-helper');
const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../utils/error-handler');

exports.getUserWishList = async (req, res) => {
	try {
		let userInfo = req.decoded;
		let result = await wishlistHelper.getWishlistProducts(userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.addToWishlist = async (req, res) => {
	try {
		let userInfo = req.decoded;
		let { product_code } = req.body;

		if (!product_code) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'product_code is requried',
			});
		}

		let result = await wishlistHelper.addWishlistProduct(product_code, userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.removeFromWishlist = async (req, res) => {
	try {
		let userInfo = req.decoded;
		let { product_code } = req.query;

		if (!product_code) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'product_code is requried',
			});
		}

		let result = await wishlistHelper.deleteWishlistProduct(product_code, userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};
