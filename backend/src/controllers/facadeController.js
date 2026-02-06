const { Facade, FloorPlan } = require('../models');

exports.getAllFacades = async (req, res, next) => {
    try {
        const facades = await Facade.findAll({
            include: [{
                model: FloorPlan,
                as: 'floorplans',
                through: { attributes: [] }
            }],
            order: [['created_at', 'DESC']]
        });
        res.json(facades);
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
        const { floorplan_ids, ...facadeData } = req.body;
        const facade = await Facade.create(facadeData);

        // Associate floor plans if provided
        if (floorplan_ids && floorplan_ids.length > 0) {
            const floorplans = await FloorPlan.findAll({
                where: { id: floorplan_ids }
            });
            await facade.setFloorplans(floorplans);
        }

        // Fetch with associations
        const result = await Facade.findByPk(facade.id, {
            include: [{
                model: FloorPlan,
                as: 'floorplans',
                through: { attributes: [] }
            }]
        });

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

exports.updateFacade = async (req, res, next) => {
    try {
        const { floorplan_ids, ...facadeData } = req.body;
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

        // Fetch with associations
        const result = await Facade.findByPk(facade.id, {
            include: [{
                model: FloorPlan,
                as: 'floorplans',
                through: { attributes: [] }
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
