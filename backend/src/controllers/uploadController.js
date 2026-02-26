const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = req.body.folder || req.query.folder || 'misc';

        // Sanitize folder path to prevent directory traversal
        folder = folder.replace(/[^a-zA-Z0-9_\-\/]/g, '');

        const uploadDir = path.join(__dirname, '../../public/uploads', folder);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|avif|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpeg, jpg, png, webp, avif) and PDF files are allowed'));
    }
});

exports.uploadSingle = upload.single('file');

exports.handleUpload = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get folder from destination path relative to public/uploads
    const relativePath = path.relative(path.join(__dirname, '../../public'), req.file.path);
    const fileUrl = `/${relativePath.replace(/\\/g, '/')}`; // Ensure forward slashes for URL

    res.json({ url: fileUrl });
};
