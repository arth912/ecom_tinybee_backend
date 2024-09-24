/** @format */

const loginHelper = require('../helper/login-helper');
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../utils/error-handler');

exports.login = async (req, res) => {
	try {
		let { email, password } = req.body;
		if (!email || !password) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'email or password is missing in body',
			});
		}
		let result = await loginHelper.adminlogin(email, password);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.sendVerificationEmail = async (req, res) => {
	try {
		let { email } = req.body;
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'email is required in body',
			});
		}

		if (!regex.test(email)) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'invalid email',
			});
		}

		let result = await loginHelper.sendVerificationEmail(email);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.createUser = async (req, res) => {
	try {
		let { email, otp } = req.body;
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !otp) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'email or otp is missing in body',
			});
		}

		if (!regex.test(email)) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				message: 'invalid email',
			});
		}

		let result = await loginHelper.createUser(email, otp, req.body);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.userData = async (req, res) => {
	try {
		let userInfo = req.decoded;
		return res.status(200).json(userInfo);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.changePassword = async (req, res) => {
	try {
		let userInfo = req.decoded;
		let { oldPassword, newPassword } = req.body;
		let result = await loginHelper.changePassword(userInfo.id, oldPassword, newPassword, userInfo.password);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};

exports.getUsers = async (req, res) => {
	try {
		let { page, draw } = req.body;
		page = parseInt(page) || 1;
		draw = parseInt(draw) && parseInt(draw) <= 20 ? parseInt(draw) : 20;
		let result = await loginHelper.getUsers(page, draw);
		return res.status(result.status).json(result);
	} catch (error) {
		return handleError(req, res, error);
	}
};
