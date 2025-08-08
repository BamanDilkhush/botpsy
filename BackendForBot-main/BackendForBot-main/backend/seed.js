const mongoose = require('mongoose');
const dotenv = require('dotenv');
const questions = require('./data/questions.json'); // Make sure this path is correct
const Question = require('./models/questionModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Question.deleteMany();
    await Question.insertMany(questions);
    console.log('✅ Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Question.deleteMany();
    console.log('🔥 Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}