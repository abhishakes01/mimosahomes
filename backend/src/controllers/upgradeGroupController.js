const { UpgradeGroup } = require('../models');

exports.getAllGroups = async (req, res, next) => {
    try {
        const groups = await UpgradeGroup.findAll({
            where: req.query.is_active !== undefined ? { is_active: req.query.is_active === 'true' } : {},
            order: [['order', 'ASC']]
        });
        res.json(groups);
    } catch (error) {
        next(error);
    }
};

exports.createGroup = async (req, res, next) => {
    try {
        const group = await UpgradeGroup.create(req.body);
        res.status(201).json(group);
    } catch (error) {
        next(error);
    }
};

exports.updateGroup = async (req, res, next) => {
    try {
        const group = await UpgradeGroup.findByPk(req.params.id);
        if (!group) return res.status(404).json({ error: 'Group not found' });

        await group.update(req.body);
        res.json(group);
    } catch (error) {
        next(error);
    }
};

exports.deleteGroup = async (req, res, next) => {
    try {
        const group = await UpgradeGroup.findByPk(req.params.id);
        if (!group) return res.status(404).json({ error: 'Group not found' });

        await group.destroy();
        res.json({ message: 'Group deleted successfully' });
    } catch (error) {
        next(error);
    }
};
