const { Listing } = require('../models');
const { Op } = require('sequelize');

exports.getAllListings = async (req, res, next) => {
    try {
        const { type, collection, min_price, max_price, beds } = req.query;
        const where = {};
        const floorPlanWhere = {};

        if (type) where.type = type;
        if (collection) where.collection = collection;

        if (min_price || max_price) {
            where.price = {};
            if (min_price) where.price[Op.gte] = min_price;
            if (max_price) where.price[Op.lte] = max_price;
        }

        if (beds) {
            floorPlanWhere.bedrooms = { [Op.gte]: beds };
        }

        const listings = await Listing.findAll({
            where,
            include: [{
                model: require('../models').Facade,
                as: 'facade',
                include: [{
                    model: require('../models').FloorPlan,
                    as: 'floorplans',
                    through: { attributes: [] }
                }]
            }, {
                model: require('../models').FloorPlan,
                as: 'floorplan',
                where: Object.keys(floorPlanWhere).length > 0 ? floorPlanWhere : undefined
            }],
            order: [['created_at', 'DESC']]
        });
        res.json(listings);
    } catch (error) {
        next(error);
    }
};

exports.getListingById = async (req, res, next) => {
    try {
        const listing = await Listing.findByPk(req.params.id, {
            include: [{
                model: require('../models').Facade,
                as: 'facade',
                include: [{
                    model: require('../models').FloorPlan,
                    as: 'floorplans',
                    through: { attributes: [] }
                }]
            }, {
                model: require('../models').FloorPlan,
                as: 'floorplan'
            }]
        });
        if (!listing) return res.status(404).json({ error: 'Listing not found' });
        res.json(listing);
    } catch (error) {
        next(error);
    }
};

exports.createListing = async (req, res, next) => {
    try {
        // Extract only the fields that exist in the Listing model
        const {
            title, address, price, type, status,
            description, latitude, longitude,
            collection, facade_id, floorplan_id, images
        } = req.body;

        const listingData = {
            title, address, price, type, status,
            description, latitude, longitude,
            collection, facade_id, floorplan_id, images
        };

        const listing = await Listing.create(listingData);
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

exports.updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findByPk(req.params.id);
        if (!listing) return res.status(404).json({ error: 'Listing not found' });

        await listing.update(req.body);
        res.json(listing);
    } catch (error) {
        next(error);
    }
};

exports.deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findByPk(req.params.id);
        if (!listing) return res.status(404).json({ error: 'Listing not found' });

        await listing.destroy();
        res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        next(error);
    }
};
