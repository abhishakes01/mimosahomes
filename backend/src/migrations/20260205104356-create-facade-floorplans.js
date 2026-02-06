'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('facade_floorplans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      facade_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'facades',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      floorplan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'floor_plans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Add unique constraint to prevent duplicate associations
    await queryInterface.addConstraint('facade_floorplans', {
      fields: ['facade_id', 'floorplan_id'],
      type: 'unique',
      name: 'unique_facade_floorplan'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('facade_floorplans');
  }
};
