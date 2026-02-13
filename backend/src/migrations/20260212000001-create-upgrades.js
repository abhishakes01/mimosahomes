'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create upgrade_categories table
        await queryInterface.createTable('upgrade_categories', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            group: {
                type: Sequelize.STRING,
                allowNull: false
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: false
            },
            order: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Create upgrades table
        await queryInterface.createTable('upgrades', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            category_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'upgrade_categories',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT
            },
            price: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            image_url: {
                type: Sequelize.STRING
            },
            is_standard: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            metadata: {
                type: Sequelize.JSON
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('upgrades');
        await queryInterface.dropTable('upgrade_categories');
    }
};
