const express = require('express');
const router = express.Router();
const upgradeController = require('../controllers/upgradeController');
// Public routes (for Quote Builder)
router.get('/categories', upgradeController.getAllCategories);

// Category Management (Admin)
router.post('/categories', upgradeController.createCategory);
router.put('/categories/:id', upgradeController.updateCategory);
router.delete('/categories/:id', upgradeController.deleteCategory);

// Upgrade Group Management (Admin)
const upgradeGroupController = require('../controllers/upgradeGroupController');
router.get('/groups', upgradeGroupController.getAllGroups);
router.post('/groups', upgradeGroupController.createGroup);
router.put('/groups/:id', upgradeGroupController.updateGroup);
router.delete('/groups/:id', upgradeGroupController.deleteGroup);

// Upgrade Management (Admin)
router.post('/upgrades', upgradeController.createUpgrade);
router.put('/upgrades/:id', upgradeController.updateUpgrade);
router.delete('/upgrades/:id', upgradeController.deleteUpgrade);

module.exports = router;
