'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Drop the existing constraint and add it with CASCADE
        // First, we need to find the constraint name. Usually it's 'upgrade_categories_group_id_fkey'
        try {
            await queryInterface.removeConstraint('upgrade_categories', 'upgrade_categories_group_id_fkey');
        } catch (e) {
            console.log('Constraint not found, skipping removal.');
        }

        await queryInterface.addConstraint('upgrade_categories', {
            fields: ['group_id'],
            type: 'foreign key',
            name: 'upgrade_categories_group_id_fkey',
            references: {
                table: 'upgrade_groups',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('upgrade_categories', 'upgrade_categories_group_id_fkey');
        await queryInterface.addConstraint('upgrade_categories', {
            fields: ['group_id'],
            type: 'foreign key',
            name: 'upgrade_categories_group_id_fkey',
            references: {
                table: 'upgrade_groups',
                field: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });
    }
};
