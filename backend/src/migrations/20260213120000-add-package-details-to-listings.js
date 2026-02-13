'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('listings', 'land_size', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        });
        await queryInterface.addColumn('listings', 'building_size', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        });
        await queryInterface.addColumn('listings', 'highlights', {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: []
        });
        await queryInterface.addColumn('listings', 'builder_name', {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: 'Mitra Homes'
        });
        await queryInterface.addColumn('listings', 'outdoor_features', {
            type: Sequelize.TEXT,
            allowNull: true
        });
        await queryInterface.addColumn('listings', 'agent_name', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('listings', 'agent_email', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('listings', 'agent_phone', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('listings', 'agent_image', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('listings', 'land_size');
        await queryInterface.removeColumn('listings', 'building_size');
        await queryInterface.removeColumn('listings', 'highlights');
        await queryInterface.removeColumn('listings', 'builder_name');
        await queryInterface.removeColumn('listings', 'outdoor_features');
        await queryInterface.removeColumn('listings', 'agent_name');
        await queryInterface.removeColumn('listings', 'agent_email');
        await queryInterface.removeColumn('listings', 'agent_phone');
        await queryInterface.removeColumn('listings', 'agent_image');
    }
};
