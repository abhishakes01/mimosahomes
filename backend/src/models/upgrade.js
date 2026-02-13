'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Upgrade extends Model {
        static associate(models) {
            Upgrade.belongsTo(models.UpgradeCategory, {
                foreignKey: 'category_id',
                as: 'category',
                onDelete: 'CASCADE'
            });
        }
    }

    Upgrade.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        category_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        image_url: {
            type: DataTypes.STRING
        },
        is_standard: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        metadata: {
            type: DataTypes.JSON
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'Upgrade',
        tableName: 'upgrades',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Upgrade;
};
