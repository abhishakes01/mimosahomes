'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Facade extends Model {
        static associate(models) {
            // Many-to-many with FloorPlan through facade_floorplans
            Facade.belongsToMany(models.FloorPlan, {
                through: models.FacadeFloorPlan,
                foreignKey: 'facade_id',
                otherKey: 'floorplan_id',
                as: 'floorplans'
            });

            // One-to-many with Listing
            Facade.hasMany(models.Listing, {
                foreignKey: 'facade_id',
                as: 'listings'
            });

            // One-to-many with FacadeVariant
            Facade.hasMany(models.FacadeVariant, {
                foreignKey: 'facade_id',
                as: 'variants'
            });
        }
    }

    Facade.init({
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
        width: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        collection: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        stories: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Facade',
        tableName: 'facades',
        underscored: true,
    });

    return Facade;
};
