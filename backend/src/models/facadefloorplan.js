'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FacadeFloorPlan extends Model {
        static associate(models) {
            // Associations can be defined here if needed
        }
    }

    FacadeFloorPlan.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        facade_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'facades',
                key: 'id'
            }
        },
        floorplan_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'floor_plans',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'FacadeFloorPlan',
        tableName: 'facade_floorplans',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false // Disable updatedAt since it's not in migration
    });

    return FacadeFloorPlan;
};
