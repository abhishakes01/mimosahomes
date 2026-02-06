'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('listings', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            type: {
                type: Sequelize.ENUM('house_land', 'ready_built', 'display_home'),
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('available', 'deposit_taken', 'sold'),
                defaultValue: 'available'
            },
            land_size: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            house_size: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            bedrooms: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            bathrooms: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            cars: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            images: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                defaultValue: []
            },
            floorplan: {
                type: Sequelize.STRING,
                allowNull: true
            },
            latitude: {
                type: Sequelize.DECIMAL(10, 8),
                allowNull: true
            },
            longitude: {
                type: Sequelize.DECIMAL(11, 8),
                allowNull: true
            },
            collection: {
                type: Sequelize.ENUM('V_Collection', 'M_Collection'),
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('listings');
    }
};
