'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('floor_plans', 'ground_floor_area', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        });
        await queryInterface.addColumn('floor_plans', 'first_floor_area', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        });
        await queryInterface.addColumn('floor_plans', 'garage_area', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        });
        await queryInterface.addColumn('floor_plans', 'porch_area', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        });
        await queryInterface.addColumn('floor_plans', 'alfresco_area', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('floor_plans', 'ground_floor_area');
        await queryInterface.removeColumn('floor_plans', 'first_floor_area');
        await queryInterface.removeColumn('floor_plans', 'garage_area');
        await queryInterface.removeColumn('floor_plans', 'porch_area');
        await queryInterface.removeColumn('floor_plans', 'alfresco_area');
    }
};
