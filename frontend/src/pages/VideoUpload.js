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
import ImageIcon from '@mui/icons-material/Image';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  background: '#f8f9fa',
  minHeight: 'calc(100vh - 64px - 120px)',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: '#fff',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
  },
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
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
  },
}));

const VideoUpload = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [publicId, setPublicId] = useState('');
  const [deleteToken, setDeleteToken] = useState('');
  const [widget, setWidget] = useState(null);
  const [imageWidgets, setImageWidgets] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      selectedIndex: null,
      submitted: false,
      imageUrl: '',
      imagePublicId: '',
      imageDeleteToken: '',
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
        script.onload = initializeWidgets;
        script.onerror = () => {
          console.error('Failed to load Cloudinary script');
          toast.error('Failed to load Cloudinary widget');
        };
        document.body.appendChild(script);
      } else {
        initializeWidgets();
      }
    };

    loadCloudinary();
    fetchQuizzes();
  }, []);

  const initializeWidgets = () => {
    if (!window.cloudinary) {
      console.error('Cloudinary widget not loaded');
      toast.error('Cloudinary widget failed to load');
      return;
    }

    const cloudinaryVideoWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'ddovidvsp',
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
          console.error('Video upload error:', error);
          toast.error('Error uploading video');
        }
      }
    );
    setWidget(cloudinaryVideoWidget);

    const newImageWidgets = {};
    questions.forEach((_, index) => {
      const imageWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'ddovidvsp',
          uploadPreset: 'image_widget_unsigned',
          folder: 'quiz_images',
          sources: ['local', 'url', 'camera'],
          multiple: false,
          resourceType: 'image',
          maxFileSize: 5000000,
          clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif'],
          returnDeleteToken: true,
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            const { secure_url, public_id, delete_token } = result.info;
            setQuestions((prev) =>
              prev.map((question, qIndex) =>
                qIndex === index
                  ? {
                      ...question,
                      imageUrl: secure_url,
                      imagePublicId: public_id,
                      imageDeleteToken: delete_token,
                    }
                  : question
              )
            );
            toast.success(`Image uploaded for Question ${index + 1}`);
          } else if (error) {
            console.error('Image upload error:', error);
            toast.error(`Error uploading image for Question ${index + 1}`);
          }
        }
      );
      newImageWidgets[index] = imageWidget;
    });
    setImageWidgets(newImageWidgets);
  };

  const handleUpload = () => {
    if (widget) widget.open();
    else toast.error('Video upload widget not ready');
  };

  const handleImageUpload = (qIndex) => {
    if (imageWidgets[qIndex]) {
      imageWidgets[qIndex].open();
    } else {
      toast.error(`Image upload widget for Question ${qIndex + 1} not ready`);
    }
  };

  const handleDelete = async () => {
    if (!deleteToken || !publicId) return toast.warn('No video to delete');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/ddovidvsp/delete_by_token`,
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

  const handleDeleteImage = async (qIndex) => {
    const question = questions[qIndex];
    if (!question.imageDeleteToken || !question.imagePublicId) {
      toast.warn(`No image to delete for Question ${qIndex + 1}`);
      return;
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/ddovidvsp/delete_by_token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: question.imageDeleteToken }),
        }
      );

      const result = await response.json();
      if (result.result === 'ok') {
        setQuestions((prev) =>
          prev.map((q, index) =>
            index === qIndex
              ? { ...q, imageUrl: '', imagePublicId: '', imageDeleteToken: '' }
              : q
          )
        );
        toast.success(`Image deleted for Question ${qIndex + 1}`);
      } else {
        throw new Error(result.error?.message || 'Image delete failed');
      }
    } catch (error) {
      console.error('Image delete error:', error);
      toast.error(`Error deleting image for Question ${qIndex + 1}`);
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
    if (!window.cloudinary) {
      toast.error('Cloudinary widget not loaded');
      return;
    }

    const newIndex = questions.length;
    const imageWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'ddovidvsp',
        uploadPreset: 'image_widget_unsigned',
        folder: 'quiz_images',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'image',
        maxFileSize: 5000000,
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif'],
        returnDeleteToken: true,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          const { secure_url, public_id, delete_token } = result.info;
          setQuestions((prev) =>
            prev.map((question, qIndex) =>
              qIndex === newIndex
                ? {
                    ...question,
                    imageUrl: secure_url,
                    imagePublicId: public_id,
                    imageDeleteToken: delete_token,
                  }
                : question
            )
          );
          toast.success(`Image uploaded for Question ${newIndex + 1}`);
        } else if (error) {
          console.error('Image upload error:', error);
          toast.error(`Error uploading image for Question ${newIndex + 1}`);
        }
      }
    );

    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        selectedIndex: null,
        submitted: false,
        imageUrl: '',
        imagePublicId: '',
        imageDeleteToken: '',
      },
    ]);

    if (imageWidget) {
      setImageWidgets((prev) => ({ ...prev, [newIndex]: imageWidget }));
    }
  };

  const handleRemoveQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    setImageWidgets((prev) => {
      const newWidgets = { ...prev };
      delete newWidgets[index];
      return Object.keys(newWidgets).reduce((acc, key) => {
        const newKey = key > index ? key - 1 : key;
        acc[newKey] = newWidgets[key];
        return acc;
      }, {});
    });
    toast.info('Question removed');
  };

  const handleSubmit = async () => {
    if (!videoUrl) {
      toast.error('Please upload a video before submitting.');
      return;
    }
    if (questions.length === 0) {
      toast.error('Please add at least one question.');
      return;
    }
    for (const [qIndex, q] of questions.entries()) {
      if (!q.question.trim()) {
        toast.error(`Question ${qIndex + 1} must have a description.`);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        toast.error(`All options for Question ${qIndex + 1} must be filled.`);
        return;
      }
      const uniqueOptions = new Set(q.options.map(opt => opt.trim()));
      if (uniqueOptions.size !== q.options.length) {
        toast.error(`Options must be unique for Question ${qIndex + 1}.`);
        return;
      }
    }

    const payload = {
      videoUrl,
      questions: questions.map(q => ({
        question: q.question.trim(),
        options: q.options.map(opt => opt.trim()),
        correctIndex: q.correctIndex,
        imageUrl: q.imageUrl || '',
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
          imageUrl: '',
          imagePublicId: '',
          imageDeleteToken: '',
        },
      ]);
      setImageWidgets({});
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error(`Error saving quiz: ${error.message}`);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/quizzes');
      if (!res.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      const data = await res.json();
      // Ensure data is an array and each quiz has a questions array
      setSavedQuizzes(Array.isArray(data) ? data.map(quiz => ({
        ...quiz,
        questions: Array.isArray(quiz.questions) ? quiz.questions : []
      })) : []);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
      toast.error('Failed to fetch quizzes');
      setSavedQuizzes([]);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <StyledContainer component="main" sx={{ flexGrow: 1 }}>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#2e1a47',
              background: 'linear-gradient(45deg, #2e1a47, #6d4c9e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
            }}
          >
            Visitor Video & Quiz Creator
          </Typography>

          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: '#f1f3f5',
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
              label={<Typography variant="body1" sx={{ color: '#2e1a47' }}>Preview Mode</Typography>}
            />
            {previewMode && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 'bold', color: '#2e1a47' }}>
                  Score: {calculateScore()} / {questions.length}
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={resetQuiz}
                  sx={{ borderRadius: '25px', color: '#2e1a47', borderColor: '#2e1a47' }}
                >
                  Reset Quiz
                </Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom sx={{ color: '#2e1a47', fontWeight: 'medium' }}>
                  Upload Video
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleUpload}
                  sx={{
                    mb: 3,
                    background: 'linear-gradient(45deg, #2e1a47, #6d4c9e)',
                    borderRadius: '25px',
                    textTransform: 'none',
                    px: 4,
                    py: 1,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #3f2a5d, #7e5daf)',
                      transform: 'scale(1.02)',
                      transition: 'all 0.3s ease',
                    },
                  }}
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
                      sx={{ mt: 2, borderRadius: '25px', width: '100%' }}
                    >
                      Delete Video
                    </Button>
                  </StyledVideoBox>
                )}
              </StyledPaper>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom sx={{ color: '#2e1a47', fontWeight: 'medium' }}>
                  Create Questions
                </Typography>
                {Array.isArray(questions) && questions.map((q, qIndex) => (
                  <StyledQuestionBox key={qIndex} sx={{ mb: 3 }}>
                    <TextField
                      label={`Question ${qIndex + 1}`}
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                      fullWidth
                      margin="normal"
                      disabled={previewMode}
                      variant="filled"
                      sx={{
                        '& .MuiFilledInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f1f3f5',
                          '&:before': { borderBottom: 'none' },
                          '&:after': { borderBottom: 'none' },
                          '&:hover': { bgcolor: '#e9ecef' },
                        },
                      }}
                    />
                    {!previewMode && (
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<ImageIcon />}
                          onClick={() => handleImageUpload(qIndex)}
                          sx={{
                            borderRadius: '25px',
                            color: '#2e1a47',
                            borderColor: '#2e1a47',
                            '&:hover': { borderColor: '#6d4c9e', color: '#6d4c9e' },
                          }}
                        >
                          {q.imageUrl ? 'Replace Image' : 'Upload Image'}
                        </Button>
                        {q.imageUrl && (
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteImage(qIndex)}
                            sx={{ borderRadius: '25px' }}
                          >
                            Delete Image
                          </Button>
                        )}
                      </Box>
                    )}
                    {q.imageUrl && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <img
                          src={q.imageUrl}
                          alt={`Question ${qIndex + 1} preview`}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '150px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            toast.error(`Failed to load image for Question ${qIndex + 1}`);
                          }}
                        />
                      </Box>
                    )}
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 'medium', color: '#2e1a47' }}
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
                        {Array.isArray(q.options) && q.options.map((opt, oIndex) => (
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
                                sx={{ width: '300px', color: '#2e1a47' }}
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
                          sx={{
                            background: 'linear-gradient(45deg, #2e1a47, #6d4c9e)',
                            borderRadius: '25px',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #3f2a5d, #7e5daf)',
                              transform: 'scale(1.02)',
                              transition: 'all 0.3s ease',
                            },
                          }}
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
                      sx={{
                        borderRadius: '25px',
                        color: '#2e1a47',
                        borderColor: '#2e1a47',
                        '&:hover': { borderColor: '#6d4c9e', color: '#6d4c9e' },
                      }}
                    >
                      Add Question
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleSubmit}
                      sx={{
                        background: 'linear-gradient(45deg, #2e1a47, #6d4c9e)',
                        borderRadius: '25px',
                        px: 4,
                        py: 1,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #3f2a5d, #7e5daf)',
                          transform: 'scale(1.02)',
                          transition: 'all 0.3s ease',
                        },
                      }}
                    >
                      Save Quiz
                    </Button>
                  </Box>
                )}
              </StyledPaper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: '#2e1a47',
                background: 'linear-gradient(45deg, #2e1a47, #6d4c9e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Saved Quizzes
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {loadingQuizzes ? (
              <Typography color="#2e1a47">Loading quizzes...</Typography>
            ) : !Array.isArray(savedQuizzes) || savedQuizzes.length === 0 ? (
              <Typography color="#2e1a47">No quizzes found.</Typography>
            ) : (
              <Grid container spacing={3}>
                {savedQuizzes.map((quiz) => (
                  <Grid item xs={12} sm={6} md={4} key={quiz._id}>
                    <StyledQuizCard>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2e1a47' }}>
                        Video Preview
                      </Typography>
                      <StyledVideoBox>
                        <video
                          src={quiz.videoUrl}
                          controls
                          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                        />
                      </StyledVideoBox>
                      <Typography variant="subtitle2" sx={{ mt: 2, color: '#2e1a47' }}>
                        Questions:
                      </Typography>
                      <Box sx={{ maxHeight: '150px', overflowY: 'auto' }}>
                        <ul style={{ paddingLeft: '20px' }}>
                          {Array.isArray(quiz.questions) && quiz.questions.map((q, idx) => (
                            <li key={idx}>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#2e1a47' }}>
                                {q.question}
                              </Typography>
                              {q.imageUrl && (
                                <img
                                  src={q.imageUrl}
                                  alt={`Question ${idx + 1}`}
                                  style={{
                                    maxWidth: '100px',
                                    maxHeight: '100px',
                                    marginTop: '5px',
                                    borderRadius: '4px',
                                  }}
                                  onError={(e) => (e.target.style.display = 'none')}
                                />
                              )}
                              <ul style={{ paddingLeft: '20px' }}>
                                {Array.isArray(q.options) && q.options.map((opt, i) => (
                                  <li
                                    key={i}
                                    style={{ color: i === q.correctIndex ? '#4caf50' : '#2e1a47' }}
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
                        sx={{ mt: 2, borderRadius: '25px', width: '100%' }}
                      >
                        Delete Quiz
                      </Button>
                    </StyledQuizCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Container>
      </StyledContainer>
      <Footer />
    </Box>
  );
};

export default VideoUpload;