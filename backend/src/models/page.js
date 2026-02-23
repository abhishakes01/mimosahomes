const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Page extends Model {
        static associate(models) {
            // Define associations here if needed later
        }
    }

    Page.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        content: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {}
        }
    }, {
        sequelize,
        modelName: 'Page',
        tableName: 'Pages',
    });

    return Page;
};
