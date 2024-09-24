/** @format */

const router = require('express').Router();
const adminRoutes = require('./admin');
const productRoutes = require('./product');
const cartRoutes = require('./cart');
const wishlistRoutes = require('./wishlist');
const paymentRoutes = require('./payment');
const orderHistoryRoutes = require('./order-history');
const shipmentRoutes = require('./shipment');
const refundRoutes = require('./refund-order');

router.use('/', adminRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/payment', paymentRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/order-history', orderHistoryRoutes);
router.use('/shipment', shipmentRoutes);
router.use('/refund', refundRoutes);

module.exports = router;
