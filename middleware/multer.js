/** @format */

const { StatusCodes } = require('http-status-codes');
const multer = require('multer');
const { handleError } = require('../utils/error-handler');

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 30 * 1024 * 1024, // 30MB
	},
});

exports.uploadMulti = (fieldName) => {
	const uploadMulti = upload.array(fieldName);
	return (req, res, next) => {
		uploadMulti(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					message: err.message,
				});
			} else if (err) {
				return handleError(req, res, err);
			}
			next();
		});
	};
};

exports.uploadOne = (fieldName) => {
	const uploadOne = upload.single(fieldName);
	return (req, res, next) => {
		uploadOne(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					status: StatusCodes.INTERNAL_SERVER_ERROR,
					message: err.message,
				});
			} else if (err) {
				return handleError(req, res, err);
			}
			next();
		});
	};
};
