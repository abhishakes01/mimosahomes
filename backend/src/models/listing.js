'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Listing extends Model {
        static associate(models) {
            // Belongs to Facade
            Listing.belongsTo(models.Facade, {
                foreignKey: 'facade_id',
                as: 'facade'
            });

            // Belongs to FloorPlan
            Listing.belongsTo(models.FloorPlan, {
                foreignKey: 'floorplan_id',
                as: 'floorplan'
            });

            // Belongs to ServiceArea (Region)
            Listing.belongsTo(models.ServiceArea, {
                foreignKey: 'service_area_id',
                as: 'region'
            });
        }
    }
    Listing.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('house_land', 'ready_built', 'display_home'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('available', 'deposit_taken', 'sold'),
            defaultValue: 'available'
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        facade_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        floorplan_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        service_area_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true
        },
        collection: {
            type: DataTypes.ENUM('V_Collection', 'M_Collection'),
            allowNull: true
        },
        images: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: []
        },
        land_size: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        building_size: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        highlights: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: []
        },
        builder_name: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Mitra Homes'
        },
        outdoor_features: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        agent_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        agent_email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        agent_phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        agent_image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Listing',
        tableName: 'listings',
        underscored: true,
    });
    return Listing;
};
