'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('floor_plans', 'stories', {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('floor_plans', 'stories');
    }
};
