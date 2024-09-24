/** @format */

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const env = require('../env-loader');
const { StatusCodes } = require('http-status-codes');
const tinybeedb = require('../dbconnections/db');
const { getProductImages } = require('../utils/common');

exports.getProducts = async (page = 1, limit = 100) => {
	let offset = (page - 1) * limit;

	let [count, products] = await Promise.all([
		tinybeedb.query(`SELECT COUNT(*) as count FROM products limit ?,?`, [offset, limit]),
		// tinybeedb.query(`SELECT * FROM products limit ?,?`, [
		//     offset, limit
		// ])
		tinybeedb.query(`SELECT t1.*,
			CASE 
				WHEN t1.product_stock > 0 THEN "true"
				ELSE "false"
			END AS is_stock,t2.old_price salePrice,t2.new_price offerprice,CURRENT_TIMESTAMP AS Created FROM products t1 INNER JOIN  
			(SELECT product_code,old_price,new_price,updated_at FROM price_update_history AS puh
			WHERE (product_code, updated_at) IN ( SELECT product_code,MAX(updated_at) AS max_updated_at FROM price_update_history GROUP BY product_code) ) t2
			ON t1.product_code=t2.product_code
		`),
	]);
	count = count[0][0].count;
	products = products[0];
	let productIds = products.map((ele) => ele.product_code);
	const productImages = await getProductImages(productIds, false);
	products.map((product) => (product.images = productImages[product.product_code] || null));
	const data = {
		total: count,
		totalPages: Math.ceil(count / limit),
		products,
	};
	return {
		status: StatusCodes.OK,
		data: products.length > 0 ? data : undefined,
		message: products.length == 0 ? 'no data found' : undefined,
	};
};

exports.getFilterProducts = async (category, minPrice, sort, maxPrice, search, page = 1, limit = 100) => {
	let offset = (page - 1) * limit;

	let whereQuery = '';
	if (category) {
		category = category.replace(',', '%" OR product_category like "%');
		whereQuery += `WHERE (product_category like "%${category}%")`;
	}
	if (minPrice) {
		if (whereQuery != '') {
			whereQuery += `AND price between ${minPrice} AND ${maxPrice}`;
		} else {
			whereQuery += `WHERE price between ${minPrice} AND ${maxPrice}`;
		}
	}
	if (search) {
		if (whereQuery != '') {
			whereQuery += `AND (product_name like "%${search}%" OR product_desc LIKE "%${search}%" OR product_material like "%${search}%" OR product_category LIKE "%${search}%")`;
		} else {
			whereQuery += `WHERE (product_name like "%${search}%" OR product_desc LIKE "%${search}%" OR product_material like "%${search}%" OR product_category LIKE "%${search}%")`;
		}
	}
	if (sort) {
		if (sort.toLowerCase() === 'low') {
			whereQuery += ` ORDER by price`;
		} else if (sort.toLowerCase() === 'high') {
			whereQuery += ` Order by price desc`;
		}
	}

	let [count, products] = await Promise.all([tinybeedb.query(`SELECT COUNT(*) as count FROM products ${whereQuery} limit ?,?`, [offset, limit]), tinybeedb.query(`SELECT * FROM products ${whereQuery}`)]);
	count = count[0][0].count;
	products = products[0];
	let productIds = products.map((ele) => ele.product_code);
	const productImages = await getProductImages(productIds, false);
	products.map((product) => (product.images = productImages[product.product_code] || null));
	const data = {
		total: count,
		totalPages: Math.ceil(count / limit),
		products,
	};
	return {
		status: StatusCodes.OK,
		data: products.length > 0 ? data : undefined,
		message: products.length == 0 ? 'no data found' : undefined,
	};
};

exports.getProductByProductCode = async (productCode) => {
	let product = await tinybeedb.query(`SELECT * FROM products WHERE product_code=?`, [productCode]);
	product = product[0];

	if (product.length == 0) {
		return {
			status: StatusCodes.NOT_FOUND,
			message: 'No product with product code found',
		};
	}
	product = product[0];
	const productImages = await getProductImages([productCode]);
	product.images = productImages[product.product_code] || null;
	return {
		status: StatusCodes.OK,
		data: product,
	};
};

exports.addProduct = async (productData) => {
	let { productCode, name, category, dimensions, price, description, images } = productData;

	let isExist = await this.productExist(productCode);

	if (isExist) {
		return {
			status: StatusCodes.CONFLICT,
			message: 'product with product code alreadt exist',
		};
	}


        'sales_price': '',
        'offer_price': '',
        'product_dimension': '',
        'quantity': '',
        'product_material': '',
        'age_group': ''

	'product_code','product_category','product_name','product_desc','price','product_dimension','age_group','product_material','product_stock'  

	const productFields = ['product_code','product_category','product_name','product_desc','price','product_dimension','age_group','product_material','product_stock'];
	const placeHolder = '?,'.repeat(productFields.length).replace(/,$/, '');

	let result = await tinybeedb.query(`INSERT INTO products (${productFields.join(',')}) VALUES (${placeHolder})`, [productCode, category, name, description, price, dimensions || null]);

	if (images.length > 0) {
		let seq = 1;
		for (const image of images) {
			const chuncks = image.originalname.split('.');
			const ext = chuncks[chuncks.length - 1];
			let fileName = `${productCode}_${seq}.${ext}`;
			await saveImageToDisk(fileName, image.buffer);
			seq += 1;
		}
	}

	return {
		status: StatusCodes.OK,
		message: 'product added successfully',
	};
};

exports.updateProduct = async (productData) => {
	let { id, productCode, name, category, dimensions, price, description, images } = productData;

	let [productCodeExist, productExist] = await Promise.all([tinybeedb.query('SELECT * FROM products WHERE product_id=?', [id]), this.productExist(productCode)]);

	if (productCodeExist[0].length == 0) {
		return {
			status: StatusCodes.CONFLICT,
			message: 'product with product id not found',
		};
	}

	if (productExist == 0) {
		return {
			status: StatusCodes.NOT_FOUND,
			message: 'product with product code already exist',
		};
	}
	existingData = productExist;

	await tinybeedb.query(
		`UPDATE products SET product_code=?, product_category=?, product_name=?,
        product_desc=?, price=?, product_dimension=? WHERE product_id=?`,
		[productCode || existingData?.product_code, category || category, name != undefined ? name : existingData?.product_name || '', description != undefined ? description : existingData?.product_desc || '', price || existingData?.price, dimensions != undefined ? dimensions : existingData?.product_dimension || '', id]
	);

	if (images) {
		if (images.length == 0) {
			await deleteProductImages(productCode);
		}
		if (images.length > 0) {
			await deleteProductImages(productCode);
			let seq = 1;
			for (const image of images) {
				const chuncks = image.originalname.split('.');
				const ext = chuncks[chuncks.length - 1];
				let fileName = `${productCode}_${seq}.${ext}`;
				await saveImageToDisk(fileName, image.buffer);
				seq += 1;
			}
		}
	}

	return {
		status: StatusCodes.OK,
		message: 'product updated successfully',
	};
};

exports.deleteProduct = async (productCode) => {
	let isExist = await this.productExist(productCode);
	if (!isExist) {
		return {
			status: StatusCodes.NOT_FOUND,
			message: 'product with productCode not found',
		};
	}
	let id = isExist.product_id;
	let [result] = await Promise.all([tinybeedb.query('DELETE FROM products WHERE product_id=?', [id]), tinybeedb.query('DELETE FROM product_images WHERE product_id=?', [id])]);

	return {
		status: StatusCodes.OK,
		meesage: 'product deleted successfully',
		affectRows: result[0].affectedRows,
	};
};

exports.getRelatedProducts = async (productCode) => {
	let product = await this.productExist(productCode);
	if (!product) {
		return {
			status: StatusCodes.NOT_FOUND,
			message: 'product with productCode not found',
		};
	}

	const productCategory = product.product_category;

	if (!productCategory) {
		return {
			status: StatusCodes.NOT_FOUND,
			message: 'product category not found',
		};
	}
	let relatedProducts = await tinybeedb.query(`SELECT * FROM products WHERE product_category=? AND product_code<>?`, [productCategory, productCode]);

	relatedProducts = relatedProducts[0];
	if (relatedProducts.length == 0) {
		return {
			status: StatusCodes.OK,
			message: 'no data found',
		};
	}
	let productIds = relatedProducts.map((ele) => ele.product_code);
	const productImages = await getProductImages(productIds, false);
	relatedProducts.map((product) => (product.images = productImages[product.product_code] || null));

	return {
		status: StatusCodes.OK,
		data: relatedProducts,
	};
};

exports.productExist = async (productCode) => {
	let isExist = await tinybeedb.query('SELECT * FROM products WHERE product_code=?', [productCode]);
	return isExist[0][0];
};

exports.updateProductStock = async (file) => {
	const workbook = xlsx.read(file.buffer);
	const sheets = workbook.Sheets;
	for (const sheetName of Object.keys(sheets)) {
		const sheet = sheets[sheetName];
		const data = xlsx.utils.sheet_to_csv(sheet);
		let switchQuery = 'CASE ';
		for (const row of data.split('\n')) {
			const [productCode, stock] = row.split(',');
			switchQuery += ` WHEN product_code='${productCode}' THEN ${stock}`;
		}
		switchQuery += ' ELSE product_stock END ';
		let query = `UPDATE products SET product_stock = (${switchQuery})`;
		await tinybeedb.query(query);
	}
	return { status: StatusCodes.OK, message: 'Product Stock updated' };
};

exports.getProductCategoryList = async () => {
	let categories = await tinybeedb.query(`SELECT DISTINCT product_category FROM products`, []);
	categories = categories[0];
	// let categoryArray = {
	// 	'categories': categories.map((result) => result.product_category)
	// }
	if (categories.length == 0) {
		return {
			status: StatusCodes.NOT_FOUND,
			message: 'No Category found',
		};
	}
	return {
		status: StatusCodes.OK,
		data: categories,
	};
};

const saveImageToDisk = async (fileName, data) => {
	const imagePath = path.resolve(env.IMG_PATH);
	if (!fs.existsSync(imagePath)) {
		fs.mkdirSync(imagePath, { recursive: true });
	}
	fs.writeFileSync(path.join(imagePath, fileName), data);
};

const deleteProductImages = async (productCode) => {
	const imagePath = path.resolve(`${env.IMG_PATH}`);
	const regexp = new RegExp(`${productCode}_*`, 'ig');
	fs.readdirSync(imagePath)
		.filter((ele) => regexp.test(ele))
		.map((f) => fs.unlinkSync(path.join(imagePath, f)));
};
