/** @format */

const router = require('express').Router();
const auth = require('../middleware/auth');
const paymentCtrl = require('../controller/payment-controller');

router.get('/delivery-addresses', [auth.validateToken], (req, res) => {
	return paymentCtrl.getDeliveryAddresses(req, res);
});

router.post('/checkout', [auth.validateToken], (req, res) => {
	return paymentCtrl.checkout(req, res);
});

router.post('/confirmation', [auth.validateToken], (req, res) => {
	return paymentCtrl.paymentConfirmation(req, res);
});

router.post('/delivery-addresses/add', [auth.validateToken], (req, res) => {
	return paymentCtrl.addDeliveryAddress(req, res);
});

router.post('/delivery-addresses/update', [auth.validateToken], (req, res) => {
	return paymentCtrl.updateDeliveryAddress(req, res);
});

router.put('/delivery-addresses', [auth.validateToken], (req, res) => {
	return paymentCtrl.setDefultAddress(req, res);
});

router.delete('/delivery-addresses', [auth.validateToken], (req, res) => {
	return paymentCtrl.deleteDeliveyAddress(req, res);
});

router.post('/checkPincode', (req, res) => {
	return paymentCtrl.getStatePinCode(req, res);
});

module.exports = router;
