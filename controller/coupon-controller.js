/** @format */

const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../utils/error-handler');
const { requireValidator } = require('../utils/validator');
const couponHelper = require('../helper/coupon-helper');

exports.addCouponCode = async (req, res) => {
	try {
		let { code } = req.body;
		const userInfo = req.decoded;

		if (!requireValidator({ code })) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'coupon code is required',
			});
		}
		const result = await couponHelper.addNewCouponCode(data, userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.updateCouponCode = async (req, res) => {
	try {
		let { code } = req.body;
		const userInfo = req.decoded;

		if (!requireValidator({ code })) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'coupon code is required',
			});
		}
		const result = await couponHelper.updateCouponCode(data, userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.deleteCouponCode = async (req, res) => {
	try {
		let { code } = req.body;
		const userInfo = req.decoded;

		if (!requireValidator({ code })) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'coupon code is required',
			});
		}
		const result = await couponHelper.deleteCouponCode(data, userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};
