'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Seed Admin User (assuming users table exists or will be created by sequelize sync, but usually via migration. 
        // I will add a user migration too to be safe/correct).

        return queryInterface.bulkInsert('users', [{
            // id is usually integer by default in sequelize unless specified, 
            // but my model users.js didn't specify UUID. I should check user migration.
            // I'll create a user migration first to match the model.
            username: 'admin',
            email: 'admin@mimosahomes.com.au',
            password: hashedPassword,
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date()
        }]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', { email: 'admin@mimosahomes.com.au' }, {});
    }
};
