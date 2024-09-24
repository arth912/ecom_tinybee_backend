/** @format */

const { StatusCodes } = require('http-status-codes');
const paymentHelper = require('../helper/payment-helper');
const { handleError } = require('../utils/error-handler');

exports.checkout = async (req, res) => {
	try {
		let { products, deliveryAddress = {}, deliveryAddressId, total, cartId = null, shipping = 0, discount = 0, gst = 0 } = req.body;
		const userInfo = req.decoded;
		if (!products || !Array.isArray(products) || products.length == 0) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'no products to checkout',
			});
		}

		if (!deliveryAddressId) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'delivery address id is not provided',
			});
		}

		let result = await paymentHelper.checkout(products, { deliveryAddressId }, userInfo, total, shipping, discount, gst);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.paymentConfirmation = async (req, res) => {
	try {
		let data = req.body;
		const userInfo = req.decoded;
		if (!data.razorpay_order_id) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'razorpay_order_id is required',
			});
		}

		if (!data.razorpay_payment_id) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'razorpay_payment_id is required',
			});
		}

		if (!data.razorpay_signature) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'razorpay_signature is required',
			});
		}
		let result = await paymentHelper.paymentConfirmation(data, userInfo);
		return res.status(StatusCodes.OK).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.getDeliveryAddresses = async (req, res) => {
	try {
		const userInfo = req.decoded;
		let result = await paymentHelper.getDeliveryAddresses(userInfo);
		return res.status(StatusCodes.OK).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.addDeliveryAddress = async (req, res) => {
	try {
		const userInfo = req.decoded;
		const deliveryAddress = req.body;

		let delivery_address_id = await paymentHelper.addDeliveryAddress(deliveryAddress, userInfo);
		return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, delivery_address_id });
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.updateDeliveryAddress = async (req, res) => {
	try {
		const userInfo = req.decoded;
		const { deliveryAddress, deliveryAddressId } = req.body;

		let result = await paymentHelper.updateDeliveryAddress(deliveryAddressId, deliveryAddress, userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.setDefultAddress = async (req, res) => {
	try {
		const userInfo = req.decoded;
		const { deliveryAddressId } = req.query;

		if (!deliveryAddressId) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'deliveryAddressId is required',
			});
		}

		let result = await paymentHelper.setDefultAddress(deliveryAddressId, userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.deleteDeliveyAddress = async (req, res) => {
	try {
		const userInfo = req.decoded;
		const { deliveryAddressId } = req.query;

		if (!deliveryAddressId) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'deliveryAddressId is required',
			});
		}

		let result = await paymentHelper.deleteDeliveryAddress(deliveryAddressId, userInfo);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.getStatePinCode = async (req, res) => {
	try {
		let { pincode } = req.body;

		if (!pincode) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'pincode is required',
			});
		}

		let result = await paymentHelper.getStateFromPostalCode(req.body);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};
