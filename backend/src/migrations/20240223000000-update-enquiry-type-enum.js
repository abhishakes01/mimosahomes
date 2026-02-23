'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // We need to change the ENUM type. Since PostgreSQL handles ENUM changes differently than MySQL/MariaDB, 
        // a simple changeColumn might not work for all dialects if they are strict.
        // However, for this project, we'll assume a standard approach or dialect-specific if needed.

        // Postgres approach: ALTER TYPE "enum_enquiries_type" ADD VALUE 'new-home';
        // MySQL approach: ALTER TABLE enquiries MODIFY COLUMN type ENUM(...)

        // Sequelize's changeColumn usually handles this, but ENUMs are tricky.
        await queryInterface.changeColumn('enquiries', 'type', {
            type: Sequelize.ENUM(
                'general',
                'listing_enquiry',
                'finance',
                'new-home',
                'house-land',
                'display-homes',
                'QUOTE_BUILDER',
                'MPORIUM_ENQUIRY'
            ),
            defaultValue: 'general'
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Reverting ENUM is even trickier as you can't easily remove values in some DBs.
        // We'll leave it as is or revert to original if possible.
        await queryInterface.changeColumn('enquiries', 'type', {
            type: Sequelize.ENUM('general', 'listing_enquiry', 'finance'),
            defaultValue: 'general'
        });
    }
};
