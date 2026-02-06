const { FloorPlan } = require('../models');

exports.getAllFloorPlans = async (req, res, next) => {
    try {
        const floorplans = await FloorPlan.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json(floorplans);
    } catch (error) {
        next(error);
    }
};

exports.getFloorPlanById = async (req, res, next) => {
    try {
        const floorplan = await FloorPlan.findByPk(req.params.id);
        if (!floorplan) return res.status(404).json({ error: 'Floor plan not found' });
        res.json(floorplan);
    } catch (error) {
        next(error);
    }
};

exports.createFloorPlan = async (req, res, next) => {
    try {
        const floorplan = await FloorPlan.create(req.body);
        res.status(201).json(floorplan);
    } catch (error) {
        next(error);
    }
};

exports.updateFloorPlan = async (req, res, next) => {
    try {
        const floorplan = await FloorPlan.findByPk(req.params.id);
        if (!floorplan) return res.status(404).json({ error: 'Floor plan not found' });

        await floorplan.update(req.body);
        res.json(floorplan);
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
