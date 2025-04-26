const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new quiz
router.post('/', async (req, res) => {
  try {
    const { videoUrl, questions } = req.body;

    // Basic validation
    if (!videoUrl || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Video URL and at least one question are required' });
    }

    // Validate questions
    for (const [index, q] of questions.entries()) {
      if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({ message: `Question ${index + 1}: Invalid question or options` });
      }
      if (q.correctIndex == null || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
        return res.status(400).json({ message: `Question ${index + 1}: Invalid correct index` });
      }
      // imageUrl is optional, no validation needed beyond schema
    }

    const quiz = new Quiz({ videoUrl, questions });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a quiz
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;