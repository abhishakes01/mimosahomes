'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('floor_plans', 'collection', {
            type: Sequelize.ENUM('V_Collection', 'M_Collection'),
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('floor_plans', 'collection');
        // Drop the ENUM type if it's no longer used
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_floor_plans_collection";');
    }
};
