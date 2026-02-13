const { Listing } = require('../models');
const { Op } = require('sequelize');

exports.getAllListings = async (req, res, next) => {
    try {
        const { type, collection, min_price, max_price, beds, page = 1, limit = 10 } = req.query;
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

        const offset = (page - 1) * limit;

        const { count, rows: listings } = await Listing.findAndCountAll({
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
                where: Object.keys(floorPlanWhere).length > 0 ? floorPlanWhere : undefined,
                include: [{
                    model: require('../models').Facade,
                    as: 'facades',
                    through: { attributes: [] }
                }]
            }],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true
        });

        res.json({
            data: listings,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });
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

// Helper to sanitize numeric fields from empty strings to null
const sanitizeNumeric = (val) => {
    if (val === "" || val === undefined || val === null) return null;
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
};

exports.createListing = async (req, res, next) => {
    try {
        // Extract and sanitize numeric fields
        const {
            title, address, price, type, status,
            description, latitude, longitude,
            collection, facade_id, floorplan_id, images,
            land_size, building_size, highlights, builder_name,
            outdoor_features, agent_name, agent_email, agent_phone, agent_image
        } = req.body;

        const listingData = {
            title, address, type, status,
            description, collection, facade_id, floorplan_id, images,
            highlights, builder_name,
            outdoor_features, agent_name, agent_email, agent_phone, agent_image,
            price: sanitizeNumeric(price),
            latitude: sanitizeNumeric(latitude),
            longitude: sanitizeNumeric(longitude),
            land_size: sanitizeNumeric(land_size),
            building_size: sanitizeNumeric(building_size)
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

        const data = { ...req.body };
        const numericFields = ['price', 'latitude', 'longitude', 'land_size', 'building_size'];

        numericFields.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(data, field)) {
                data[field] = sanitizeNumeric(data[field]);
            }
        });

        await listing.update(data);
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
