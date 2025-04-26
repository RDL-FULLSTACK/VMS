const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (options) => options.length >= 2 && options.every(opt => opt.trim() !== ''),
      message: 'Questions must have at least 2 non-empty options.',
    },
  },
  correctIndex: {
    type: Number,
    required: true,
    min: 0,
  },
  imageUrl: {
    type: String,
    required: false, // Optional
    trim: true,
    match: [/^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/i, 'Invalid image URL'], // Basic URL validation
  },
});

const quizSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
    trim: true,
    match: [/^https?:\/\/.*\.(?:mp4|webm|mov|avi)$/i, 'Invalid video URL'],
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quiz', quizSchema);