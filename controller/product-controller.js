/** @format */

const { StatusCodes } = require('http-status-codes');
const productHelper = require('../helper/product-helper');
const { handleError } = require('../utils/error-handler');

exports.getProducts = async (req, res) => {
	try {
		let { page, draw } = req.body;
		page = parseInt(page) || 1;
		draw = parseInt(draw) && parseInt(draw) <= 20 ? parseInt(draw) : 20;
		let result = await productHelper.getProducts(page, draw);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.getFilteredProducts = async (req, res) => {
	try {
		let { page, draw, category, minPrice, maxPrice, sort, search } = req.query;
		page = parseInt(page) || 1;
		draw = parseInt(draw) && parseInt(draw) <= 20 ? parseInt(draw) : 20;
		let result = await productHelper.getFilterProducts(category, minPrice, sort, maxPrice, search, page, draw);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.getProductByProductCode = async (req, res) => {
	try {
		let { productCode } = req.query;

		if (!productCode) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'productCode is required in query parameter',
			});
		}

		let result = await productHelper.getProductByProductCode(productCode);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.addProduct = async (req, res) => {
	try {
		let data = req.body;
		data.images = req.files;
		let result = await productHelper.addProduct(data);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.updateProduct = async (req, res) => {
	try {
		let data = req.body;
		data.images = req.files;
		let result = await productHelper.updateProduct(data);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		let productCode = req.query.productCode;

		if (!productCode) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'productCode is required',
			});
		}

		let result = await productHelper.deleteProduct(productCode);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.getRelatedProducts = async (req, res) => {
	try {
		let { productCode } = req.query;
		let result = await productHelper.getRelatedProducts(productCode);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.updateProductStock = async (req, res) => {
	try {
		const file = req.file;
		let result = await productHelper.updateProductStock(file);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.getCategoryList = async (req, res) => {
	try {
		let result = await productHelper.getProductCategoryList()
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};