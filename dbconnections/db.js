/** @format */

const Bluebird = require('bluebird');
const mysql = require('mysql2/promise');
// const env = require('../env-loader');

const dbSettings = {
	host: '127.0.0.1',
	port: '3306',
	user: 'root', //'triad',
	password: 'Alpha256$$', //'@lpha256$$A',
	database: 'ecom_tinybee',
	multipleStatements: true,
	compress: true,
	connectTimeout: 20000,
};

var pool = mysql.createPool(dbSettings);

pool.execute('SELECT 1 + 1 AS solution').then((result) => {
	console.log('database connected');
});

// const pool = mysql.createPool(dbSettings)
// pool.query('SELECT 1+1 as solution')
//     .then((result) => {
//         console.log('tinybee database is connected');
//     })
//     .catch(err => {
//         console.log('tinybee database connection err:', err);
//     })
module.exports = pool;
