/** @format */

const router = require('express').Router();
const loginCtrl = require('../controller/login-controller');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/role-autorization');

router.post('/login', (req, res) => {
	return loginCtrl.login(req, res);
});

router.post('/me', [auth.validateToken], (req, res) => {
	return loginCtrl.userData(req, res);
});

router.post('/change-password', [auth.validateToken], (req, res) => {
	return loginCtrl.changePassword(req, res);
});

router.post('/verification-email', (req, res) => {
	return loginCtrl.sendVerificationEmail(req, res);
});

router.post('/create-user', (req, res) => {
	return loginCtrl.createUser(req, res);
});

router.post('/user-list', (req, res) => {
	return loginCtrl.getUsers(req, res);
})

module.exports = router;
