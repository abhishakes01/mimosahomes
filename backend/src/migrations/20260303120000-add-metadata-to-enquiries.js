'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('enquiries', 'metadata', {
            type: Sequelize.JSONB,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('enquiries', 'metadata');
    }
};
