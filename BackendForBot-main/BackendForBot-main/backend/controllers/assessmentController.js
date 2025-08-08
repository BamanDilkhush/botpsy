const asyncHandler = require('express-async-handler');
const Assessment = require('../models/assessmentModel');
const Question = require('../models/questionModel');
const mongoose = require('mongoose');

// Helper function to calculate risk level
const getRiskLevel = (score, maxScore) => {
  if (!maxScore || maxScore === 0)
    return { label: 'N/A', color: 'gray' };

  const percent = (score / maxScore) * 100;
  if (percent <= 30) return { label: 'Low Risk', color: 'green' };
  if (percent <= 70) return { label: 'Moderate Risk', color: 'yellow' };
  return { label: 'High Risk', color: 'red' };
};


// @desc    Submit a new assessment
// @route   POST /api/assessments
// @access  Private
const submitAssessment = asyncHandler(async (req, res) => {
  const { userType, age, language, responses } = req.body;

  if (!userType || !age || !language || !responses) {
    res.status(400);
    throw new Error('Please provide all assessment data');
  }

  const questionIds = Object.keys(responses).map(id => new mongoose.Types.ObjectId(id));
  const questions = await Question.find({ _id: { $in: questionIds } });
  
  if (questions.length !== questionIds.length) {
    res.status(400);
    throw new Error('Some questions in the response are invalid.');
  }
  
  let totalScore = 0;
  let maxScore = 0;
  const detailedResponses = [];

  questions.forEach(q => {
    const optionIndex = responses[q._id.toString()];
    const score = q.weightage[optionIndex];

    totalScore += score;
    maxScore += Math.max(...q.weightage);
    
    detailedResponses.push({
      question: q._id,
      optionIndex,
      score,
    });
  });

  const risk = getRiskLevel(totalScore, maxScore);

  const assessment = await Assessment.create({
    user: req.user.id,
    userType,
    age,
    language,
    score: totalScore,
    maxScore,
    riskLevel: risk,
    responses: detailedResponses,
  });

  // Populate user and question details for the response
  const populatedAssessment = await Assessment.findById(assessment._id)
    .populate('user', 'name email')
    .populate('responses.question');

  res.status(201).json(populatedAssessment);
});

// @desc    Get all assessments for the logged-in user
// @route   GET /api/assessments
// @access  Private
const getUserAssessments = asyncHandler(async (req, res) => {
  const assessments = await Assessment.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(assessments);
});

// @desc    Get the latest assessment for the logged-in user
// @route   GET /api/assessments/latest
// @access  Private
const getLatestUserAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findOne({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate('responses.question');

  if (!assessment) {
     res.status(200).json(null); // Return null if no assessments found
     return;
  }
  
  res.status(200).json(assessment);
});


module.exports = {
  submitAssessment,
  getUserAssessments,
  getLatestUserAssessment
};