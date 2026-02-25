const { FloorPlan } = require('../models');

exports.getAllFloorPlans = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { Facade } = require('../models');
        const { count, rows: floorplans } = await FloorPlan.findAndCountAll({
            order: [['created_at', 'DESC']],
            include: [{
                model: Facade,
                as: 'facades',
                through: { attributes: [] }
            }],
            distinct: true, // Important for correct count with includes
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            data: floorplans,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        next(error);
    }
};

exports.getFloorPlanById = async (req, res, next) => {
    try {
        const { Facade } = require('../models');
        const floorplan = await FloorPlan.findByPk(req.params.id, {
            include: [{
                model: Facade,
                as: 'facades',
                through: { attributes: [] }
            }]
        });
        if (!floorplan) return res.status(404).json({ error: 'Floor plan not found' });
        res.json(floorplan);
    } catch (error) {
        next(error);
    }
};

exports.createFloorPlan = async (req, res, next) => {
    try {
        const { facade_ids, ...floorPlanData } = req.body;
        const floorplan = await FloorPlan.create(floorPlanData);

        // Associate facades if provided
        if (facade_ids && facade_ids.length > 0) {
            const { Facade } = require('../models');
            const facades = await Facade.findAll({
                where: { id: facade_ids }
            });
            await floorplan.setFacades(facades);
        }

        // Fetch with associations
        const { Facade } = require('../models');
        const result = await FloorPlan.findByPk(floorplan.id, {
            include: [{
                model: Facade,
                as: 'facades',
                through: { attributes: [] }
            }]
        });

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

exports.updateFloorPlan = async (req, res, next) => {
    try {
        const { facade_ids, ...floorPlanData } = req.body;
        const floorplan = await FloorPlan.findByPk(req.params.id);
        if (!floorplan) return res.status(404).json({ error: 'Floor plan not found' });

        await floorplan.update(floorPlanData);

        // Update facade associations if provided
        if (facade_ids !== undefined) {
            const { Facade } = require('../models');
            const facades = await Facade.findAll({
                where: { id: facade_ids }
            });
            await floorplan.setFacades(facades);
        }

        // Fetch with associations
        const { Facade } = require('../models');
        const result = await FloorPlan.findByPk(floorplan.id, {
            include: [{
                model: Facade,
                as: 'facades',
                through: { attributes: [] }
            }]
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.deleteFloorPlan = async (req, res, next) => {
    try {
        const floorplan = await FloorPlan.findByPk(req.params.id);
        if (!floorplan) return res.status(404).json({ error: 'Floor plan not found' });

        await floorplan.destroy();
        res.json({ message: 'Floor plan deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getNewFloorPlansCount = async (req, res, next) => {
    try {
        const { Op } = require('sequelize');
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const count = await FloorPlan.count({
            where: {
                created_at: {
                    [Op.gte]: sevenDaysAgo
                }
            }
        });

        res.json({ count });
    } catch (error) {
        next(error);
    }
};

exports.getFloorPlanFilters = async (req, res, next) => {
    try {
        const { sequelize } = require('../models');

        // Fetch distinct values for dropdowns
        const [widths, depths, storeys] = await Promise.all([
            FloorPlan.findAll({
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('min_frontage')), 'value']],
                order: [[sequelize.col('min_frontage'), 'ASC']],
                raw: true
            }),
            FloorPlan.findAll({
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('min_depth')), 'value']],
                order: [[sequelize.col('min_depth'), 'ASC']],
                raw: true
            }),
            FloorPlan.findAll({
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('stories')), 'value']],
                order: [[sequelize.col('stories'), 'ASC']],
                raw: true
            })
        ]);

        res.json({
            widths: widths.map(w => w.value).filter(v => v != null),
            depths: depths.map(d => d.value).filter(v => v != null),
            storeys: storeys.map(s => s.value).filter(v => v != null)
        });
    } catch (error) {
        next(error);
    }
};
