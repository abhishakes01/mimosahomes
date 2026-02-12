'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('facades', 'is_active', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('facades', 'is_active');
    }
};
