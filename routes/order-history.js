/** @format */

const router = require('express').Router();
const auth = require('../middleware/auth');
const orderHistoryCtrl = require('../controller/order-history-controller');

router.post('/', [auth.validateToken], (req, res) => {
	return orderHistoryCtrl.getOrderHistory(req, res);
});

module.exports = router;
