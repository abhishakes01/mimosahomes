const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const validate = require('../middleware/validate');
const { z } = require('zod');

const createEnquirySchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    // phone is optional
});

router.post('/', validate(createEnquirySchema), enquiryController.createEnquiry);
router.get('/', enquiryController.getAllEnquiries);
router.get('/:id', enquiryController.getEnquiryById);
router.patch('/:id/status', enquiryController.updateEnquiryStatus);

module.exports = router;
