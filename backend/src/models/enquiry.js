'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Enquiry extends Model {
        static associate(models) {
            Enquiry.belongsTo(models.Listing, { foreignKey: 'listing_id', as: 'listing' });
        }
    }
    Enquiry.init({
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM(
                'general',
                'listing_enquiry',
                'finance',
                'new-home',
                'house-land',
                'display-homes',
                'QUOTE_BUILDER',
                'MPORIUM_ENQUIRY'
            ),
            defaultValue: 'general'
        },
        listing_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('new', 'contacted', 'qualified', 'closed'),
            defaultValue: 'new'
        }
    }, {
        sequelize,
        modelName: 'Enquiry',
        tableName: 'enquiries',
        underscored: true,
    });
    return Enquiry;
};
