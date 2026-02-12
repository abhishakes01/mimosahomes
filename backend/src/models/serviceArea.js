'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ServiceArea extends Model {
        static associate(models) {
            // No associations for now
        }
    }
    ServiceArea.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coordinates: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: []
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'ServiceArea',
        tableName: 'service_areas',
        underscored: true,
    });
    return ServiceArea;
};
