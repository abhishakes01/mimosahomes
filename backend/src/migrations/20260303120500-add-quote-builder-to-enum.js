'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.sequelize.query("ALTER TYPE \"enum_enquiries_type\" ADD VALUE 'QUOTE_BUILDER'");
        } catch (error) {
            if (!error.message.includes('already exists')) {
                throw error;
            }
        }

        try {
            await queryInterface.sequelize.query("ALTER TYPE \"enum_enquiries_type\" ADD VALUE 'MPORIUM_ENQUIRY'");
        } catch (error) {
            if (!error.message.includes('already exists')) {
                throw error;
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        console.log('Skipping removal of values from enum_enquiries_type');
    }
};
