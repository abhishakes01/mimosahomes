'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FacadeVariant extends Model {
        static associate(models) {
            FacadeVariant.belongsTo(models.Facade, {
                foreignKey: 'facade_id',
                as: 'facade'
            });
        }
    }

    FacadeVariant.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        facade_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('facade', 'interior'),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'FacadeVariant',
        tableName: 'facade_variants',
        underscored: true,
    });

    return FacadeVariant;
};
