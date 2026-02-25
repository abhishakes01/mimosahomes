const { Page } = require('./src/models');
async function update() {
    try {
        const page = await Page.findOne({ where: { slug: 'ebook' } });
        if (page) {
            page.content = {
                ...page.content,
                vCollectionPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                mCollectionPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
            };
            await page.save();
            console.log('Dummy PDFs updated');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
update();
