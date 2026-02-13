const { UpgradeCategory, Upgrade } = require('../models');

exports.getAllCategories = async (req, res, next) => {
    try {
        const { group, is_active } = req.query;
        const where = {};

        if (group) where.group = group;
        if (is_active !== undefined) where.is_active = is_active === 'true';

        const categories = await UpgradeCategory.findAll({
            where,
            include: [{
                model: Upgrade,
                as: 'upgrades',
                where: is_active !== undefined ? { is_active: is_active === 'true' } : {},
                required: false // Include categories even if they have no upgrades
            }],
            order: [
                ['order', 'ASC'],
                ['created_at', 'ASC'],
                [{ model: Upgrade, as: 'upgrades' }, 'price', 'ASC']
            ]
        });

        res.json(categories);
    } catch (error) {
        next(error);
    }
};

exports.createCategory = async (req, res, next) => {
    try {
        const category = await UpgradeCategory.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const category = await UpgradeCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });

        await category.update(req.body);
        res.json(category);
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await UpgradeCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });

        await category.destroy();
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Upgrades

exports.createUpgrade = async (req, res, next) => {
    try {
        const upgrade = await Upgrade.create(req.body);
        res.status(201).json(upgrade);
    } catch (error) {
        next(error);
    }
};

exports.updateUpgrade = async (req, res, next) => {
    try {
        const upgrade = await Upgrade.findByPk(req.params.id);
        if (!upgrade) return res.status(404).json({ error: 'Upgrade not found' });

        await upgrade.update(req.body);
        res.json(upgrade);
    } catch (error) {
        next(error);
    }
};

exports.deleteUpgrade = async (req, res, next) => {
    try {
        const upgrade = await Upgrade.findByPk(req.params.id);
        if (!upgrade) return res.status(404).json({ error: 'Upgrade not found' });

        await upgrade.destroy();
        res.json({ message: 'Upgrade deleted successfully' });
    } catch (error) {
        next(error);
    }
};
