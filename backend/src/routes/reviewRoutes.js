const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Public routes
router.post('/submit', reviewController.submitReview);
router.get('/approved', reviewController.getApprovedReviews);

// Admin routes (Note: In a real app, these should be protected by auth middleware)
router.get('/admin/all', reviewController.admin_getAllReviews);
router.put('/admin/status/:id', reviewController.admin_updateReviewStatus);
router.delete('/admin/:id', reviewController.admin_deleteReview);

module.exports = router;
