'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UpgradeGroup extends Model {
        static associate(models) {
            UpgradeGroup.hasMany(models.UpgradeCategory, {
                foreignKey: 'group_id',
                as: 'categories',
                onDelete: 'CASCADE'
            });
        }
    }

    UpgradeGroup.init({
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
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'UpgradeGroup',
        tableName: 'upgrade_groups',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return UpgradeGroup;
};
