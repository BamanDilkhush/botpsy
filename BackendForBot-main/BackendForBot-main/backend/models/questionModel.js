const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  questionId: { type: Number, required: true, unique: true }, // To match your JSON file structure
  question_en: { type: String, required: true },
  question_hi: { type: String, required: true },
  options_en: [{ type: String, required: true }],
  options_hi: [{ type: String, required: true }],
  weightage: [{ type: Number, required: true }],
  ageGroup: [{ type: String, required: true }],
  category: { type: String, required: true }, // e.g., 'Social Communication'
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;