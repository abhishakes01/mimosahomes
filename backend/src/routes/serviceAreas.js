const express = require('express');
const router = express.Router();
const serviceAreaController = require('../controllers/serviceAreaController');

router.get('/', serviceAreaController.getAllServiceAreas);
router.post('/', serviceAreaController.createServiceArea);
router.get('/:id', serviceAreaController.getServiceArea);
router.put('/:id', serviceAreaController.updateServiceArea);
router.delete('/:id', serviceAreaController.deleteServiceArea);

module.exports = router;
