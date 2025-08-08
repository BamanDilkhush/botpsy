const asyncHandler = require('express-async-handler');
const Question = require('../models/questionModel');

// @desc    Get questions filtered for an assessment
// @route   GET /api/questions/assessment
// @access  Public
const getAssessmentQuestions = asyncHandler(async (req, res) => {
  const { ageGroup, language } = req.query;

  if (!ageGroup || !language) {
    res.status(400);
    throw new Error('Age group and language are required');
  }

  const questions = await Question.find({ ageGroup: ageGroup });

  if (!questions) {
    res.status(404);
    throw new Error('No questions found for this age group');
  }

  // Format questions based on selected language
  const formattedQuestions = questions.map((q) => ({
    id: q.questionId,
    question: language === 'hi' ? q.question_hi : q.question_en,
    options: language === 'hi' ? q.options_hi : q.options_en,
    weightage: q.weightage,
    // Sending original DB id for backend processing
    _id: q._id,
  }));

  res.status(200).json(formattedQuestions);
});

// @desc    Get all questions (for admin)
// @route   GET /api/questions
// @access  Private/Admin
const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({});
  res.status(200).json(questions);
});


// @desc    Create a new question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = asyncHandler(async (req, res) => {
    const question = new Question({
        questionId: req.body.questionId,
        question_en: req.body.question_en,
        question_hi: req.body.question_hi,
        options_en: req.body.options_en,
        options_hi: req.body.options_hi,
        weightage: req.body.weightage,
        ageGroup: req.body.ageGroup,
        category: req.body.category,
    });

    const createdQuestion = await question.save();
    res.status(201).json(createdQuestion);
});


// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = asyncHandler(async (req, res) => {
    const { questionId, question_en, question_hi, options_en, options_hi, weightage, ageGroup, category } = req.body;

    const question = await Question.findById(req.params.id);

    if(question) {
        question.questionId = questionId || question.questionId;
        question.question_en = question_en || question.question_en;
        question.question_hi = question_hi || question.question_hi;
        question.options_en = options_en || question.options_en;
        question.options_hi = options_hi || question.options_hi;
        question.weightage = weightage || question.weightage;
        question.ageGroup = ageGroup || question.ageGroup;
        question.category = category || question.category;

        const updatedQuestion = await question.save();
        res.json(updatedQuestion);

    } else {
        res.status(404);
        throw new Error('Question not found');
    }
});


// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);

    if (question) {
        await question.remove();
        res.json({ message: 'Question removed' });
    } else {
        res.status(404);
        throw new Error('Question not found');
    }
});


module.exports = {
  getAssessmentQuestions,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};