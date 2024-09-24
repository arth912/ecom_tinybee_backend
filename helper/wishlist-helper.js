/** @format */

const { StatusCodes } = require('http-status-codes');
let tinybeedb = require('../dbconnections/db');
const { getProductImages } = require('../utils/common');

exports.getWishlistProducts = async (userInfo) => {
	let products = await tinybeedb.query(
		`SELECT p.* FROM user_wishlist uw 
    JOIN wishlist_product up ON up.wishlist_id=uw.wishlist_id AND uw.user_id=?
    JOIN products p ON p.product_code=up.product_code`,
		[userInfo.id]
	);
	products = products[0];
	if (products.length > 0) {
		const productIds = products.map((ele) => ele.product_code);
		const productImages = await getProductImages(productIds, false);
		products.map((product) => (product.images = productImages[product.product_code] || null));
	}
	return {
		status: products.length > 0 ? StatusCodes.OK : StatusCodes.NOT_FOUND,
		data: products.length > 0 ? products : undefined,
		message: products.length == 0 ? 'no data found' : undefined,
	};
};

exports.addWishlistProduct = async (productCode, userInfo) => {
	let [isExist, userWishlist] = await Promise.all([this.productExist(productCode), getUserWishlist(userInfo)]);

	if (!isExist) {
		return {
			status: StatusCodes.CONFLICT,
			message: 'product with product code does not exist',
		};
	}

	let wishlistId = null;
	if (!userWishlist) {
		wishlistId = await createWishList(userInfo);
	} else {
		wishlistId = userWishlist.wishlist_id;
	}

	let result = await tinybeedb.query(
		`REPLACE INTO wishlist_product (wishlist_id,product_code,created_at)
    VALUES (?,?,?)`,
		[wishlistId, productCode, new Date()]
	);

	return {
		status: StatusCodes.OK,
		message: 'product added to wishlist',
	};
};

exports.deleteWishlistProduct = async (productCode, userInfo) => {
	let [isExist, userWishlist] = await Promise.all([this.productExist(productCode), getUserWishlist(userInfo)]);

	if (!isExist) {
		return {
			status: StatusCodes.CONFLICT,
			message: 'product with product code does not exist',
		};
	}

	if (userWishlist) {
		await tinybeedb.query(`DELETE FROM wishlist_product WHERE product_code=? AND wishlist_id=?`, [productCode, userWishlist.wishlist_id]);
	}

	return {
		status: StatusCodes.OK,
		message: 'product deleted from wishlist',
	};
};

exports.productExist = async (productCode) => {
	let isExist = await tinybeedb.query('SELECT * FROM products WHERE product_code=?', [productCode]);
	return isExist[0][0];
};

const createWishList = async (userInfo) => {
	let result = await tinybeedb.query(`INSERT INTO user_wishlist (user_id) VALUES (?)`, [userInfo.id]);

	return result[0].insertId;
};

const getUserWishlist = async (userInfo) => {
	let result = await tinybeedb.query('SELECT * FROM user_wishlist WHERE user_id=?', [userInfo.id]);
	return result[0][0];
};

const productInWishlist = async (productId, wishlistId) => {
	let result = await tinybeedb.query('SELECT * FROM wishlist_product WHERE wishlist_id=? AND product_code=?', [wishlistId, productId]);
	return result[0][0];
};
