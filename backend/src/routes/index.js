const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const listingRoutes = require('./listings');
const enquiryRoutes = require('./enquiries');
const uploadRoutes = require('./uploadRoutes');
const floorplanRoutes = require('./floorplans');
const facadeRoutes = require('./facades');

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Mimosa Homes API' });
});

router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/upload', uploadRoutes);
router.use('/floorplans', floorplanRoutes);
router.use('/facades', facadeRoutes);
const serviceAreaRoutes = require('./serviceAreas');
router.use('/service-areas', serviceAreaRoutes);
const upgradeRoutes = require('./upgrades');
router.use('/upgrades', upgradeRoutes);
const pageRoutes = require('./pages');
router.use('/pages', pageRoutes);
const reviewRoutes = require('./reviewRoutes');
router.use('/reviews', reviewRoutes);
const settingsRoutes = require('./settings');
router.use('/settings', settingsRoutes);

const captchaRoutes = require('./captchaRoutes');
router.use('/captcha', captchaRoutes);

module.exports = router;
