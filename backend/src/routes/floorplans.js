const express = require('express');
const router = express.Router();
const floorplanController = require('../controllers/floorplanController');

router.get('/', floorplanController.getAllFloorPlans);
router.get('/:id', floorplanController.getFloorPlanById);
router.post('/', floorplanController.createFloorPlan);
router.put('/:id', floorplanController.updateFloorPlan);
router.delete('/:id', floorplanController.deleteFloorPlan);

module.exports = router;
