async function pushEbookPage() {
    const payload = {
        title: 'Ebook Collections',
        content: {
            heroTitle: 'EBOOK COLLECTIONS',
            vSubtitle: 'V COLLECTION - HOME DESIGNS',
            mSubtitle: 'M COLLECTION - HOME DESIGNS',
            vCollectionPdf: null,
            mCollectionPdf: null,
            heroImage: null
        }
    };

    try {
        const response = await fetch('http://localhost:5000/api/pages/ebook', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log('Update result:', data);
    } catch (err) {
        console.error('Update failed:', err);
    }
}
pushEbookPage();
