/** @format */

const axios = require('axios');
const moment = require('moment-timezone');
const { StatusCodes } = require('http-status-codes');
const env = require('../env-loader');
const tinybeedb = require('../dbconnections/db');

const tokenType = 'shiprocket';

exports.createNewShipment = async (data) => {
	try {
		const { length = 100, breadth = 50, height = 10, weight = 0.5, pickup_location = 'primary' } = data;
		const token = await getToken();

		if (!token) {
			return { status: StatusCodes.BAD_REQUEST, message: 'auth token not found' };
		}

		const shipmentRequested = await shipmentExist(data.orderId);
		if (shipmentRequested) {
			return { status: StatusCodes.BAD_REQUEST, message: 'shipment already created' };
		}

		let order = await tinybeedb.query(
			`SELECT uo.order_id as order_id, uo.created_at as order_date, d.*,u.email,p.amount as sub_total
        FROM user_orders uo 
        JOIN delivery_address d ON d.delivery_address_id = uo.delivery_address_id
        JOIN users u ON u.id = uo.user_id
        JOIN payments p ON p.receipt_id = uo.payment_receipt_id
        WHERE uo.order_id = ?`,
			[data.orderId]
		);

		order = order[0][0];

		if (!order) {
			return { status: StatusCodes.NOT_FOUND, message: 'order not found' };
		}

		let orderItems = await tinybeedb.query(
			`SELECT r.*,p.product_name
        FROM order_row r
        JOIN products p ON p.product_code = r.product_code
        WHERE r.order_id = ?`,
			[order.order_id]
		);

		if (orderItems[0].length == 0) {
			return { status: StatusCodes.NOT_FOUND, message: 'order is empty' };
		}

		orderItems = orderItems[0].map((ele) => ({ name: ele.product_name, sku: ele.product_code, units: ele.quantity, selling_price: ele.price }));
		const sub_total = order.sub_total / 100;
		const shipment = {
			order_id: data.orderId,
			order_date: order.order_date,
			courier_id: data.courier_id,
			channel_id: env.SHIPROCKET_CHANNEL_ID,
			billing_customer_name: order.first_name,
			billing_last_name: order.last_name,
			billing_address: `${order.house_no ? order.house_no + ',' : ''}${order.street1}`,
			billing_address_2: [order.street2, order.landmark].filter((ele) => ele).join(','),
			billing_city: order.city,
			billing_pincode: order.zipcode,
			billing_state: order.state,
			billing_country: order.country,
			billing_email: order.email,
			billing_phone: order.phone,
			shipping_is_billing: true,
			order_items: orderItems,
			payment_method: 'Prepaid',
			sub_total: sub_total,
			length: length,
			breadth: breadth,
			height: height,
			weight: weight,
			pickup_location: pickup_location,
		};

		//set to true in the production
		shipment.request_pickup = false;

		let response = await axios({
			method: 'POST',
			url: `${env.SHIPROCKET_BASE_URL}/shipments/create/forward-shipment`,
			data: shipment,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const fields = ['shipment_id', 'order_id', 'shipment_order_id', 'courier_id', 'channel_id', 'awb_code', 'weight', 'height', 'length', 'breadth', 'pickup_location', 'shiprocket_request', 'shiprocket_response'];
		const placeholder = '?,'.repeat(fields.length).replace(/,$/, '');

		response = response.data;
		if (!response.payload) {
			response.payload = {};
		}
		await tinybeedb.query(`INSERT INTO shipment_orders (${fields.join()}) VALUES (${placeholder})`, [response.payload.shipment_id, order.order_id, response.payload.order_id, shipment.courier_id, shipment.channel_id, response.payload.awb_code, shipment.weight, shipment.height, shipment.length, shipment.breadth, shipment.pickup_location, JSON.stringify(shipment), JSON.stringify(response)]);
		return { status: StatusCodes.OK, data: response };
	} catch (error) {
		return {
			status: StatusCodes.INTERNAL_SERVER_ERROR,
			message: error.message,
		};
	}
};

exports.getCourierFreights = async (data) => {
	const { pickup_postcode, delivery_postcode, weight } = data;
	const cod = 0;

	const token = await getToken();

	if (!token) {
		return { status: StatusCodes.NOT_FOUND, message: 'auth token not found' };
	}
	const response = await axios({
		method: 'get',
		url: `${env.SHIPROCKET_BASE_URL}/courier/serviceability?pickup_postcode=${pickup_postcode}&delivery_postcode=${delivery_postcode}&weight=${weight}&cod=${cod}`,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	return { status: StatusCodes.OK, data: response.data };
};

exports.shiprocketWebhookHandler = async (data) => {
	try {
		console.log('received hook', data);
		await tinybeedb.query(`INSERT INTO shipment_webhook (order_id,webhook_data,created_at) VALUES (?,?,?)`, [data.order_id, JSON.stringify(data), new Date()]);
		await tinybeedb.query(`UPDATE shipment_orders SET awb_code=?,shipment_status=? WHERE order_id=?`, [data.awb, data.shipment_status, data.order_id]);
		await tinybeedb.query(`UPDATE user_orders SET status=? WHERE order_id=?`, [data.shipment_status, data.order_id]);
	} catch (error) {
		console.log(error);
	}
};

const shipmentExist = async (orderId) => {
	let result = await tinybeedb.query(`SELECT * FROM shipment_orders WHERE order_id=? LIMIT 1`, [orderId]);

	return result[0][0];
};

const getToken = async () => {
	let now = moment();
	let token = await tinybeedb.query(`SELECT * FROM auth_token WHERE type=?`, [tokenType]);
	token = token[0][0];

	if (!token) {
		return refreshToken();
	}

	let daysPassed = now.diff(moment(token.updated_at, 'YYYY-MM-DD HH:mm:ss'), 'days');

	if (daysPassed > 9) {
		return refreshToken();
	}

	return token.token;
};

const refreshToken = async () => {
	const token = await getAuthTokenFromAPI();

	await tinybeedb.query(`UPDATE auth_token SET token=?, updated_at=? WHERE type=?`, [token, new Date(), tokenType]);

	return token;
};

const getAuthTokenFromAPI = async () => {
	const response = await axios({
		method: 'POST',
		url: `${env.SHIPROCKET_BASE_URL}/auth/login`,
		data: {
			email: env.SHIPROCKET_USER,
			password: env.SHIPROCKET_PASSWORD,
		},
	});

	return response.data.token;
};
