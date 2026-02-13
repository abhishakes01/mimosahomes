'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UpgradeCategory extends Model {
        static associate(models) {
            UpgradeCategory.belongsTo(models.UpgradeGroup, {
                foreignKey: 'group_id',
                as: 'upgrade_group'
            });
            UpgradeCategory.hasMany(models.Upgrade, {
                foreignKey: 'category_id',
                as: 'upgrades',
                onDelete: 'CASCADE'
            });
        }
    }

    UpgradeCategory.init({
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
        group_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'upgrade_groups',
                key: 'id'
            }
        },
        group: {
            type: DataTypes.STRING,
            allowNull: true
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false
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
        modelName: 'UpgradeCategory',
        tableName: 'upgrade_categories',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return UpgradeCategory;
};
