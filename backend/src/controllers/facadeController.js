const { Facade, FloorPlan, FacadeVariant } = require('../models');

exports.getAllFacades = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, is_active, stories } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (is_active !== undefined) {
            where.is_active = is_active === 'true' || is_active === true;
        }
        if (stories !== undefined) {
            where.stories = parseInt(stories);
        }

        const { count, rows: facades } = await Facade.findAndCountAll({
            where,
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true
        });

        res.json({
            data: facades,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        next(error);
    }
};

exports.getFacadeById = async (req, res, next) => {
    try {
        const facade = await Facade.findByPk(req.params.id, {
            include: [{
                model: FloorPlan,
                as: 'floorplans',
                through: { attributes: [] }
            },
            {
                model: FacadeVariant,
                as: 'variants'
            }]
        });
        if (!facade) return res.status(404).json({ error: 'Facade not found' });
        res.json(facade);
    } catch (error) {
        next(error);
    }
};

exports.createFacade = async (req, res, next) => {
    try {
        const { floorplan_ids, variants, ...facadeData } = req.body;
        const facade = await Facade.create(facadeData);

        // Associate floor plans if provided
        if (floorplan_ids && floorplan_ids.length > 0) {
            const floorplans = await FloorPlan.findAll({
                where: { id: floorplan_ids }
            });
            await facade.setFloorplans(floorplans);
        }

        // Create variants
        if (variants && Array.isArray(variants)) {
            await Promise.all(variants.map(variant => {
                return FacadeVariant.create({
                    ...variant,
                    facade_id: facade.id
                });
            }));
        }

        // Fetch with associations
        const result = await Facade.findByPk(facade.id, {
            include: [{
                model: FloorPlan,
                as: 'floorplans',
                through: { attributes: [] }
            },
            {
                model: FacadeVariant,
                as: 'variants'
            }]
        });

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

exports.updateFacade = async (req, res, next) => {
    try {
        const { floorplan_ids, variants, ...facadeData } = req.body;
        const facade = await Facade.findByPk(req.params.id);
        if (!facade) return res.status(404).json({ error: 'Facade not found' });

        await facade.update(facadeData);

        // Update floor plan associations if provided
        if (floorplan_ids !== undefined) {
            const floorplans = await FloorPlan.findAll({
                where: { id: floorplan_ids }
            });
            await facade.setFloorplans(floorplans);
        }

        // Update variants
        if (variants && Array.isArray(variants)) {
            // Simple sync strategy: delete all and recreate
            await FacadeVariant.destroy({ where: { facade_id: facade.id } });

            await Promise.all(variants.map(variant => {
                return FacadeVariant.create({
                    ...variant,
                    facade_id: facade.id
                });
            }));
        }

        // Fetch with associations
        const result = await Facade.findByPk(facade.id, {
            include: [{
                model: FloorPlan,
                as: 'floorplans',
                through: { attributes: [] }
            },
            {
                model: FacadeVariant,
                as: 'variants'
            }]
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.deleteFacade = async (req, res, next) => {
    try {
        const facade = await Facade.findByPk(req.params.id);
        if (!facade) return res.status(404).json({ error: 'Facade not found' });

        await facade.destroy();
        res.json({ message: 'Facade deleted successfully' });
    } catch (error) {
        next(error);
    }
};
