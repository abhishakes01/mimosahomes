const express = require('express');
const router = express.Router();
const facadeController = require('../controllers/facadeController');

router.get('/', facadeController.getAllFacades);
router.get('/:id', facadeController.getFacadeById);
router.post('/', facadeController.createFacade);
router.put('/:id', facadeController.updateFacade);
router.delete('/:id', facadeController.deleteFacade);

module.exports = router;
