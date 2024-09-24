/** @format */

const router = require('express').Router();
const auth = require('../middleware/auth');
const cartCtrl = require('../controller/cart-controller');

router.get('/', [auth.validateToken], (req, res) => {
	return cartCtrl.getCart(req, res);
});

router.post('/', [auth.validateToken], (req, res) => {
	return cartCtrl.addToCart(req, res);
});

router.delete('/', [auth.validateToken], (req, res) => {
	return cartCtrl.removeFromCart(req, res);
});
module.exports = router;
