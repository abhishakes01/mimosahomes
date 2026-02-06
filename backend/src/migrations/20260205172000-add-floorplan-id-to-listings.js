'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('listings', 'floorplan_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'floor_plans',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('listings', 'floorplan_id');
    }
};
