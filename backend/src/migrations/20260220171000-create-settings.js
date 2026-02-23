'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Settings', {
            key: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            value: {
                type: Sequelize.JSONB,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Seed default settings
        await queryInterface.bulkInsert('Settings', [
            {
                key: 'autoApproveReviews',
                value: JSON.stringify(false),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                key: 'admin_email',
                value: JSON.stringify('admin@mitrahomes.com.au'),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Settings');
    }
};
