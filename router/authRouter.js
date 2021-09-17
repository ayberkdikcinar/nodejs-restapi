const router = require('express').Router();
const authController = require('../controller/authController');


router.post('/login',authController.login);
router.post('/signup',authController.register);
router.get('/verify',authController.verifyEmail);

module.exports= router;