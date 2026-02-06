'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('floor_plans', 'bedrooms', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 4
    });
    await queryInterface.addColumn('floor_plans', 'bathrooms', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 2
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('floor_plans', 'bedrooms');
    await queryInterface.removeColumn('floor_plans', 'bathrooms');
  }
};
