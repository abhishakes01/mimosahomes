const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
// If auth middleware is needed later for put: const auth = require('../middleware/auth');

router.get('/', pageController.getAllPages);
router.get('/:slug', pageController.getPageBySlug);
router.put('/:slug', pageController.updatePage);

module.exports = router;
