'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('ALTER TABLE listings ALTER COLUMN images DROP DEFAULT');
        await queryInterface.sequelize.query('ALTER TABLE listings ALTER COLUMN images TYPE JSONB USING to_jsonb(images)');
        await queryInterface.sequelize.query("ALTER TABLE listings ALTER COLUMN images SET DEFAULT '[]'::jsonb");
        await queryInterface.changeColumn('listings', 'images', {
            type: Sequelize.JSONB,
            defaultValue: [],
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('listings', 'images', {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: [],
            allowNull: true
        });
    }
};
