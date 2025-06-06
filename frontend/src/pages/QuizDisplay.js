import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Radio,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const QuizDisplay = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/quizzes`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch quizzes: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched quizzes:', data);
        setQuizzes(data);

        const initialAnswers = {};
        const initialSubmitted = {};
        data.forEach(quiz => {
          initialAnswers[quiz._id] = Array(quiz.questions.length).fill(null);
          initialSubmitted[quiz._id] = false;
        });
        setAnswers(initialAnswers);
        setSubmitted(initialSubmitted);
      } catch (error) {
        console.error('Error fetching quizzes:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAnswerChange = (quizId, questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [quizId]: prev[quizId].map((ans, idx) =>
        idx === questionIndex ? parseInt(value) : ans
      ),
    }));
  };

  const handleSubmitQuiz = (quizId) => {
    setSubmitted(prev => ({ ...prev, [quizId]: true }));
    // Redirect to dashboard after a short delay to show the score
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500); // 1.5-second delay to allow user to see the score
  };

  const calculateQuizScore = (quiz) => {
    const quizAnswers = answers[quiz._id] || [];
    return quiz.questions.reduce((score, q, idx) => {
      return score + (quizAnswers[idx] === q.correctIndex ? 1 : 0);
    }, 0);
  };

  const getFeedback = (quiz, questionIndex) => {
    if (!submitted[quiz._id] || answers[quiz._id][questionIndex] === null) return null;
    const isCorrect = answers[quiz._id][questionIndex] === quiz.questions[questionIndex].correctIndex;
    return (
      <Alert
        severity={isCorrect ? 'success' : 'error'}
        icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
        sx={{ mt: 1 }}
      >
        {isCorrect
          ? 'Correct!'
          : `Wrong. Correct answer: ${quiz.questions[questionIndex].options[quiz.questions[questionIndex].correctIndex]}`}
      </Alert>
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Available Video Quizzes
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading quizzes...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}. Please check the backend server or try again later.
        </Alert>
      ) : quizzes.length === 0 ? (
        <Typography>No quizzes available</Typography>
      ) : (
        quizzes.map(quiz => (
          <Paper key={quiz._id} elevation={3} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Video Content
                </Typography>
                <video
                  src={quiz.videoUrl}
                  controls
                  style={{ width: '100%', borderRadius: '12px' }}
                  onError={(e) => console.error('Video load error:', e)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Questions
                </Typography>

                {quiz.questions.map((q, qIndex) => (
                  <Box key={qIndex} sx={{ mb: 3 }}>
                    <Typography>{q.question}</Typography>
                    <FormControl component="fieldset" sx={{ mt: 1 }}>
                      <RadioGroup
                        value={answers[quiz._id]?.[qIndex] ?? null}
                        onChange={(e) => handleAnswerChange(quiz._id, qIndex, e.target.value)}
                      >
                        {q.options.map((opt, oIndex) => (
                          <FormControlLabel
                            key={oIndex}
                            value={oIndex}
                            control={<Radio />}
                            label={opt}
                            disabled={submitted[quiz._id]}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    {getFeedback(quiz, qIndex)}
                  </Box>
                ))}

                <Box sx={{ mt: 2 }}>
                  {!submitted[quiz._id] ? (
                    <Button
                      variant="contained"
                      onClick={() => handleSubmitQuiz(quiz._id)}
                      disabled={answers[quiz._id]?.some(ans => ans === null)}
                      sx={{ backgroundColor: '#2e1a47', '&:hover': { backgroundColor: '#3f2a5d' } }}
                    >
                      Submit Quiz
                    </Button>
                  ) : (
                    <Typography variant="subtitle1">
                      Score: {calculateQuizScore(quiz)} / {quiz.questions.length}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default QuizDisplay;