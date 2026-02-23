const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const { Setting } = require('../models');

/**
 * Sends a minimalist email with logo-text.png
 */
exports.sendEnquiryNotification = async (enquiryData) => {
    const { name, email, phone, message, interest, type } = enquiryData;

    // Fetch Admin Email from Database Settings
    const adminEmailSetting = await Setting.findByPk('admin_email');
    const adminEmail = adminEmailSetting?.value || process.env.SMTP_USER;

    // Logo is served from frontend public folder. 
    // In production, this should be the live URL.
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const logoUrl = `${frontendUrl}/logo-text.png`;

    const displayType = type || interest || 'General';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; padding: 40px; border: 1px solid #eee; border-radius: 8px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { max-width: 150px; }
            .content { margin-bottom: 30px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #888; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
            .value { font-size: 16px; color: #1a1a1a; margin-top: 4px; }
            .footer { text-align: center; font-size: 12px; color: #aaa; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
            .tag { display: inline-block; padding: 4px 12px; border-radius: 20px; background: #f0f7f8; color: #0897b1; font-weight: bold; font-size: 12px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${logoUrl}" alt="Mitra Homes" class="logo">
            </div>
            
            <div class="content">
                <div class="tag">New Enquiry Received</div>
                
                <div class="field">
                    <div class="label">Name</div>
                    <div class="value">${name}</div>
                </div>
                
                <div class="field">
                    <div class="label">Email</div>
                    <div class="value">${email}</div>
                </div>
                
                ${phone ? `
                <div class="field">
                    <div class="label">Phone</div>
                    <div class="value">${phone}</div>
                </div>` : ''}
                
                <div class="field">
                    <div class="label">Interest / Type</div>
                    <div class="value">${displayType}</div>
                </div>
                
                <div class="field" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #fafafa;">
                    <div class="label">Message</div>
                    <div class="value">${message || 'No message provided.'}</div>
                </div>
            </div>
            
            <div class="footer">
                &copy; ${new Date().getFullYear()} Mitra Homes. All rights reserved.<br>
                This is an automated notification from your website.
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.SMTP_FROM || '"Mitra Homes" <noreply@mitrahomes.com>',
        to: adminEmail,
        subject: `New Enquiry: ${name} - ${displayType}`,
        html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
};
