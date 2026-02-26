'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SharedQuote extends Model {
        static associate(models) {
            // define association here
        }
    }
    SharedQuote.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        data: {
            type: DataTypes.JSONB,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'SharedQuote',
        tableName: 'SharedQuotes',
        underscored: true,
    });
    return SharedQuote;
};
