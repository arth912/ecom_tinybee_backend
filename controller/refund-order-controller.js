/** @format */

const refundHelper = require('../helper/return-order-helper');
const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../utils/error-handler');

exports.refundOrder = async (req, res) => {
	try {
		let { orderId } = req.body;
		let userInfo = req.decoded;
		let result = await refundHelper.returnOrder(orderId, userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};
