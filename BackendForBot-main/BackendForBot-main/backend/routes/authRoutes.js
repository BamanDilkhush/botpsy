const express = require('express');
const router = express.Router();
// --- MODIFIED: Import the new verifyEmail function ---
const { registerUser, loginUser, getMe, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// --- NEW: Add the route for email verification ---
router.get('/verify-email', verifyEmail);

module.exports = router;
