'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Get all existing groups
        const [groups] = await queryInterface.sequelize.query('SELECT id, name FROM upgrade_groups');

        if (groups.length === 0) {
            console.log('No groups found to seed categories into.');
            return;
        }

        const categories = [];

        for (const group of groups) {
            for (let i = 1; i <= 10; i++) {
                const name = `${group.name} Category ${i}`;
                categories.push({
                    id: uuidv4(),
                    name: name,
                    slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                    group_id: group.id,
                    group: group.name, // Keeping the old field for compatibility if still used
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        }

        if (categories.length > 0) {
            await queryInterface.bulkInsert('upgrade_categories', categories);
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('upgrade_categories', null, {});
    }
};
