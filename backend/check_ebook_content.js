const { Page } = require('./src/models');
async function check() {
    try {
        const page = await Page.findOne({ where: { slug: 'ebook' } });
        console.log(JSON.stringify(page.content, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
