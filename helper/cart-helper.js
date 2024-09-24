/** @format */

const { StatusCodes } = require('http-status-codes');
const tinybeedb = require('../dbconnections/db');
const { getProductImages } = require('../utils/common');
const { productExist } = require('./product-helper');

exports.getCart = async (userInfo) => {
	let cart = await tinybeedb.query(
		`SELECT c.cart_row_id,c.cart_id,c.quantity,p.* 
        FROM user_cart uc JOIN cart c ON c.cart_id=uc.cart_id AND uc.user_id=?
        JOIN products p ON p.product_code=c.product_code
        order by c.cart_row_id`,
		[userInfo.id]
	);

	let data = cart[0];
	if (data.length > 0) {
		let productIds = data.map((ele) => ele.product_code);
		const productImages = await getProductImages(productIds);
		data.map((product) => (product.images = productImages[product.product_code] || null));
	}
	return {
		status: StatusCodes.OK,
		data,
	};
};

exports.addToCart = async (productCode, quantity, userInfo) => {
	let [productValid, cartExist, productInCart] = await Promise.all([
		productExist(productCode),
		tinybeedb.query('SELECT * FROM user_cart WHERE user_id=?', [userInfo.id]),
		tinybeedb.query(
			`SELECT uc.*,cart_row_id,product_code,quantity FROM user_cart uc JOIN cart c ON c.cart_id=uc.cart_id 
            AND uc.user_id = ? AND c.product_code=?`,
			[userInfo.id, productCode]
		),
	]);

	let cartId = null;
	if (cartExist[0].length == 0) {
		cartId = await tinybeedb.query('INSERT INTO user_cart (user_id) values(?)', [userInfo.id]);

		cartId = cartId[0].insertId;
	} else {
		cartId = cartExist[0][0].cart_id;
	}

	if (!productValid) {
		return {
			status: StatusCodes.BAD_REQUEST,
			message: 'product with product_code does not exist',
		};
	}
	let result = null;
	if (productInCart[0].length > 0) {
		let cartRowId = productInCart[0][0].cart_row_id;
		result = await tinybeedb.query(`UPDATE cart SET quantity=?,price=?,updated_at=? WHERE cart_row_id=?`, [parseInt(productInCart[0]['quantity']) > parseInt(quantity) ? parseInt(productInCart[0]['quantity']) + 1 : quantity, productValid.price, new Date(), cartRowId]);
		result = result[0].affectedRows;
	} else {
		let fields = ['cart_id', 'product_code', 'quantity', 'price', 'created_at', 'updated_at'];
		let placeHolder = '?,'.repeat(fields.length).replace(/,$/, '');
		result = await tinybeedb.query(`INSERT INTO cart (${fields}) VALUES(${placeHolder})`, [cartId, productCode, quantity, productValid.price, new Date(), new Date()]);
		result = result[0].affectedRows;
	}

	return {
		status: StatusCodes.OK,
		message: 'product added successfully',
		affectedRows: result,
	};
};

exports.removeProductFromCart = async (productCode, userInfo) => {
	let cartRowId = await tinybeedb.query(
		`SELECT cart_row_id,uc.cart_id FROM user_cart uc 
    JOIN cart c ON c.cart_id=uc.cart_id AND uc.user_id=? AND c.product_code=?`,
		[userInfo.id, productCode]
	);
	let result = null;
	if (cartRowId[0].length > 0) {
		result = await tinybeedb.query(`DELETE FROM cart WHERE cart_row_id = ?`, [cartRowId[0][0].cart_row_id]);
		result = result[0].affectedRows;
	}
	return {
		status: StatusCodes.OK,
		message: 'product deleted successfully',
		affectedRows: result,
	};
};

exports.emptyCart = async (cartId, userInfo) => {
	let cartExist = await tinybeedb.query(`SELECT * FROM user_cart WHERE user_id=? AND cart_id=?`, [userInfo.id, cartId]);

	if (cartExist[0].length == 0) {
		return {
			status: StatusCodes.NOT_FOUND,
			message: 'cart not found',
		};
	}

	await tinybeedb.query('DELETE FROM cart WHERE cart_id=?', [cartId]);

	return {
		status: StatusCodes.OK,
		message: 'cart has been emptied',
	};
};
