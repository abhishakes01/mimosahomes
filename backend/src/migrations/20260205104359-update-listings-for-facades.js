'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add facade_id column
    await queryInterface.addColumn('listings', 'facade_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'facades',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Remove old image and floorplan columns
    await queryInterface.removeColumn('listings', 'images');
    await queryInterface.removeColumn('listings', 'floorplan');
  },

  down: async (queryInterface, Sequelize) => {
    // Restore old columns
    await queryInterface.addColumn('listings', 'images', {
      type: Sequelize.JSONB,
      defaultValue: []
    });

    await queryInterface.addColumn('listings', 'floorplan', {
      type: Sequelize.JSONB,
      defaultValue: [],
      allowNull: true
    });

    // Remove facade_id
    await queryInterface.removeColumn('listings', 'facade_id');
  }
};
