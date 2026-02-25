const { Page } = require('./src/models');
async function check() {
    try {
        const pages = await Page.findAll({ attributes: ['slug', 'title'] });
        console.log('Existing Pages:');
        pages.forEach(p => console.log(`- ${p.slug}: ${p.title}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
