/** @format */

const nodemailer = require('nodemailer');
const env = require('../env-loader');

const transporter = nodemailer.createTransport({
	host: env.MAILER_PROVIDER,
	port: env.MAILER_PORT,
	auth: {
		user: env.MAILER_USER,
		pass: env.MAILER_PASSWORD,
	},
});

exports.sendEmail = async (to, subject, body, type = 'html') => {
	try {
		let emailConfig = {
			from: env.MAILER_FROM,
			to: to,
			subject: subject,
		};
		if (type == 'text') {
			emailConfig.text = body;
		} else {
			emailConfig.html = body;
		}
		const info = await transporter.sendMail(emailConfig);
		return { success: true, info };
	} catch (error) {
		console.log(`sending email ERROR:${error}`);
		return { success: false, error };
	}
};
