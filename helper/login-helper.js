/** @format */

let tinybeedb = require('../dbconnections/db');
const generateToken = require('../middleware/auth').getJWTToken;
const { StatusCodes } = require('http-status-codes');
const { sendEmail } = require('../utils/mailer');
const moment = require('moment-timezone');
const { compareHash, hashText } = require('../utils/hash');
const { userData } = require('../controller/login-controller');

exports.adminlogin = async (email, password) => {
    let users = await tinybeedb.execute('SELECT * FROM users where email=?', [email]);
    if (users[0].length == 0) {
        return { status: StatusCodes.UNAUTHORIZED, message: 'Invalid credencials' };
    }
    users = users[0][0];
    const isValid = compareHash(users.password, password);
    if (!isValid) {
        return { status: StatusCodes.UNAUTHORIZED, message: 'Invalid credencials' };
    }

    let user = { ...users, role: users.role == 1 ? 'admin' : 'user' };
    let token = await generateToken(user);
    delete user.password;
    return { status: StatusCodes.OK, token: token, user: user };
};

exports.sendVerificationEmail = async (receiverEmail) => {
    let users = await tinybeedb.execute('SELECT * FROM users where email=?', [receiverEmail]);
    if (users[0].length > 0) {
        return { status: StatusCodes.FORBIDDEN, message: 'email already used' };
    }
    return sendOtpEmail(receiverEmail);
};

exports.createUser = async (email, otp, data) => {
    let validTime = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    let validOtp = await tinybeedb.query(`SELECT * FROM verification_otp WHERE email=? AND otp=? AND created_at <= '${validTime}'`, [email, otp]);

    if (validOtp[0].length == 0) {
        return { status: StatusCodes.UNAUTHORIZED, message: 'invalid otp or email' };
    }

    const fields = ['email', 'username', 'password', 'firstname', 'lastname', 'role'];
    const placeHolder = '?,'.repeat(fields.length).replace(/,$/, '');
    const hashed = await hashText(data.password);

    await tinybeedb.query(`INSERT INTO users (${fields.join()}) VALUES (${placeHolder})`, [email, data.username, hashed, data.firstname, data.lastname, 0]);
    await tinybeedb.query('DELETE FROM verification_otp WHERE email=?', [email]);
    return { status: StatusCodes.OK, message: 'user created successfully' };
};

exports.changePassword = async (userId, oldPassword, newPassword, userPassword) => {
    let hashed = await hashText(newPassword);
    const isValid = compareHash(userPassword, oldPassword);
    if (!isValid) {
        return { status: StatusCodes.UNAUTHORIZED, message: 'Invalid credencials' };
    }
    await tinybeedb.query('UPDATE users SET PASSWORD = ? WHERE id = ?;', [hashed, userId]);
    return { status: StatusCodes.OK, message: 'password change successfully' };
};

const sendOtpEmail = async (receiverEmail) => {
    const otp = Math.floor(Math.random() * 900000);
    const emailSubject = `Email Verfication for Registration`;

    const emailBody = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Toy Store OTP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f1f1; font-family: Arial, sans-serif;">

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
        <tr>
            <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="color: #153643; font-size: 28px; font-weight: bold; text-align: center;">
                            <img src="https://ecom.tinybee.toys/static/media/Tinybee-logo%20Light.52989750ffece17b6a4593e6c3ae196b.svg" alt="Toy Store Logo" width="300" height="100"/>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 0 30px 0; color: #153643; font-size: 24px; text-align: center;">
                            One-Time Password (OTP)
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 0 30px 0; color: #153643; font-size: 20px; text-align: center;">
                            Please use the following OTP to log in to your account:
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 0 30px 0; color: #e95b4f; font-size: 32px; font-weight: bold; text-align: center;">
                           ${otp}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 0 30px 0; color: #153643; font-size: 16px; text-align: center;">
                            This OTP is valid for the next 10 minutes. Do not share this OTP with anyone.
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">
                            <a href="https://your-toy-store-link.com" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #e95b4f; text-decoration: none; border-radius: 5px;">Visit Store</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#e95b4f" style="padding: 30px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="color: #ffffff; font-size: 14px; text-align: center;">
                            &copy; 2023 TinyBee. All rights reserved.
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #ffffff; font-size: 12px; text-align: center;">
                            H/10, Kalptaru Industrial Estate Moraiya, Sanand, Gujarat - 382213
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;

    const sent = await sendEmail(receiverEmail, emailSubject, emailBody);

    if (sent.success) {
        await tinybeedb.query(`INSERT INTO verification_otp (email,otp,created_at) VALUES (?,?,?)`, [receiverEmail, otp, new Date()]);
        return { status: StatusCodes.OK, message: 'verification email is sent' };
    }
    return { status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'error sending email', error: sent.error.message };
};



exports.getUsers = async (page = 1, limit = 100) => {
	let offset = (page - 1) * limit;

	let [count, users] = await Promise.all([
		tinybeedb.query(`SELECT COUNT(*) as count FROM users limit ?,?`, [offset, limit]),
		// tinybeedb.query(`SELECT * FROM products limit ?,?`, [
		//     offset, limit
		// ])
		tinybeedb.query(`SELECT t1.*,COUNT(t2.status) ordered, CURRENT_TIMESTAMP AS registered, 'Active' AS STATUS FROM users t1 LEFT JOIN
        user_orders t2 ON t1.id = t2.user_id
        GROUP BY t1.id`),
	]);
	count = count[0][0].count;
	users = users[0];
	const data = {
		total: count,
		totalPages: Math.ceil(count / limit),
		users,
	};
	return {
		status: StatusCodes.OK,
		data: users.length > 0 ? data : undefined,
		message: users.length == 0 ? 'no data found' : undefined,
	};
};