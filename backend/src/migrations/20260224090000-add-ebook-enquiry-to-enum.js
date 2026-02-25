'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // PostreSQL doesn't support adding enum values within a transaction easily
        // but adding it via raw query is common for PG
        try {
            await queryInterface.sequelize.query("ALTER TYPE \"enum_enquiries_type\" ADD VALUE 'EBOOK_ENQUIRY'");
        } catch (error) {
            // Value might already exist, ignore error if so
            if (!error.message.includes('already exists')) {
                throw error;
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Removing enum values is not simple in PG
        console.log('Skipping removal of EBOOK_ENQUIRY from enum_enquiries_type');
    }
};
