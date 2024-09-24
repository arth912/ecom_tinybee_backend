/** @format */

const router = require('express').Router();
const auth = require('../middleware/auth');
const shipmentCtrl = require('../controller/shipment-controller');

router.post('/new', [auth.validateToken], (req, res) => {
	return shipmentCtrl.createNewShipment(req, res);
});

router.post('/courier-freight', [auth.validateToken], (req, res) => {
	return shipmentCtrl.getCourierFreights(req, res);
});

router.post('/webhook', (req, res) => {
	return shipmentCtrl.shiprocketWebhookHandler(req, res);
});

module.exports = router;
