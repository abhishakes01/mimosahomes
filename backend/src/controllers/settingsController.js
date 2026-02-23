const { Setting } = require('../models');

const settingsController = {
    // Admin: Get all settings
    getSettings: async (req, res) => {
        try {
            const settings = await Setting.findAll();
            const settingsMap = {};
            settings.forEach(s => settingsMap[s.key] = s.value);
            res.json(settingsMap);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch settings', details: error.message });
        }
    },

    // Admin: Update settings
    updateSettings: async (req, res) => {
        try {
            const { key, value } = req.body;
            if (!key) return res.status(400).json({ error: 'Key is required' });

            let setting = await Setting.findByPk(key);
            if (setting) {
                setting.value = value;
                await setting.save();
            } else {
                setting = await Setting.create({ key, value });
            }
            res.json({ message: 'Setting updated successfully', setting });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update setting', details: error.message });
        }
    }
};

module.exports = settingsController;
