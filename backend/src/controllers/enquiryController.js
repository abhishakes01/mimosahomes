const { Enquiry, Listing } = require('../models');

exports.createEnquiry = async (req, res, next) => {
    try {
        const enquiry = await Enquiry.create(req.body);
        res.status(201).json({ message: 'Enquiry received', enquiry });
    } catch (error) {
        next(error);
    }
};

exports.getAllEnquiries = async (req, res, next) => {
    try {
        const enquiries = await Enquiry.findAll({
            include: [{ model: Listing, as: 'listing', attributes: ['title', 'address'] }],
            order: [['created_at', 'DESC']]
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
