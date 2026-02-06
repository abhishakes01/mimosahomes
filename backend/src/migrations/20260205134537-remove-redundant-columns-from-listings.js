'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('listings', 'bedrooms');
    await queryInterface.removeColumn('listings', 'bathrooms');
    await queryInterface.removeColumn('listings', 'cars');
    await queryInterface.removeColumn('listings', 'house_size');
    await queryInterface.removeColumn('listings', 'land_size');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('listings', 'bedrooms', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('listings', 'bathrooms', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('listings', 'cars', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('listings', 'house_size', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
    await queryInterface.addColumn('listings', 'land_size', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
  }
};
