/** @format */

const { StatusCodes } = require('http-status-codes');

exports.authorize = (roles = []) => {
	if (typeof roles == 'string') {
		roles = [roles];
	}

	return (req, res, next) => {
		if (!req.decoded?.role || !roles.includes(req.decoded?.role)) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				status: StatusCodes.UNAUTHORIZED,
				message: 'Unauthorized',
			});
		}
		return next();
	};
};
