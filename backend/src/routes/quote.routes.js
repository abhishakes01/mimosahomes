'use strict';
const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quote.controller');

router.post('/share', quoteController.shareQuote);
router.get('/share/:id', quoteController.getSharedQuote);
router.post('/share/email', quoteController.sendQuoteEmail);

module.exports = router;
