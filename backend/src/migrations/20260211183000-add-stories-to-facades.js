'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('facades', 'stories', {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            allowNull: false
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('facades', 'stories');
    }
};
