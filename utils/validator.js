/** @format */

exports.requireValidator = (obj = {}) => {
	for (const [_, value] of Object.entries(obj)) {
		return !(value == '' || value == null || value == undefined);
	}
	return false;
};
