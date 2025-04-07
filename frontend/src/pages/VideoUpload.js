import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Typography,
  TextField,
  Paper,
  Grid,
  Box,
  IconButton,
  Radio,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Switch,
  Alert,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styled Components for Enhanced UI
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(6, 2),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: '#fff',
}));

const StyledQuestionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  border: '1px solid #e0e0e0',
  background: '#fafafa',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
}));

const StyledVideoBox = styled(Box)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
}));

const StyledQuizCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  background: '#fff',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const VideoUpload = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [publicId, setPublicId] = useState('');
  const [deleteToken, setDeleteToken] = useState('');
  const [widget, setWidget] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      selectedIndex: null,
      submitted: false,
    },
  ]);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);

  useEffect(() => {
    const savedVideoUrl = localStorage.getItem('videoUrl');
    const savedPublicId = localStorage.getItem('publicId');
    const savedDeleteToken = localStorage.getItem('deleteToken');

    if (savedVideoUrl) setVideoUrl(savedVideoUrl);
    if (savedPublicId) setPublicId(savedPublicId);
    if (savedDeleteToken) setDeleteToken(savedDeleteToken);

    const loadCloudinary = () => {
      if (!window.cloudinary) {
        const script = document.createElement('script');
        script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
        script.async = true;
        script.onload = initializeWidget;
        document.body.appendChild(script);
      } else {
        initializeWidget();
      }
    };

    loadCloudinary();
    fetchQuizzes();
  }, []);

  const initializeWidget = () => {
    const cloudinaryWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dd6wweekb',
        uploadPreset: 'video_widget_unsigned',
        folder: 'my_videos',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'video',
        maxFileSize: 10000000,
        clientAllowedFormats: ['mp4', 'webm', 'mov', 'avi'],
        returnDeleteToken: true,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          const { secure_url, public_id, delete_token } = result.info;
          setVideoUrl(secure_url);
          setPublicId(public_id);
          setDeleteToken(delete_token);
          localStorage.setItem('videoUrl', secure_url);
          localStorage.setItem('publicId', public_id);
          localStorage.setItem('deleteToken', delete_token);
          toast.success('Video uploaded successfully!');
        } else if (error) {
          console.error('Upload error:', error);
          toast.error('Error uploading video');
        }
      }
    );
    setWidget(cloudinaryWidget);
  };

  const handleUpload = () => {
    if (widget) widget.open();
    else toast.error('Upload widget not ready');
  };

  const handleDelete = async () => {
    if (!deleteToken || !publicId) return toast.warn('No video to delete');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dd6wweekb/delete_by_token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: deleteToken }),
        }
      );

      const result = await response.json();
      if (result.result === 'ok') {
        setVideoUrl('');
        setPublicId('');
        setDeleteToken('');
        localStorage.removeItem('videoUrl');
        localStorage.removeItem('publicId');
        localStorage.removeItem('deleteToken');
        toast.success('Video deleted successfully');
      } else {
        throw new Error(result.error?.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`Error deleting video: ${error.message}`);
    }
  };

  const handleAnswerSelect = (qIndex, oIndex) => {
    if (!previewMode) return;
    const updated = [...questions];
    updated[qIndex].selectedIndex = oIndex;
    updated[qIndex].submitted = false;
    setQuestions(updated);
  };

  const handleSubmitAnswer = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].submitted = true;
    setQuestions(updated);
  };

  const getAnswerFeedback = (question) => {
    if (!question.submitted || question.selectedIndex === null) return null;
    const isCorrect = question.selectedIndex === question.correctIndex;
    return (
      <Alert
        severity={isCorrect ? 'success' : 'error'}
        icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
        sx={{ mt: 1, borderRadius: '8px' }}
      >
        {isCorrect
          ? 'Correct!'
          : `Wrong. Correct answer: ${question.options[question.correctIndex]}`}
      </Alert>
    );
  };

  const calculateScore = () => {
    return questions.reduce((score, question) => {
      if (question.submitted && question.selectedIndex === question.correctIndex) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    updated[index].submitted = false;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    updated[qIndex].submitted = false;
    setQuestions(updated);
  };

  const handleCorrectChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctIndex = parseInt(value);
    updated[qIndex].submitted = false;
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        selectedIndex: null,
        submitted: false,
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    toast.info('Question removed');
  };

  const handleSubmit = async () => {
    if (!videoUrl) {
      toast.error('Please upload a video before submitting.');
      return;
    }
    if (questions.some(q => !q.question || q.options.some(opt => !opt))) {
      toast.error('Please fill in all questions and options before submitting.');
      return;
    }

    const payload = {
      videoUrl,
      questions: questions.map(q => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
      })),
    };

    try {
      const response = await fetch('http://localhost:5000/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save quiz');
      }

      await response.json();
      toast.success('Quiz saved successfully!');
      fetchQuizzes();
      setVideoUrl('');
      setPublicId('');
      setDeleteToken('');
      localStorage.removeItem('videoUrl');
      localStorage.removeItem('publicId');
      localStorage.removeItem('deleteToken');
      setQuestions([
        {
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          selectedIndex: null,
          submitted: false,
        },
      ]);
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error(`Error saving quiz: ${error.message}`);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/quizzes');
      const data = await res.json();
      setSavedQuizzes(data);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
      toast.error('Failed to fetch quizzes');
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/quizzes/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete quiz');
      }

      setSavedQuizzes((prev) => prev.filter((q) => q._id !== id));
      toast.success('Quiz deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting quiz');
    }
  };

  const resetQuiz = () => {
    const updated = questions.map(q => ({
      ...q,
      selectedIndex: null,
      submitted: false,
    }));
    setQuestions(updated);
    toast.info('Quiz reset');
  };

  return (
    <StyledContainer maxWidth="lg">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center' }}
      >
        Visitor Video & Quiz Creator
      </Typography>

      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#e3f2fd',
          p: 2,
          borderRadius: '12px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={previewMode}
              onChange={(e) => setPreviewMode(e.target.checked)}
              color="primary"
            />
          }
          label={<Typography variant="body1">Preview Mode</Typography>}
        />
        {previewMode && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 'bold' }}>
              Score: {calculateScore()} / {questions.length}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetQuiz}
              sx={{ borderRadius: '20px' }}
            >
              Reset Quiz
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ color: '#424242' }}>
              Upload Video
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={handleUpload}
              sx={{ mb: 3, borderRadius: '20px', px: 4 }}
            >
              Upload Video
            </Button>
            {videoUrl && (
              <StyledVideoBox>
                <video src={videoUrl} controls style={{ width: '100%' }} />
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={{ mt: 2, borderRadius: '20px', width: '100%' }}
                >
                  Delete Video
                </Button>
              </StyledVideoBox>
            )}
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ color: '#424242' }}>
              Create Questions
            </Typography>
            {questions.map((q, qIndex) => (
              <StyledQuestionBox key={qIndex} sx={{ mb: 3 }}>
                <TextField
                  label={`Question ${qIndex + 1}`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  fullWidth
                  margin="normal"
                  disabled={previewMode}
                  variant="outlined"
                  sx={{ bgcolor: '#fff', borderRadius: '8px' }}
                />
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <FormLabel
                    component="legend"
                    sx={{ fontWeight: 'medium', color: '#616161' }}
                  >
                    {previewMode ? 'Select an Answer' : 'Options (Mark Correct Answer)'}
                  </FormLabel>
                  <RadioGroup
                    value={previewMode ? q.selectedIndex : q.correctIndex}
                    onChange={(e) =>
                      previewMode
                        ? handleAnswerSelect(qIndex, parseInt(e.target.value))
                        : handleCorrectChange(qIndex, e.target.value)
                    }
                  >
                    {q.options.map((opt, oIndex) => (
                      <FormControlLabel
                        key={oIndex}
                        value={oIndex}
                        control={<Radio color="primary" />}
                        label={
                          <TextField
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            disabled={previewMode}
                            variant="standard"
                            sx={{ width: '300px' }}
                          />
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
                {previewMode && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleSubmitAnswer(qIndex)}
                      disabled={q.selectedIndex === null || q.submitted}
                      sx={{ borderRadius: '20px' }}
                    >
                      Check Answer
                    </Button>
                    {getAnswerFeedback(q)}
                  </Box>
                )}
                {!previewMode && questions.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveQuestion(qIndex)}
                    sx={{ mt: 1 }}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </StyledQuestionBox>
            ))}
            {!previewMode && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  onClick={handleAddQuestion}
                  sx={{ borderRadius: '20px' }}
                >
                  Add Question
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  sx={{ borderRadius: '20px', px: 4 }}
                >
                  Save Quiz
                </Button>
              </Box>
            )}
          </StyledPaper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Saved Quizzes
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {loadingQuizzes ? (
          <Typography color="textSecondary">Loading quizzes...</Typography>
        ) : savedQuizzes.length === 0 ? (
          <Typography color="textSecondary">No quizzes found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {savedQuizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz._id}>
                <StyledQuizCard>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Video Preview
                  </Typography>
                  <StyledVideoBox>
                    <video
                      src={quiz.videoUrl} // Fixed from videoUrl to quiz.videoUrl
                      controls
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                    />
                  </StyledVideoBox>
                  <Typography variant="subtitle2" sx={{ mt: 2, color: '#616161' }}>
                    Questions:
                  </Typography>
                  <Box sx={{ maxHeight: '150px', overflowY: 'auto' }}>
                    <ul style={{ paddingLeft: '20px' }}>
                      {quiz.questions.map((q, idx) => (
                        <li key={idx}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {q.question}
                          </Typography>
                          <ul style={{ paddingLeft: '20px' }}>
                            {q.options.map((opt, i) => (
                              <li
                                key={i}
                                style={{ color: i === q.correctIndex ? '#4caf50' : 'inherit' }}
                              >
                                <Typography variant="caption">{opt}</Typography>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteQuiz(quiz._id)}
                    sx={{ mt: 2, borderRadius: '20px', width: '100%' }}
                  >
                    Delete Quiz
                  </Button>
                </StyledQuizCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </StyledContainer>
  );
};

export default VideoUpload;