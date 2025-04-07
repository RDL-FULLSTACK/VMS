// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   Container,
//   Typography,
//   TextField,
//   Paper,
//   Grid,
//   Box,
//   IconButton,
//   Radio,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Switch,
//   Alert,
// } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import DeleteIcon from '@mui/icons-material/Delete';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';

// const VideoUpload = () => {
//   const [videoUrl, setVideoUrl] = useState('');
//   const [publicId, setPublicId] = useState('');
//   const [deleteToken, setDeleteToken] = useState('');
//   const [widget, setWidget] = useState(null);
//   const [previewMode, setPreviewMode] = useState(false);
//   const [questions, setQuestions] = useState([
//     {
//       question: '',
//       options: ['', '', '', ''],
//       correctIndex: 0,
//       selectedIndex: null,
//       submitted: false,
//     },
//   ]);

//   useEffect(() => {
//     const savedVideoUrl = localStorage.getItem('videoUrl');
//     const savedPublicId = localStorage.getItem('publicId');
//     const savedDeleteToken = localStorage.getItem('deleteToken');

//     if (savedVideoUrl) setVideoUrl(savedVideoUrl);
//     if (savedPublicId) setPublicId(savedPublicId);
//     if (savedDeleteToken) setDeleteToken(savedDeleteToken);

//     const loadCloudinary = () => {
//       if (!window.cloudinary) {
//         const script = document.createElement('script');
//         script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
//         script.async = true;
//         script.onload = initializeWidget;
//         document.body.appendChild(script);
//       } else {
//         initializeWidget();
//       }
//     };

//     loadCloudinary();
//   }, []);

//   const initializeWidget = () => {
//     const cloudinaryWidget = window.cloudinary.createUploadWidget(
//       {
//         cloudName: 'dd6wweekb',
//         uploadPreset: 'video_widget_unsigned',
//         folder: 'my_videos',
//         sources: ['local', 'url', 'camera'],
//         multiple: false,
//         resourceType: 'video',
//         maxFileSize: 10000000,
//         clientAllowedFormats: ['mp4', 'webm', 'mov', 'avi'],
//         returnDeleteToken: true,
//       },
//       (error, result) => {
//         if (!error && result && result.event === 'success') {
//           const { secure_url, public_id, delete_token } = result.info;
//           setVideoUrl(secure_url);
//           setPublicId(public_id);
//           setDeleteToken(delete_token);

//           localStorage.setItem('videoUrl', secure_url);
//           localStorage.setItem('publicId', public_id);
//           localStorage.setItem('deleteToken', delete_token);
//         } else if (error) {
//           console.error('Upload error:', error);
//           alert('Error uploading video');
//         }
//       }
//     );
//     setWidget(cloudinaryWidget);
//   };

//   const handleUpload = () => {
//     if (widget) widget.open();
//     else alert('Upload widget not ready');
//   };

//   const handleDelete = async () => {
//     if (!deleteToken || !publicId) return alert('No video to delete');

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/dd6wweekb/delete_by_token`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ token: deleteToken }),
//         }
//       );

//       const result = await response.json();
//       if (result.result === 'ok') {
//         setVideoUrl('');
//         setPublicId('');
//         setDeleteToken('');
//         localStorage.removeItem('videoUrl');
//         localStorage.removeItem('publicId');
//         localStorage.removeItem('deleteToken');
//         alert('Video deleted successfully');
//       } else {
//         throw new Error(result.error?.message || 'Delete failed');
//       }
//     } catch (error) {
//       console.error('Delete error:', error);
//       alert('Error deleting video: ' + error.message);
//     }
//   };

//   const handleAnswerSelect = (qIndex, oIndex) => {
//     if (!previewMode) return;
    
//     const updated = [...questions];
//     updated[qIndex].selectedIndex = oIndex;
//     updated[qIndex].submitted = false;
//     setQuestions(updated);
//   };

//   const handleSubmitAnswer = (qIndex) => {
//     const updated = [...questions];
//     updated[qIndex].submitted = true;
//     setQuestions(updated);
//   };

//   const getAnswerFeedback = (question) => {
//     if (!question.submitted || question.selectedIndex === null) return null;
    
//     const isCorrect = question.selectedIndex === question.correctIndex;
//     return (
//       <Alert 
//         severity={isCorrect ? 'success' : 'error'}
//         icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
//         sx={{ mt: 1 }}
//       >
//         {isCorrect ? 'Correct!' : `Wrong. Correct answer: ${question.options[question.correctIndex]}`}
//       </Alert>
//     );
//   };

//   const calculateScore = () => {
//     return questions.reduce((score, question) => {
//       if (question.submitted && question.selectedIndex === question.correctIndex) {
//         return score + 1;
//       }
//       return score;
//     }, 0);
//   };

//   const handleQuestionChange = (index, value) => {
//     const updated = [...questions];
//     updated[index].question = value;
//     updated[index].submitted = false;
//     setQuestions(updated);
//   };

//   const handleOptionChange = (qIndex, oIndex, value) => {
//     const updated = [...questions];
//     updated[qIndex].options[oIndex] = value;
//     updated[qIndex].submitted = false;
//     setQuestions(updated);
//   };

//   const handleCorrectChange = (qIndex, value) => {
//     const updated = [...questions];
//     updated[qIndex].correctIndex = parseInt(value);
//     updated[qIndex].submitted = false;
//     setQuestions(updated);
//   };

//   const handleAddQuestion = () => {
//     setQuestions([
//       ...questions,
//       { 
//         question: '', 
//         options: ['', '', '', ''], 
//         correctIndex: 0,
//         selectedIndex: null,
//         submitted: false 
//       },
//     ]);
//   };

//   const handleRemoveQuestion = (index) => {
//     const updated = questions.filter((_, i) => i !== index);
//     setQuestions(updated);
//   };

//   const handleSubmit = () => {
//     const payload = {
//       videoUrl,
//       questions: questions.map(q => ({
//         question: q.question,
//         options: q.options,
//         correctIndex: q.correctIndex
//       })),
//     };
//     console.log('Submitting:', payload);
//     alert('Submitted! (Send this to backend in real app)');
//   };

//   const resetQuiz = () => {
//     const updated = questions.map(q => ({
//       ...q,
//       selectedIndex: null,
//       submitted: false
//     }));
//     setQuestions(updated);
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Visitor Video & Multiple Choice Questionnaire
//       </Typography>

//       <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <FormControlLabel
//           control={
//             <Switch
//               checked={previewMode}
//               onChange={(e) => setPreviewMode(e.target.checked)}
//             />
//           }
//           label="Preview Mode"
//         />
//         {previewMode && (
//           <Box>
//             <Typography variant="subtitle1" component="span">
//               Score: {calculateScore()} / {questions.length}
//             </Typography>
//             <Button 
//               variant="outlined" 
//               size="small" 
//               onClick={resetQuiz}
//               sx={{ ml: 2 }}
//             >
//               Reset Quiz
//             </Button>
//           </Box>
//         )}
//       </Box>

//       <Grid container spacing={4}>
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ p: 2 }}>
//             <Typography variant="subtitle1" gutterBottom>
//               Upload & Preview Video
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<CloudUploadIcon />}
//               onClick={handleUpload}
//               sx={{ mb: 2 }}
//             >
//               Upload Video
//             </Button>

//             {videoUrl && (
//               <>
//                 <video
//                   src={videoUrl}
//                   controls
//                   style={{ width: '100%', borderRadius: '12px' }}
//                 />
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   startIcon={<DeleteIcon />}
//                   onClick={handleDelete}
//                   sx={{ mt: 2 }}
//                 >
//                   Delete Video
//                 </Button>
//               </>
//             )}
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ p: 2 }}>
//             <Typography variant="subtitle1" gutterBottom>
//               Questions
//             </Typography>

//             {questions.map((q, qIndex) => (
//               <Box key={qIndex} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
//                 <TextField
//                   label={`Question ${qIndex + 1}`}
//                   value={q.question}
//                   onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
//                   fullWidth
//                   margin="normal"
//                   disabled={previewMode}
//                 />

//                 <FormControl component="fieldset" sx={{ mt: 2 }}>
//                   <FormLabel component="legend">
//                     {previewMode ? 'Select an answer' : 'Options (Select correct answer)'}
//                   </FormLabel>
//                   <RadioGroup
//                     value={previewMode ? q.selectedIndex : q.correctIndex}
//                     onChange={(e) => previewMode 
//                       ? handleAnswerSelect(qIndex, parseInt(e.target.value))
//                       : handleCorrectChange(qIndex, e.target.value)
//                     }
//                   >
//                     {q.options.map((opt, oIndex) => (
//                       <FormControlLabel
//                         key={oIndex}
//                         value={oIndex}
//                         control={<Radio />}
//                         label={
//                           <TextField
//                             value={opt}
//                             onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
//                             placeholder={`Option ${oIndex + 1}`}
//                             disabled={previewMode}
//                           />
//                         }
//                       />
//                     ))}
//                   </RadioGroup>
//                 </FormControl>

//                 {previewMode && (
//                   <Box sx={{ mt: 2 }}>
//                     <Button
//                       variant="contained"
//                       size="small"
//                       onClick={() => handleSubmitAnswer(qIndex)}
//                       disabled={q.selectedIndex === null || q.submitted}
//                     >
//                       Check Answer
//                     </Button>
//                     {getAnswerFeedback(q)}
//                   </Box>
//                 )}

//                 {!previewMode && questions.length > 1 && (
//                   <IconButton
//                     color="error"
//                     onClick={() => handleRemoveQuestion(qIndex)}
//                     sx={{ mt: 1 }}
//                   >
//                     <RemoveCircleOutlineIcon />
//                   </IconButton>
//                 )}
//               </Box>
//             ))}

//             <Box sx={{ mt: 2 }}>
//               {!previewMode && (
//                 <>
//                   <Button onClick={handleAddQuestion} sx={{ mr: 2 }}>
//                     + Add Question
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleSubmit}
//                   >
//                     Submit
//                   </Button>
//                 </>
//               )}
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default VideoUpload;
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
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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
        } else if (error) {
          console.error('Upload error:', error);
          alert('Error uploading video');
        }
      }
    );
    setWidget(cloudinaryWidget);
  };

  const handleUpload = () => {
    if (widget) widget.open();
    else alert('Upload widget not ready');
  };

  const handleDelete = async () => {
    if (!deleteToken || !publicId) return alert('No video to delete');

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
        alert('Video deleted successfully');
      } else {
        throw new Error(result.error?.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting video: ' + error.message);
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
        sx={{ mt: 1 }}
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
  };

  const handleSubmit = async () => {
    if (!videoUrl) {
      alert('Please upload a video before submitting.');
      return;
    }
    if (questions.some(q => !q.question || q.options.some(opt => !opt))) {
      alert('Please fill in all questions and options before submitting.');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save quiz');
      }

      const savedQuiz = await response.json();
      alert('Quiz saved successfully!');
      fetchQuizzes(); // Refresh list
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
      alert('Error saving quiz: ' + error.message);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/quizzes');
      const data = await res.json();
      setSavedQuizzes(data);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
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
      alert('Quiz deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting quiz');
    }
  };

  const resetQuiz = () => {
    const updated = questions.map(q => ({
      ...q,
      selectedIndex: null,
      submitted: false,
    }));
    setQuestions(updated);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Visitor Video & Multiple Choice Questionnaire
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Switch
              checked={previewMode}
              onChange={(e) => setPreviewMode(e.target.checked)}
            />
          }
          label="Preview Mode"
        />
        {previewMode && (
          <Box>
            <Typography variant="subtitle1" component="span">
              Score: {calculateScore()} / {questions.length}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={resetQuiz}
              sx={{ ml: 2 }}
            >
              Reset Quiz
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Upload & Preview Video
            </Typography>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={handleUpload}
              sx={{ mb: 2 }}
            >
              Upload Video
            </Button>

            {videoUrl && (
              <>
                <video
                  src={videoUrl}
                  controls
                  style={{ width: '100%', borderRadius: '12px' }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={{ mt: 2 }}
                >
                  Delete Video
                </Button>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Questions
            </Typography>

            {questions.map((q, qIndex) => (
              <Box key={qIndex} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <TextField
                  label={`Question ${qIndex + 1}`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  fullWidth
                  margin="normal"
                  disabled={previewMode}
                />

                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <FormLabel component="legend">
                    {previewMode ? 'Select an answer' : 'Options (Select correct answer)'}
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
                        control={<Radio />}
                        label={
                          <TextField
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            disabled={previewMode}
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
                      size="small"
                      onClick={() => handleSubmitAnswer(qIndex)}
                      disabled={q.selectedIndex === null || q.submitted}
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
              </Box>
            ))}

            <Box sx={{ mt: 2 }}>
              {!previewMode && (
                <>
                  <Button onClick={handleAddQuestion} sx={{ mr: 2 }}>
                    + Add Question
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Saved Quizzes Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          Saved Quizzes
        </Typography>

        {loadingQuizzes ? (
          <Typography>Loading quizzes...</Typography>
        ) : savedQuizzes.length === 0 ? (
          <Typography>No quizzes found.</Typography>
        ) : (
          savedQuizzes.map((quiz) => (
            <Paper key={quiz._id} sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1">Video:</Typography>
              <video
  src={videoUrl}
  controls
  style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }}
/>


              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Questions:
              </Typography>
              <ul>
                {quiz.questions.map((q, idx) => (
                  <li key={idx}>
                    <strong>{q.question}</strong>
                    <ul>
                      {q.options.map((opt, i) => (
                        <li key={i} style={{ color: i === q.correctIndex ? 'green' : 'inherit' }}>
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteQuiz(quiz._id)}
              >
                Delete Quiz
              </Button>
            </Paper>
          ))
        )}
      </Box>
    </Container>
  );
};

export default VideoUpload;
