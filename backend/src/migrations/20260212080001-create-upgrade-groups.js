'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create table if not exists
        await queryInterface.createTable('upgrade_groups', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            order: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }).catch(() => {
            console.log('Table upgrade_groups might already exist.');
        });

        // Seed initial data only if table is empty
        const [existingGroups] = await queryInterface.sequelize.query('SELECT slug FROM upgrade_groups');
        const existingSlugs = existingGroups.map(g => g.slug);

        const initialGroups = [
            { name: 'External', slug: 'external' },
            { name: 'Internal', slug: 'internal' },
            { name: 'Services', slug: 'services' },
            { name: 'Other', slug: 'other' }
        ];

        const toInsert = initialGroups
            .filter(g => !existingSlugs.includes(g.slug))
            .map((g, index) => ({
                id: Sequelize.fn('gen_random_uuid'),
                name: g.name,
                slug: g.slug,
                order: index,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            }));

        if (toInsert.length > 0) {
            await queryInterface.bulkInsert('upgrade_groups', toInsert);
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('upgrade_groups');
    }
};
