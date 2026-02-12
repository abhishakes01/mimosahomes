require('dotenv').config();

console.log(`[database.js] Loaded for environment: '${process.env.NODE_ENV?.trim()}'`);

module.exports = {
    development: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_NAME || 'mimosahomes_db',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'postgres',
        logging: false
    },
    test: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_NAME || 'mimosahomes_test',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'postgres'
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    }
};
