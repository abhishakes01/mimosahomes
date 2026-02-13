'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableInfo = await queryInterface.describeTable('upgrade_categories');
        if (!tableInfo.group_id) {
            await queryInterface.addColumn('upgrade_categories', 'group_id', {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'upgrade_groups',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            });
        }

        // Migrate existing data from 'group' string to 'group_id'
        await queryInterface.sequelize.query(`
            UPDATE upgrade_categories c
            SET group_id = g.id
            FROM upgrade_groups g
            WHERE LOWER(c."group") = LOWER(g.name)
            AND c.group_id IS NULL
        `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('upgrade_categories', 'group_id');
    }
};
