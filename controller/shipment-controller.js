/** @format */

const shipmentHelper = require('../helper/shiprocket-helper');
const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../utils/error-handler');

exports.createNewShipment = async (req, res) => {
	try {
		let result = await shipmentHelper.createNewShipment(req.body);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.getCourierFreights = async (req, res) => {
	try {
		let userInfo = req.decoded;
		let { pickup_postcode, delivery_postcode, weight } = req.body;

		if (!pickup_postcode || !delivery_postcode || !weight) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'pickup_postcode, delivery_postcode, weight is required',
			});
		}

		let result = await shipmentHelper.getCourierFreights(req.body);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.shiprocketWebhookHandler = async (req, res) => {
	try {
		const data = req.body;
		await shipmentHelper.shiprocketWebhookHandler(data);
	} catch (error) {
	} finally {
		return res.status(200).send();
	}
};
