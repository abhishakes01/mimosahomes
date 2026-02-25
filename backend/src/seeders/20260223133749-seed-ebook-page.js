'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Pages', [{
      id: uuidv4(),
      slug: 'ebook',
      title: 'Ebook Collections',
      content: JSON.stringify({
        heroTitle: 'EBOOK COLLECTIONS',
        heroSubtitle: 'Explore our curated collections of home designs',
        vSubtitle: 'V COLLECTION - HOME DESIGNS',
        mSubtitle: 'M COLLECTION - HOME DESIGNS',
        vCollectionPdf: null,
        mCollectionPdf: null,
        heroImage: null
      }),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pages', { slug: 'ebook' }, {});
  }
};
