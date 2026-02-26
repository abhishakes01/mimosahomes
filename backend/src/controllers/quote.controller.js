'use strict';
const { SharedQuote } = require('../models');
const emailService = require('../services/emailService');

exports.shareQuote = async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) {
            return res.status(400).json({ error: 'Quote data is required' });
        }

        const sharedQuote = await SharedQuote.create({ data });
        res.status(201).json({ id: sharedQuote.id });
    } catch (error) {
        console.error('Error sharing quote:', error);
        res.status(500).json({ error: 'Failed to share quote' });
    }
};

exports.getSharedQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const sharedQuote = await SharedQuote.findByPk(id);

        if (!sharedQuote) {
            return res.status(404).json({ error: 'Shared quote not found' });
        }

        res.json(sharedQuote);
    } catch (error) {
        console.error('Error fetching shared quote:', error);
        res.status(500).json({ error: 'Failed to fetch shared quote' });
    }
};

exports.sendQuoteEmail = async (req, res) => {
    try {
        const { id, email, shareUrl } = req.body;
        if (!email || !shareUrl) {
            return res.status(400).json({ error: 'Email and Share URL are required' });
        }

        await emailService.sendQuoteShareEmail(email, shareUrl);
        res.json({ message: 'Quote shared successfully via email' });
    } catch (error) {
        console.error('Error sending quote email:', error);
        res.status(500).json({ error: 'Failed to send quote email' });
    }
};
