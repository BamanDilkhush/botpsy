const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const crypto = require('crypto');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
        name,
        email,
        password,
        verificationToken,
    });

    if (user) {
        try {
            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

            // --- NEW: HTML Email Template ---
            const emailHtml = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 1px solid #eeeeee; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { color: #333333; }
        .content p { color: #555555; line-height: 1.6; }
        .cta-button { display: block; width: 200px; margin: 30px auto; padding: 15px 20px; background-color: #3b82f6; color: #ffffff; text-align: center; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #999999; font-size: 12px; }
        .footer a { color: #3b82f6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BotPsych</h1>
        </div>
        <div class="content">
            <h2>Please Verify Your Email</h2>
            <p>Hi {{userName}},</p>
            <p>Thank you for registering for BotPsych. To complete your registration and secure your account, please click the button below to verify your email address.</p>
            <a href="{{verificationUrl}}" class="cta-button">Verify Email Address</a>
            <p>If the button above doesn't work, please copy and paste the following link into your browser:</p>
            <p><a href="{{verificationUrl}}">{{verificationUrl}}</a></p>
            <p>Thanks,<br/>The BotPsych Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 BotPsych. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

            // Replace placeholders with dynamic data
            const finalHtml = emailHtml
                .replace('{{userName}}', user.name)
                .replace(new RegExp('{{verificationUrl}}', 'g'), verificationUrl);

            await resend.emails.send({
                from: 'Onboarding <onboarding@botpsy.site>',
                to: user.email,
                subject: 'Verify Your Email for BotPsych',
                html: finalHtml, // Use the new, styled HTML
            });

            res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });

        } catch (error) {
            console.error("Email sending failed:", error);
            res.status(500).json({ message: 'User registered, but the verification email could not be sent.' });
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (!user.isVerified) {
            res.status(403);
            throw new Error('Please verify your email address before logging in.');
        }
        
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get current user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// @desc    Verify user email
// @route   GET /api/auth/verify-email?token=...
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;

    if (!token) {
        res.status(400);
        throw new Error('Verification token is missing.');
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired verification token.');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    verifyEmail,
};
