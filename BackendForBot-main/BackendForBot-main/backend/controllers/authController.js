const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const crypto = require('crypto'); // --- NEW ---
const { Resend } = require('resend'); // --- NEW ---

// --- NEW: Initialize Resend ---
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
    console.log("--- REGISTER USER ENDPOINT HIT ---");
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

    // --- MODIFIED: Generate verification token ---
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user with the token
    const user = await User.create({
        name,
        email,
        password,
        verificationToken, // Add token to user document
    });

    // --- MODIFIED: Send verification email instead of logging in ---
    if (user) {
        try {
            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

            await resend.emails.send({
                from: 'Onboarding <onboarding@botpsy.site>', // Replace with your verified domain
                to: user.email,
                subject: 'Verify Your Email for BotPsych',
                html: `<h1>Welcome to BotPsych!</h1><p>Please click the link below to verify your email address:</p><a href="${verificationUrl}" style="color: blue;">Verify My Email</a>`
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
        // --- NEW: Check if user is verified ---
        if (!user.isVerified) {
            res.status(403); // 403 Forbidden
            throw new Error('Please verify your email address before logging in.');
        }
        
        // If verified, proceed to login
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401); // 401 Unauthorized
        throw new Error('Invalid credentials');
    }
});

// @desc    Get current user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// --- NEW: Function to verify the user's email ---
// @desc    Verify user email
// @route   GET /api/auth/verify-email?token=...
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;

    if (!token) {
        res.status(400);
        throw new Error('Verification token is missing.');
    }

    // Find the user with this token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired verification token.');
    }

    // Update user to be verified
    user.isVerified = true;
    user.verificationToken = undefined; // Make token single-use
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
});

// --- MODIFIED: Export the new function ---
module.exports = {
    registerUser,
    loginUser,
    getMe,
    verifyEmail,
};
