const Quiz = require('../models/Quiz');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  console.log("Received quiz data:", req.body);
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    console.log("Quiz saved successfully to 'qu' collection:", quiz);
    res.status(201).json(quiz);
  } catch (error) {
    console.error("Error saving quiz:", error);
    res.status(400).json({ message: "Failed to save quiz", error: error.message });
  }
};

// Fetch all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Failed to fetch quizzes", error: error.message });
  }
};

// Delete a quiz by ID
exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const result = await Quiz.deleteOne({ _id: quizId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Failed to delete quiz", error: error.message });
  }
};