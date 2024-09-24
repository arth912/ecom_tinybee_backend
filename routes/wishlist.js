/** @format */

const router = require('express').Router();
const auth = require('../middleware/auth');
const wishliatCtrl = require('../controller/wishlist-controller');

router.get('/', [auth.validateToken], (req, res) => {
	return wishliatCtrl.getUserWishList(req, res);
});

router.post('/', [auth.validateToken], (req, res) => {
	return wishliatCtrl.addToWishlist(req, res);
});

router.delete('/', [auth.validateToken], (req, res) => {
	return wishliatCtrl.removeFromWishlist(req, res);
});
module.exports = router;
