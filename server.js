/** @format */

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const apiRoutes = require('./routes/index');
const port = 5000;

const app = express();

app.use(express.static('static'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	cors({
		origin: '*',
		allowedHeaders: '*',
		exposedHeaders: '*',
	})
);

// axios({
//     method: 'post',
//     url: 'https://api.tinybee.toys/login',
//     data: {
//         "email": "test@admin.com",
//         "password": "test123"
//     }
// }).then(d => {
//     console.log(d);
// }).catch(err => console.log(err))

app.use(apiRoutes);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
