/** @format */

const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const tinybeedb = require('../dbconnections/db');
const env = require('../env-loader');

exports.returnOrder = async (orderId, userInfo) => {
	let [order, shiprocketOrder] = await Promise.all([
		tinybeedb.query(
			`SELECT uo.*,p.razor_payment_id,p.amount FROM user_orders uo
        LEFT JOIN payments p ON p.receipt_id = uo.payment_receipt_id
        WHERE status IN ('received') AND order_id = ? AND user_id = ?`,
			[orderId, userInfo.id]
		),
		tinybeedb.query(`SELECT * FROM shipment_orders WHERE order_id = ?`, [orderId]),
	]);

	order = order[0][0];
	shiprocketOrder = shiprocketOrder[0][0];

	if (!order) {
		return {
			status: StatusCodes.BAD_REQUEST,
			message: 'order not found',
		};
	}
	let refundStatus = 'refund_requested';

	// intiate refund from razorpay
	if (order.razor_payment_id) {
		const refundResponse = await callRazorpayRefund(order.razor_payment_id, { amount: order.amount });
		const fields = ['order_refund_id', 'order_id', 'refund_status', 'amount', 'receipt', 'payment_id', 'speed_processed', 'speed_requested', 'refund_payload'];
		const placeHolder = '?,'.repeat(fields.length).replace(/,$/, '');
		await tinybeedb.query(`INSERT INTO order_refund (${fields.join()}) VALUES (${placeHolder})`, [refundResponse.id, orderId, refundResponse.status, refundResponse.amount, refundResponse.receipt, refundResponse.payment_id, refundResponse.speed_processed, refundResponse.speed_requested, JSON.stringify(refundResponse)]);
		refundStatus = `refund_${refundResponse.status}`;
	}

	// cancel shiprocket shipment
	if (!shiprocketOrder.awb_code) {
		await cancelShiprocketOrder(shiprocketOrder.awb_code);
		await tinybeedb.query(`UPDATE shipment_orders SET shipment_status = 'cancellation_requested' WHERE order_id = ?`, [orderId]);
	}

	await tinybeedb.query(`UPDATE user_orders SET status = ? WHERE order_id = ?`, [refundStatus, orderId]);

	return {
		status: StatusCodes.OK,
		message: 'refund requested',
	};
};

const callRazorpayRefund = async (paymentId, data) => {
	const response = await axios({
		method: 'POST',
		url: `${env.RAZOR_API}/payments/${paymentId}/refund`,
		data,
	});

	return response.data;
};

const cancelShiprocketOrder = async (awbId) => {
	const response = await axios({
		method: 'POST',
		url: `https://apiv2.shiprocket.in/v1/external/orders/cancel/shipment/awbs`,
		data: {
			awbs: [awbId],
		},
	});

	return response.data;
};
