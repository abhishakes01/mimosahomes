const express = require('express');
const router = express.Router();
const captchaController = require('../controllers/captchaController');

router.get('/', captchaController.generateCaptcha);

module.exports = router;
