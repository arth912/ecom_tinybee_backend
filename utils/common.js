/** @format */

const fs = require('fs');
const path = require('path');
const env = require('../env-loader');

exports.getProductImages = (productIds, fetchAll = true) => {
	let response = {};
	const imagePath = path.resolve(`${env.IMG_PATH}`);
	productIds.map((productId) => {
		const regexp = new RegExp(`${productId}_*`, 'i');
		if (!fs.existsSync(imagePath)) {
			productIds.forEach((id) => (response[id] = null));
			return response;
		}
		let images = fs.readdirSync(imagePath).filter((ele) => regexp.test(ele));
		if (fetchAll) {
			response[productId] = images.length > 0 ? images.map((image) => `${env.IMG_STATIC_URL}/${image}`) : null;
		} else {
			response[productId] = images[0] ? `${env.IMG_STATIC_URL}/${images[0]}` : null;
		}
	});
	return response;
};

exports.amountToTotal = (amount, currencyMultiplier = 100) => {
	return amount / currencyMultiplier;
};
