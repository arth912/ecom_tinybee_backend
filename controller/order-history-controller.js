/** @format */

const { StatusCodes } = require('http-status-codes');
const orderHistoryHelper = require('../helper/order-history-helper');
const { handleError } = require('../utils/error-handler');

exports.getOrderHistory = async (req, res) => {
	try {
		const { page = 1, limit = 30 } = req.body;
		const userInfo = req.decoded;
		let result = await orderHistoryHelper.getOrderHistory(page, limit, userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};
