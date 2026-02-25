const { Enquiry, Listing, Page } = require('../models');
const emailService = require('../services/emailService');

exports.createEnquiry = async (req, res, next) => {
    try {
        const { captcha, email, name, collection, type } = req.body;

        // Verify CAPTCHA
        const storedCaptcha = req.signedCookies.captcha;
        if (!storedCaptcha || storedCaptcha !== (captcha || '').toLowerCase()) {
            return res.status(400).json({ error: 'Invalid or expired CAPTCHA' });
        }

        const enquiry = await Enquiry.create(req.body);

        // Send Email Notification to Admin (non-blocking)
        emailService.sendEnquiryNotification(req.body).catch(err => {
            console.error("Email notification failed:", err);
        });

        // Automated Ebook Delivery to User
        if (type === 'EBOOK_ENQUIRY' && email) {
            (async () => {
                try {
                    const ebookPage = await Page.findOne({ where: { slug: 'ebook' } });
                    if (ebookPage && ebookPage.content) {
                        const { vCollectionPdf, mCollectionPdf } = ebookPage.content;
                        let pdfUrl = null;

                        if (collection === 'V Collection') pdfUrl = vCollectionPdf;
                        else if (collection === 'M Collection') pdfUrl = mCollectionPdf;

                        if (pdfUrl) {
                            await emailService.sendEbookToUser({ name, email, collection }, pdfUrl);
                            console.log(`[EBOOK] Delivery email sent to ${email} for ${collection}`);
                        }
                    }
                } catch (ebookErr) {
                    console.error("Ebook delivery failed:", ebookErr);
                }
            })();
        }

        res.status(201).json({ message: 'Enquiry received', enquiry });
    } catch (error) {
        next(error);
    }
};

exports.getAllEnquiries = async (req, res, next) => {
    try {
        const enquiries = await Enquiry.findAll({
            include: [{ model: Listing, as: 'listing', attributes: ['title', 'address'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(enquiries);
    } catch (error) {
        next(error);
    }
};

exports.getEnquiryById = async (req, res, next) => {
    try {
        const enquiry = await Enquiry.findByPk(req.params.id, {
            include: [{ model: Listing, as: 'listing' }]
        });
        if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
        res.json(enquiry);
    } catch (error) {
        next(error);
    }
};

exports.updateEnquiryStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const enquiry = await Enquiry.findByPk(req.params.id);
        if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });

        await enquiry.update({ status });
        res.json(enquiry);
    } catch (error) {
        next(error);
    }
};

exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalEnquiries = await Enquiry.count();
        const newEnquiries = await Enquiry.count({ where: { status: 'new' } });

        // Fetch Listing stats
        const activeDesignListings = await Listing.count({
            where: { status: 'available' }
        });

        const houseLandPackages = await Listing.count({
            where: {
                type: 'house_land',
                status: 'available'
            }
        });

        const avgPriceResult = await Listing.aggregate('price', 'avg', {
            where: { status: 'available' }
        });

        // Fetch recent enquiries (last 5)
        const recentEnquiries = await Enquiry.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: Listing, as: 'listing', attributes: ['title'] }]
        });

        res.json({
            totalEnquiries,
            newEnquiries,
            activeDesignListings,
            houseLandPackages,
            avgPrice: Math.round(Number(avgPriceResult) || 0),
            recentEnquiries
        });
    } catch (error) {
        next(error);
    }
};
