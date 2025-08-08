const express = require('express');
const router = express.Router();
const {
  submitAssessment,
  getUserAssessments,
  getLatestUserAssessment,
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, submitAssessment).get(protect, getUserAssessments);
router.route('/latest').get(protect, getLatestUserAssessment);

module.exports = router;