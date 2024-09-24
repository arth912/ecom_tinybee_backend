/** @format */

const axios = require('axios');
const paymentService = require('../services/razor-payment-service');
const crypto = require('crypto');
const env = require('../env-loader');
const tinybeedb = require('../dbconnections/db');
const uuid = require('uuid');
const { StatusCodes } = require('http-status-codes');
const { emptyCart } = require('./cart-helper');

exports.checkout = async (products, deliveryAddress, userInfo, total, shipping = 0, discount = 0, gst = 0, cartId, currency = 'INR', currencyMultiplier = 100) => {
	const productIds = products.map((ele) => ele.product_code);

	let productResult = await tinybeedb.query(`SELECT * FROM products WHERE product_code IN ('${productIds.join("','")}')`);
	productResult = productResult[0];

	if (productResult.length == 0) {
		return {
			status: StatusCodes.BAD_REQUEST,
			message: 'no valid products found`',
		};
	}

	let deliveryAddressId = null;
	if (deliveryAddress.deliveryAddressId) {
		deliveryAddressId = await tinybeedb.query('SELECT * FROM delivery_address WHERE delivery_address_id=? AND user_id=? AND one_time_use=0', [deliveryAddress.deliveryAddressId, userInfo.id]);
		deliveryAddressId = deliveryAddressId[0];
		if (deliveryAddressId.length == 0) {
			return {
				status: StatusCodes.BAD_REQUEST,
				message: 'delivery address not found',
			};
		}
		deliveryAddressId = deliveryAddressId[0].delivery_address_id;
	} else {
		deliveryAddressId = await this.addDeliveryAddress(deliveryAddress, userInfo);
	}

	products = productResult.map((product) => ({
		product_code: product.product_code,
		price: product.price,
		amount: products.find((ele) => ele.product_code == product.product_code)?.quantity || 1,
	}));

	let paymentAmount = products.reduce((acc, cur) => acc + cur.price, 0);

	const receiptId = uuid.v4();
	const amount = parseFloat(total) * currencyMultiplier;

	let notes = {};
	//razor pay allow only 15 key max
	products.slice(0, 14).map((product) => (notes[product.product_code] = product.amount || 1));

	total = parseFloat(total) * currencyMultiplier;

	let response = await paymentService.orders.create({
		amount: parseFloat(total),
		currency: currency,
		receipt: receiptId,
		notes: notes,
	});

	const fields = ['receipt_id', 'amount', 'currency', 'notes', 'razor_order_id', 'payment_status', 'created_at', 'created_by'];
	const placeHolder = '?,'.repeat(fields.length).replace(/,$/, '');
	await tinybeedb.query(`INSERT INTO payments (${fields.join()}) VALUES (${placeHolder})`, [receiptId, amount, currency, JSON.stringify(notes), response.id, 0, new Date(), userInfo.id]);

	await Promise.allSettled(
		products.map((product) => {
			return tinybeedb.query(`UPDATE products SET product_stock = product_stock - ${product.amount} WHERE product_code = ?`, [product.product_code]);
		})
	);
	const userOrderId = await addUserOrder(receiptId, deliveryAddressId, products, userInfo);

	return {
		status: StatusCodes.OK,
		order_id: response.id,
		user_order_id: userOrderId,
	};
};

exports.paymentConfirmation = async (data, userInfo) => {
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartId } = data;

	const body = `${razorpay_order_id}|${razorpay_payment_id}`;

	const signature = crypto.createHmac('sha256', env.RAZOR_SECRET).update(body.toString()).digest('hex');

	if (signature !== razorpay_signature) {
		return {
			status: StatusCodes.BAD_REQUEST,
			message: 'payment failed',
		};
	}

	await tinybeedb.query(`UPDATE payments set razor_payment_id=?, razor_signature=?,payment_status=1,updated_at=? WHERE razor_order_id=?`, [razorpay_payment_id, razorpay_signature, new Date(), razorpay_order_id]);
	if (cartId) {
		await emptyCart(cartId, userInfo);
	}
	return {
		status: StatusCodes.OK,
		message: 'payment successful',
	};
};

exports.getDeliveryAddresses = async (userInfo) => {
	let result = await tinybeedb.query('SELECT * FROM delivery_address WHERE user_id=? AND one_time_use=0', [userInfo.id]);
	result = result[0];

	return {
		status: StatusCodes.OK,
		data: result.length > 0 ? result : undefined,
		message: result.length == 0 ? 'no data found' : undefined,
	};
};

exports.addDeliveryAddress = async (deliveryAddress, userInfo) => {
	const fields = ['user_id', 'first_name', 'last_name', 'house_no', 'street1', 'street2', 'landmark', 'city', 'district', 'state', 'zipcode', 'country', 'phone', 'one_time_use', 'is_default'];
	const placeHolder = '?,'.repeat(fields.length).replace(/,$/, '');

	let result = await tinybeedb.query(`INSERT INTO delivery_address (${fields.join()}) VALUES (${placeHolder})`, [
		userInfo.id,
		deliveryAddress.firstName || '',
		deliveryAddress.lastName || '',
		deliveryAddress.houseNr || '',
		deliveryAddress.street1 || '',
		deliveryAddress.street2 || '',
		deliveryAddress.landmark || '',
		deliveryAddress.city || '',
		deliveryAddress.state || '',
		deliveryAddress.district || '',
		deliveryAddress.zipcode || '',
		deliveryAddress.country || '',
		deliveryAddress.phone || '',
		deliveryAddress.one_time_use ?? 0,
		deliveryAddress.is_default ?? 0,
	]);
	const deliveryAddressId = result[0].insertId;
	if (deliveryAddress.is_default) {
		await tinybeedb.query('UPDATE delivery_address SET is_default=0 WHERE delivery_address_id<>? AND user_id=?', [deliveryAddressId, userInfo.id]);
	}

	return deliveryAddressId;
};

exports.updateDeliveryAddress = async (deliveryAddressId, deliveryAddress, userInfo) => {
	let isExist = await tinybeedb.query('SELECT * FROM delivery_address WHERE delivery_address_id=? AND user_id=?', [deliveryAddressId, userInfo.id]);

	if (isExist[0].length == 0) {
		return {
			status: StatusCodes.NOT_FOUND,
			message: 'no delivery address found',
		};
	}
	let result = await tinybeedb.query(
		`UPDATE delivery_address SET first_name=?,last_name=?,house_no=?,street1=?,
    street2=?,landmark=?,city=?,district=?,state=?,zipcode=?,country=?,phone=?,is_default=? 
    WHERE delivery_address_id=? AND user_id=?`,
		[deliveryAddress.firstName || '', deliveryAddress.lastName || '', deliveryAddress.houseNr || '', deliveryAddress.street1 || '', deliveryAddress.street2 || '', deliveryAddress.landmark || '', deliveryAddress.city || '', deliveryAddress.district || '', deliveryAddress.state || '', deliveryAddress.zipcode || '', deliveryAddress.country || '', deliveryAddress.phone || '', deliveryAddress.is_default ?? 0, deliveryAddressId, userInfo.id]
	);
	// const deliveryAddressId = result[0].insertId;
	// if (deliveryAddress.is_default) {
	// 	await tinybeedb.query('UPDATE delivery_address SET is_default=0 WHERE delivery_address_id<>? AND user_id=?', [deliveryAddressId, userInfo.id]);
	// }

	if (result[0].affectedRows <= 0) {
		return {
			status: StatusCodes.INTERNAL_SERVER_ERROR,
			message: 'something went wrong',
		};
	}
	return {
		status: StatusCodes.OK,
		message: 'address updated successfully',
		affectedRows: result[0].affectedRows,
	};
};

exports.setDefultAddress = async (deliveryAddressId, userInfo) => {
	let isExist = await tinybeedb.query('SELECT * FROM delivery_address WHERE delivery_address_id=? AND user_id=?', [deliveryAddressId, userInfo.id]);

	if (isExist[0].length == 0) {
		return {
			status: StatusCodes.NOT_FOUND,
			message: 'no delivery address found',
		};
	}
	await tinybeedb.query('UPDATE delivery_address SET is_default=0 WHERE delivery_address_id<>? AND user_id=?', [deliveryAddressId, userInfo.id]);

	let result = await tinybeedb.query('UPDATE delivery_address SET is_default=1 WHERE delivery_address_id=? AND user_id=?', [deliveryAddressId, userInfo.id]);

	return {
		status: StatusCodes.OK,
		message: 'address updated successfully',
		affectedRows: result[0].affectedRows,
	};
};

const addUserOrder = async (receiptId, deliveryAddressId, products, userInfo) => {
	const fields = ['user_id', 'delivery_address_id', 'payment_receipt_id', 'status', 'delivery_date', 'created_at', 'updated_at'];
	const placeHolder = '?,'.repeat(fields.length).replace(/,$/, '');

	let result = await tinybeedb.query(`INSERT INTO user_orders (${fields.join()}) VALUES (${placeHolder})`, [userInfo.id, deliveryAddressId, receiptId, 'received', null, new Date(), new Date()]);
	const order_id = result[0].insertId;
	await insertOrderRows(products, order_id);

	return order_id;
};

exports.deleteDeliveryAddress = async (deliveryAddressId, userInfo) => {
	let isExist = await tinybeedb.query('SELECT * FROM delivery_address WHERE delivery_address_id=? AND user_id=?', [deliveryAddressId, userInfo.id]);

	if (isExist[0].length == 0) {
		return {
			status: StatusCodes.NOT_FOUND,
			message: 'no delivery address found',
		};
	}
	let result = await tinybeedb.query('DELETE FROM delivery_address WHERE delivery_address_id=? AND user_id=?', [deliveryAddressId, userInfo.id]);

	if (isExist[0][0].is_default) {
		let result = await tinybeedb.query(`SELECT delivery_address_id FROM delivery_address WHERE user_id=? AND one_time_use = 0 LIMIT 1`, [userInfo.id]);
		if (result[0].length > 0) {
			await tinybeedb.query(`UPDATE delivery_address SET is_default=1 WHERE delivery_address_id=?`, [result[0][0].delivery_address_id]);
		}
	}
	return {
		status: StatusCodes.OK,
		message: 'address deleted',
		result: result[0].affectedRows,
	};
};

const insertOrderRows = async (products, order_id) => {
	const fields = ['order_id', 'product_code', 'price', 'quantity'];
	const rows = products.map((ele) => [order_id, ele.product_code, ele.price, ele.amount]);

	let result = await tinybeedb.query(`INSERT INTO order_row (${fields.join()}) VALUES ?`, [rows]);
	return result;
};

exports.getStateFromPostalCode = async (data) => {
	const { pincode } = data;
	let igst = false;

	const response = await axios({
		method: 'get',
		url: `https://api.postalpincode.in/pincode/${pincode}`,
	});

	if (response.status === 200) {
		if (response.data.length > 0) {
			if (response.data[0]['Status'] === 'Success' && response.data[0]['PostOffice'][0]['State'] !== 'Gujarat') {
				igst = true;
			}
		}
		return { status: StatusCodes.OK, data: response.data, igst: igst };
	}
	return { status: response.status, message: 'Error From API' };
};
