const mongoose = require('mongoose');

const assessmentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    userType: { type: String, required: true, enum: ['self', 'child'] },
    age: { type: Number, required: true },
    language: { type: String, required: true, enum: ['en', 'hi'] },
    responses: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Question' },
        optionIndex: { type: Number, required: true },
        score: { type: Number, required: true },
      },
    ],
    riskLevel: {
        label: { type: String, required: true },
        color: { type: String, required: true }
    }
  },
  {
    timestamps: true,
  }
);

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;