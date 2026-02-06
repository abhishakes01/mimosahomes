const { User } = require('../models');
const bcrypt = require('bcrypt');
const { z } = require('zod');

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

exports.login = async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // In a real app we'd sign a JWT here. 
        // For simplicity/demo we'll just return user info (excluding password).
        return res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            // token: 'mock-token-xyz' 
        });

    } catch (error) {
        next(error);
    }
};
