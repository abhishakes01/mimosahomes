'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('facades', 'collection', {
            type: Sequelize.STRING,
            allowNull: true,
            after: 'title'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('facades', 'collection');
    }
};
