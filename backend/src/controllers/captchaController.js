const svgCaptcha = require('svg-captcha');

const captchaController = {
    // Generate CAPTCHA
    generateCaptcha: (req, res) => {
        const captcha = svgCaptcha.create({
            size: 4, // 4-character captcha
            noise: 2,
            color: true,
            background: '#f8fafc'
        });

        // Store solution in a signed cookie
        // expires in 5 minutes
        res.cookie('captcha', captcha.text.toLowerCase(), {
            httpOnly: true,
            signed: true,
            maxAge: 1000 * 60 * 5,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production'
        });

        res.type('svg');
        res.status(200).send(captcha.data);
    },

    // Optional: Explicit verification (usually checked within form controllers)
    verifyCaptcha: (req, captchaInput) => {
        const storedCaptcha = req.signedCookies.captcha;
        if (!storedCaptcha || !captchaInput) return false;
        return storedCaptcha === captchaInput.toLowerCase();
    }
};

module.exports = captchaController;
