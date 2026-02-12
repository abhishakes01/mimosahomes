require('dotenv').config();

console.log(`[database.js] Loaded for environment: '${process.env.NODE_ENV?.trim()}'`);

const config = {
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
    },
    staging: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    }
};

// Handle case where NODE_ENV is set but not found in config
const env = process.env.NODE_ENV?.trim() || 'development';
if (!config[env]) {
    console.warn(`[database.js] Configuration for '${env}' not found. Falling back to 'production'.`);
    module.exports = { ...config, [env]: config.production };
} else {
    module.exports = config;
}

