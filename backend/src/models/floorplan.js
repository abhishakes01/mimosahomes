'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FloorPlan extends Model {
        static associate(models) {
            // Many-to-many with Facade through facade_floorplans
            FloorPlan.belongsToMany(models.Facade, {
                through: models.FacadeFloorPlan,
                foreignKey: 'floorplan_id',
                otherKey: 'facade_id',
                as: 'facades'
            });

            // One-to-many with Listing
            FloorPlan.hasMany(models.Listing, {
                foreignKey: 'floorplan_id',
                as: 'listings'
            });
        }
    }

    FloorPlan.init({
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
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        min_frontage: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        min_depth: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        total_area: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        car_spaces: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ground_floor_area: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        first_floor_area: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        garage_area: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        porch_area: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        alfresco_area: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        stories: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        bedrooms: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 4
        },
        bathrooms: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 2
        },
        collection: {
            type: DataTypes.ENUM('V_Collection', 'M_Collection'),
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'FloorPlan',
        tableName: 'floor_plans',
        underscored: true,
    });

    return FloorPlan;
};
