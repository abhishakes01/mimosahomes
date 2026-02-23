const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// Admin routes (Protected by auth in real app)
router.get('/', settingsController.getSettings);
router.post('/', settingsController.updateSettings);

module.exports = router;
