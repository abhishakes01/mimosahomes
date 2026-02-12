const { ServiceArea } = require('../models');

exports.getAllServiceAreas = async (req, res, next) => {
    try {
        const serviceAreas = await ServiceArea.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json(serviceAreas);
    } catch (error) {
        next(error);
    }
};

exports.createServiceArea = async (req, res, next) => {
    try {
        const { name, coordinates, is_active } = req.body;
        const newServiceArea = await ServiceArea.create({
            name,
            coordinates,
            is_active
        });
        res.status(201).json(newServiceArea);
    } catch (error) {
        next(error);
    }
};

exports.getServiceArea = async (req, res, next) => {
    try {
        const serviceArea = await ServiceArea.findByPk(req.params.id);
        if (!serviceArea) {
            return res.status(404).json({ error: 'Service Area not found' });
        }
        res.json(serviceArea);
    } catch (error) {
        next(error);
    }
};

exports.updateServiceArea = async (req, res, next) => {
    try {
        const { name, coordinates, is_active } = req.body;
        const serviceArea = await ServiceArea.findByPk(req.params.id);
        if (!serviceArea) {
            return res.status(404).json({ error: 'Service Area not found' });
        }

        await serviceArea.update({
            name,
            coordinates,
            is_active
        });

        res.json(serviceArea);
    } catch (error) {
        next(error);
    }
};

exports.deleteServiceArea = async (req, res, next) => {
    try {
        const serviceArea = await ServiceArea.findByPk(req.params.id);
        if (!serviceArea) {
            return res.status(404).json({ error: 'Service Area not found' });
        }

        await serviceArea.destroy();
        res.json({ message: 'Service Area deleted successfully' });
    } catch (error) {
        next(error);
    }
};
