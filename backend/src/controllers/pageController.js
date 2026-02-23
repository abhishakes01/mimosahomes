const { Page } = require('../models');

// Get all pages
exports.getAllPages = async (req, res) => {
    try {
        const pages = await Page.findAll({
            attributes: ['id', 'slug', 'title', 'updatedAt'],
            order: [['title', 'ASC']]
        });
        res.json(pages);
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
};

// Get a single page by slug
exports.getPageBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const page = await Page.findOne({ where: { slug } });

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        res.json(page);
    } catch (error) {
        console.error(`Error fetching page ${req.params.slug}:`, error);
        res.status(500).json({ error: 'Failed to fetch page' });
    }
};

// Update or create a page by slug
exports.updatePage = async (req, res) => {
    try {
        const { slug } = req.params;
        const { title, content } = req.body;

        let page = await Page.findOne({ where: { slug } });

        if (page) {
            page = await page.update({ title, content });
            res.json(page);
        } else {
            // If the page doesn't exist yet, create it
            page = await Page.create({ slug, title, content });
            res.status(201).json(page);
        }
    } catch (error) {
        console.error(`Error updating page ${req.params.slug}:`, error);
        res.status(500).json({ error: 'Failed to update page' });
    }
};
