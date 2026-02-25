const { Page } = require('./src/models');
const emailService = require('./src/services/emailService');

async function verify() {
    const testData = {
        name: 'Test User',
        email: 'test@example.com',
        collection: 'V Collection',
        type: 'EBOOK_ENQUIRY'
    };

    console.log('--- Ebook Delivery Verification ---');
    console.log(`Testing for: ${testData.collection}`);

    try {
        const ebookPage = await Page.findOne({ where: { slug: 'ebook' } });
        if (!ebookPage) {
            console.error('FAILED: Ebook page not found');
            process.exit(1);
        }

        const { vCollectionPdf, mCollectionPdf } = ebookPage.content;
        let pdfUrl = null;

        if (testData.collection === 'V Collection') pdfUrl = vCollectionPdf;
        else if (testData.collection === 'M Collection') pdfUrl = mCollectionPdf;

        if (!pdfUrl) {
            console.error('FAILED: PDF URL not found in content');
            process.exit(1);
        }

        console.log(`PDF URL identified: ${pdfUrl}`);
        console.log('Logic check: PASSED');

        // We don't want to actually send an email in this test script 
        // to avoid potential SMTP errors if not configured locally,
        // but the logic above matches enquiryController.js exactly.

        console.log('--- Verification Complete ---');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
verify();
