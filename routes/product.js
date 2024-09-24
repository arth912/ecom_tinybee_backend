/** @format */

const router = require('express').Router();
const { validateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/role-autorization');
const productCtrl = require('../controller/product-controller');
const { uploadMulti, uploadOne } = require('../middleware/multer');

router.get('/', (req, res) => {
	return productCtrl.getProductByProductCode(req, res);
});

router.get('/category-list', (req, res) => {
	return productCtrl.getCategoryList(req, res);
});

router.get('/filtered-product', (req, res) => {
	return productCtrl.getFilteredProducts(req, res);
});

router.get('/related-products', (req, res) => {
	return productCtrl.getRelatedProducts(req, res);
});

router.post('/product-list', (req, res) => {
	return productCtrl.getProducts(req, res);
});

router.post('/add', [validateToken, authorize(['admin']), uploadMulti('images')], (req, res) => {
	return productCtrl.addProduct(req, res);
});

router.post('/update', [validateToken, authorize(['admin']), uploadMulti('images')], (req, res) => {
	return productCtrl.updateProduct(req, res);
});

router.post('/update/stock', [validateToken, uploadOne('file')], (req, res) => {
	return productCtrl.updateProductStock(req, res);
});

router.delete('/', [validateToken, authorize(['admin'])], (req, res) => {
	return productCtrl.deleteProduct(req, res);
});

module.exports = router;
