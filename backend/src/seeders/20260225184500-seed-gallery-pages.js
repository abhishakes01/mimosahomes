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
                    heroText: 'Want to see some of our new homes in real life? Then why not come and visit us at one of our display homes around Melbourne.',
                    officeTitle: 'Mitra Homes Head Office',
                    officeAddress: '123 Elgar Road, Derrimut, VIC, 3026',
                    officePhone: '1300 646 672',
                    officeLat: '-37.8483',
                    officeLng: '144.7794'
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
            } else {
                await queryInterface.bulkUpdate('Pages', {
                    title: page.title,
                    content: JSON.stringify(page.content),
                    updatedAt: new Date()
                }, { slug: page.slug });
            }
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Pages', {
            slug: ['new-home-designs', 'house-land-packages', 'display-homes', 'display-home-for-sale']
        }, {});
    }
};
