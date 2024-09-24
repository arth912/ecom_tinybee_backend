/** @format */

const { StatusCodes } = require('http-status-codes');
const tinybeedb = require('../dbconnections/db');
const { amountToTotal, getProductImages } = require('../utils/common');

exports.getOrderHistory = async (page = 1, limit = 30, userInfo) => {
	let [count, result] = await Promise.all([
		tinybeedb.query(`SELECT COUNT(*) as count FROM user_orders WHERE user_id=? ORDER BY created_at DESC`, [userInfo.id]),
		tinybeedb.query(
			`SELECT us.order_id,us.payment_receipt_id,us.status,p.amount,us.delivery_address_id,
            p.updated_at as paidOn, so.awb_code,so.shipment_id, so.shipment_status
            FROM user_orders us JOIN payments p ON p.receipt_id=us.payment_receipt_id
            LEFT JOIN shipment_orders so ON so.order_id = us.order_id
            WHERE us.user_id=? ORDER BY us.created_at DESC`,
			[userInfo.id]
		),
	]);
	count = count[0][0].count;
	const pages = Math.ceil(count / limit);
	if (result[0].length == 0) {
		return {
			status: StatusCodes.NOT_FOUND,
			message: 'No orders found',
		};
	}
	result = result[0];
	const orderIds = result.map((ele) => ele.order_id);

	const deliveryAddressIds = result.map((ele) => ele.delivery_address_id);
	const [orderRows, deliveryAddress] = await Promise.all([getOrderRows(orderIds), getDeliveryAddressById(deliveryAddressIds)]);
	result.forEach((row) => {
		row.amount = amountToTotal(row.amount);
		row.orderRows = orderRows[row.order_id];
		row.deliveryAddress = deliveryAddress[row.delivery_address_id];
	});
	return { status: StatusCodes.OK, totalRecords: count, pages, data: result };
};

exports.getOrderDetails = async (orderId, userInfo) => {
	const result = await tinybeedb.query(
		`SELECT us.order_id,us.payment_receipt_id,us.status,p.amount,
		p.updated_at as paidOn
		FROM user_orders us JOIN payments p ON p.receipt_id=us.receipt_id
		WHERE us.order_id=? ORDER BY us.created_at DESC`,
		[userInfo.id]
	);

	if (result[0].length == 0) {
		return {
			status: StatusCodes.NOT_FOUND,
			message: 'No orders found',
		};
	}

	const orderRows = await getOrderRows([orderId]);
};

const getOrderRows = async (orderIds) => {
	let result = await tinybeedb.query(`SELECT o.*,p.product_name FROM order_row o JOIN products p ON p.product_code=o.product_code WHERE order_id IN (${orderIds.join()})`);
	if (result[0].length == 0) {
		return [];
	}
	result = result[0];
	const response = {};
	let productIds = result.map((ele) => ele.product_code);
	const productImages = await getProductImages(productIds, false);
	result.map((product) => (product.images = productImages[product.product_code] || null));

	orderIds.forEach((orderId) => (response[orderId] = result.filter((row) => row.order_id == orderId)));

	return response;
};

const getDeliveryAddressById = async (deliveryAddressIds) => {
	const result = await tinybeedb.query(`SELECT * FROM delivery_address WHERE delivery_address_id IN (${deliveryAddressIds.join()})`);
	const response = {};
	deliveryAddressIds.forEach((id) => (response[id] = result[0].find((ele) => ele.delivery_address_id == id) || null));
	return response;
};
