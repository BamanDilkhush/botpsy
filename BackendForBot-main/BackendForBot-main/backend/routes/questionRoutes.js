const express = require('express');
const router = express.Router();
const {
  getAssessmentQuestions,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to get questions for an assessment
router.route('/assessment').get(getAssessmentQuestions);

// Admin routes for managing questions
router
  .route('/')
  .get(protect, admin, getAllQuestions)
  .post(protect, admin, createQuestion);

router
  .route('/:id')
  .put(protect, admin, updateQuestion)
  .delete(protect, admin, deleteQuestion);

module.exports = router;