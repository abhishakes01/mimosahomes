const { Enquiry, Listing } = require('../models');
const emailService = require('../services/emailService');

exports.createEnquiry = async (req, res, next) => {
    try {
        const { captcha } = req.body;

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
        console.log("[Stats] Fetching dashboard stats...");
        const totalEnquiries = await Enquiry.count();
        console.log("[Stats] Total Enquiries:", totalEnquiries);

        const newEnquiries = await Enquiry.count({ where: { status: 'new' } });
        console.log("[Stats] New Enquiries:", newEnquiries);

        // Fetch recent enquiries (last 5)
        console.log("[Stats] Fetching recent enquiries...");
        const recentEnquiries = await Enquiry.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: Listing, as: 'listing', attributes: ['title'] }]
        });
        console.log("[Stats] Recent Enquiries fetched:", recentEnquiries?.length);

        res.json({
            totalEnquiries,
            newEnquiries,
            recentEnquiries
        });
    } catch (error) {
        console.error("[Stats] Dashboard stats error:", error);
        next(error);
    }
};
