const { Sequelize } = require('sequelize');
require('dotenv').config();

async function check() {
    const sequelize = new Sequelize(
        process.env.DB_NAME || 'mimosahomes',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || 'root',
        {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'postgres',
            logging: false
        }
    );

    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        const [groups] = await sequelize.query('SELECT id, name FROM upgrade_groups');
        console.log(`Groups: ${groups.length}`);
        groups.forEach(g => console.log(` - ${g.name} (${g.id})`));

        const [categories] = await sequelize.query('SELECT id, name, group_id FROM upgrade_categories LIMIT 5');
        console.log(`Categories (sample): ${categories.length}`);
        categories.forEach(c => console.log(` - ${c.name} (${c.id}) -> Group ID: ${c.group_id}`));

        const [upgrades] = await sequelize.query('SELECT id, name, category_id FROM upgrades LIMIT 5');
        console.log(`Upgrades (sample): ${upgrades.length}`);
        upgrades.forEach(u => console.log(` - ${u.name} (${u.id}) -> Category ID: ${u.category_id}`));

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

check();
