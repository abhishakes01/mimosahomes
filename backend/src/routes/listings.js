const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const validate = require('../middleware/validate');
const { z } = require('zod');

// Validation Schemas
const createListingSchema = z.object({
    body: z.object({
        title: z.string().min(3),
        address: z.string().min(5),
        price: z.coerce.number().positive(),
        type: z.enum(['house_land', 'ready_built', 'display_home']),
        status: z.string().optional(),
        description: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        collection: z.string().optional(),
        facade_id: z.string().optional(),
        floorplan_id: z.string().optional(),
        images: z.array(z.string()).optional()
    })
});

router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);
router.post('/', validate(createListingSchema), listingController.createListing);
router.put('/:id', listingController.updateListing);
router.delete('/:id', listingController.deleteListing);

module.exports = router;
