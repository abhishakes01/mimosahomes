'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Check if the page already exists
        const [results] = await queryInterface.sequelize.query(
            `SELECT id FROM "Pages" WHERE slug = 'facades'`
        ).catch(() => [[]]); // Fallback if table name is different or doesn't exist yet

        if (results.length === 0) {
            await queryInterface.bulkInsert('Pages', [
                {
                    id: uuidv4(),
                    slug: 'facades',
                    title: 'Facades Gallery',
                    content: JSON.stringify({
                        heroImage: 'uploads/facades.jpg',
                        description: 'Discover the perfect external design for your new home with our gallery of stunning facades.'
                    }),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ], {});
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Pages', { slug: 'facades' }, {});
    }
};
