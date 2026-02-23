const { Review, Setting } = require('../models');

const reviewController = {
    // Public: Submit a review
    submitReview: async (req, res) => {
        try {
            const { name, email, rating, comment, captcha } = req.body;

            // Validate input
            if (!name || !email || !rating || !comment || !captcha) {
                return res.status(400).json({ error: 'All fields are required including CAPTCHA' });
            }

            // Verify CAPTCHA
            const storedCaptcha = req.signedCookies.captcha;
            if (!storedCaptcha || storedCaptcha !== captcha.toLowerCase()) {
                return res.status(400).json({ error: 'Invalid or expired CAPTCHA' });
            }

            // Get auto-approve setting
            const autoApproveSetting = await Setting.findByPk('autoApproveReviews');
            const autoApprove = autoApproveSetting ? (autoApproveSetting.value === true || autoApproveSetting.value === 'true') : false;

            const review = await Review.create({
                name,
                email,
                rating,
                comment,
                isApproved: autoApprove
            });

            res.status(201).json({
                message: autoApprove ? 'Review submitted and approved!' : 'Review submitted and awaiting moderation.',
                review
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to submit review', details: error.message });
        }
    },

    // Public: Get all approved reviews
    getApprovedReviews: async (req, res) => {
        try {
            const reviews = await Review.findAll({
                where: { isApproved: true },
                order: [['createdAt', 'DESC']]
            });
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
        }
    },

    // Admin: Get all reviews
    admin_getAllReviews: async (req, res) => {
        try {
            const reviews = await Review.findAll({
                order: [['createdAt', 'DESC']]
            });
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
        }
    },

    // Admin: Update review status
    admin_updateReviewStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { isApproved } = req.body;

            const review = await Review.findByPk(id);
            if (!review) return res.status(404).json({ error: 'Review not found' });

            review.isApproved = isApproved;
            await review.save();

            res.json({ message: `Review ${isApproved ? 'approved' : 'disapproved'} successfully`, review });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update review status', details: error.message });
        }
    },

    // Admin: Delete review
    admin_deleteReview: async (req, res) => {
        try {
            const { id } = req.params;
            const review = await Review.findByPk(id);
            if (!review) return res.status(404).json({ error: 'Review not found' });

            await review.destroy();
            res.json({ message: 'Review deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete review', details: error.message });
        }
    },

};

module.exports = reviewController;
