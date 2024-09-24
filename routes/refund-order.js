/** @format */

const router = require('express').Router();
const { validateToken } = require('../middleware/auth');
const refuntCtrl = require('../controller/refund-order-controller');

router.post('/', [validateToken], (req, res) => {
	return refuntCtrl.refundOrder(req, res);
});

module.exports = router;
