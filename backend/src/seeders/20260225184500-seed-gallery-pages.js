'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const pagesToSeed = [
            {
                slug: 'new-home-designs',
                title: 'New Home Designs',
                content: {
                    heroImage: 'uploads/designs.jpg',
                    description: 'Explore our range of stunning new home designs.'
                }
            },
            {
                slug: 'house-land-packages',
                title: 'House & Land Packages',
                content: {
                    heroImage: 'uploads/house-land.jpg',
                    description: 'Discover the perfect block and home combination.'
                }
            },
            {
                slug: 'display-homes',
                title: 'Display Homes',
                content: {
                    heroImage: 'uploads/display-homes.jpg',
                    description: 'Visit our stunning display homes across the region.'
                }
            },
            {
                slug: 'display-home-for-sale',
                title: 'Display Home For Sale',
                content: {
                    heroImage: 'uploads/sale.jpg',
                    description: 'Own a masterpiece with our display homes for sale.'
                }
            }
        ];

        for (const page of pagesToSeed) {
            const [results] = await queryInterface.sequelize.query(
                `SELECT id FROM \"Pages\" WHERE slug = '${page.slug}'`
            ).catch(() => [[]]);

            if (results.length === 0) {
                await queryInterface.bulkInsert('Pages', [
                    {
                        id: uuidv4(),
                        slug: page.slug,
                        title: page.title,
                        content: JSON.stringify(page.content),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ], {});
            }
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Pages', {
            slug: ['new-home-designs', 'house-land-packages', 'display-homes', 'display-home-for-sale']
        }, {});
    }
};
