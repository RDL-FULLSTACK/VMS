const Quiz = require('../models/Quiz');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { videoUrl, questions } = req.body;

    // Validation
    if (!videoUrl || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Video URL and at least one question are required' });
    }

    // Validate each question
    for (const [index, q] of questions.entries()) {
      if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({ message: `Question ${index + 1}: Invalid question or options` });
      }
      if (q.correctIndex == null || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
        return res.status(400).json({ message: `Question ${index + 1}: Invalid correct index` });
      }
      // imageUrl is optional, validated by schema
    }

    const quiz = new Quiz({ videoUrl, questions });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 }); // Newest first
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};