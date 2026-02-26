'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('listings', 'service_area_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'service_areas',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        await queryInterface.addIndex('listings', ['service_area_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('listings', 'service_area_id');
    }
};
