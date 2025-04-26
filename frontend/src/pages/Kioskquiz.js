import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Container,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QRCodeCanvas } from "qrcode.react";

const Kioskquiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const visitorId = location.state?.userId;
  const qrCodeRef = useRef(null);

  // State for quiz data
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [quizError, setQuizError] = useState(null);

  // State for quiz answers and results
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [generatedId, setGeneratedId] = useState("");

  // State for visitor data
  const [visitor, setVisitor] = useState(null);
  const [loadingVisitor, setLoadingVisitor] = useState(false);
  const [visitorError, setVisitorError] = useState(null);

  // Fetch quiz questions on mount
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoadingQuiz(true);
        const response = await fetch("http://localhost:5000/api/quizzes");
        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        const data = await response.json();
        if (data.length > 0) {
          const latestQuiz = data[0];
          setQuizQuestions(
            latestQuiz.questions.map((q) => ({
              question: q.question,
              options: q.options,
              correctAnswer: q.options[q.correctIndex],
              imageUrl: q.imageUrl || null,
            }))
          );
          setAnswers(Array(latestQuiz.questions.length).fill(""));
        } else {
          throw new Error("No quizzes available");
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setQuizError("Failed to load quiz questions. Please try again later.");
        toast.error("Failed to load quiz questions.");
      } finally {
        setLoadingQuiz(false);
      }
    };

    fetchQuiz();
  }, []);

  // Fetch visitor data when the user passes the quiz
  useEffect(() => {
    if (submitted && score > 75 && visitorId) {
      const fetchVisitorData = async () => {
        try {
          setLoadingVisitor(true);
          console.log("Fetching visitor with ID:", visitorId);
          const response = await fetch(`http://localhost:5000/api/visitors/${visitorId}`);
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Visitor ID not found in database");
            }
            throw new Error("Failed to fetch visitor data");
          }
          const data = await response.json();
          const visitorData = data.data || data;
          setVisitor(visitorData);
        } catch (err) {
          setVisitorError(err.message);
          console.error("Error fetching visitor details:", err);
          toast.error(
            err.message === "Visitor ID not found in database"
              ? "Visitor ID not found. You can still print a temporary ID."
              : "Failed to fetch visitor data for printing."
          );
        } finally {
          setLoadingVisitor(false);
        }
      };
      fetchVisitorData();
    }
  }, [submitted, score, visitorId]);

  // Handle answer selection
  const handleAnswerChange = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  // Generate a random ID
  const generateRandomId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Handle quiz submission
  const handleSubmit = () => {
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correctAnswer) {
        correctAnswers += 1;
      }
    });

    const scorePercentage = (correctAnswers / quizQuestions.length) * 100;
    setScore(scorePercentage);
    setSubmitted(true);

    if (scorePercentage > 75) {
      const newId = generateRandomId();
      setGeneratedId(newId);
      toast.success(
        `Congratulations! You passed the quiz with a score of ${scorePercentage.toFixed(2)}%. Your ID: ${newId}`
      );
    } else {
      toast.error(
        `You scored ${scorePercentage.toFixed(2)}%. You need at least 75% to pass. Please retake the quiz or review the video.`
      );
    }
  };

  // Handle retake quiz
  const handleRetakeQuiz = () => {
    setAnswers(Array(quizQuestions.length).fill(""));
    setSubmitted(false);
    setScore(0);
    setGeneratedId("");
    setVisitor(null);
    setVisitorError(null);
  };

  // Handle going back to login
  const handleGoBackToLogin = () => {
    navigate("/LoginKiosk");
  };

  // Handle going back to the video page
  const handleGoBackToVideo = () => {
    navigate("/VideoPage", { state: { userId: visitorId } });
  };

  // Print the visitor card
  const printVisitorCard = () => {
    const tempVisitor = visitor || {
      _id: generatedId,
      fullName: "Temporary Visitor",
      checkInTime: new Date().toISOString(),
      reasonForVisit: "Visitor Quiz",
      designation: "Guest",
      visitorCompany: "N/A",
      department: "N/A",
      personToVisit: "N/A",
      photoUrl: "/default-avatar.png",
    };

    const qrCanvas = qrCodeRef.current?.querySelector("canvas");
    if (!qrCanvas) {
      toast.error("Failed to generate QR code for printing.");
      return;
    }
    const qrDataUrl = qrCanvas.toDataURL("image/png");

    const preloadImage = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url || "/default-avatar.png";
        img.onload = () => resolve(img.src);
        img.onerror = () => resolve("/default-avatar.png");
      });
    };

    preloadImage(tempVisitor.photoUrl).then((photoUrl) => {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visitor Hall Ticket</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      margin: 0;
    }
    .hall-ticket {
      width: 450px;
      min-height: 350px;
      padding: 15px;
      box-sizing: border-box;
      background-color: #fff;
      border: 2px solid #5F3B91;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .header {
      background-color: #5F3B91;
      color: #fff;
      padding: 10px;
      text-align: center;
      border-radius: 4px 4px 0 0;
      margin: -15px -15px 0 -15px;
      font-size: 18px;
    }
    .content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 10px;
    }
    .left-section {
      text-align: left;
      font-size: 14px;
      max-width: 55%;
    }
    .right-section {
      text-align: center;
    }
    img.photo {
      border-radius: 50%;
      border: 2px solid #D1C4E9;
      width: 70px;
      height: 70px;
    }
    .qr-code-container img {
      width: 80px;
      height: 80px;
      padding: 5px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .qr-label {
      font-size: 12px;
      color: #333;
      font-weight: bold;
    }
    .signature-section {
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      margin-top: 5px;
    }
    .signature-box {
      width: 150px;
      height: 30px;
      border: 1.5px solid #5F3B91;
      margin: 5px auto;
      text-align: center;
      line-height: 30px;
      font-style: italic;
      color: #999;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #5F3B91;
      font-weight: bold;
      border-top: 1.5px dashed #5F3B91;
      padding-top: 5px;
    }
    p {
      margin: 5px 0;
    }
    h3 {
      margin: 0;
      font-size: 16px;
    }
    h2 {
      margin: 0;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="hall-ticket">
    <div class="header">
      <h2>VISITOR HALL TICKET</h2>
    </div>
    <div class="content">
      <div class="left-section">
        <h3>${tempVisitor.fullName}</h3>
        <p><strong>ID:</strong> ${tempVisitor._id}</p>
        <p><strong>Check-In Time:</strong> ${new Date(tempVisitor.checkInTime).toLocaleString()}</p>
        <p><strong>Purpose:</strong> ${tempVisitor.reasonForVisit}</p>
        <p><strong>Designation:</strong> ${tempVisitor.designation}</p>
        <p><strong>Company:</strong> ${tempVisitor.visitorCompany}</p>
        <p><strong>Department:</strong> ${tempVisitor.department}</p>
        <p><strong>Host:</strong> ${tempVisitor.personToVisit}</p>
      </div>
      <div class="right-section">
        <img src="${photoUrl}" alt="Visitor Photo" class="photo" />
        <div class="qr-code-container">
          <img src="${qrDataUrl}" alt="QR Code" />
          <p class="qr-label">Scan to Verify</p>
        </div>
      </div>
    </div>
    <div class="signature-section">
      <p>Host Signature</p>
      <div class="signature-box">__________________</div>
    </div>
    <div class="footer">
      <p>This hall ticket is valid for one-time entry only</p>
    </div>
  </div>
  <script>
    window.onload = () => {
      window.focus();
      window.print();
    };
    window.addEventListener('afterprint', () => {
      window.close();
    });
    setTimeout(() => {
      window.close();
    }, 10000);
  </script>
</body>
</html>
      `);
      printWindow.document.close();
    }).catch((err) => {
      console.error("Error preloading image:", err);
      toast.error("Failed to load content for printing.");
    });
  };

  if (!visitorId) {
    toast.error("Visitor ID not found. Please log in again.");
    setTimeout(() => {
      navigate("/");
    }, 2000);
    return null;
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Container maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
        <Typography
          variant="h4"
          sx={{ textAlign: "center", mb: 4, color: "#4b0082", fontWeight: "bold" }}
        >
          Visitor Safety Quiz
        </Typography>

        {visitor && (
          <Box sx={{ display: "none" }} ref={qrCodeRef}>
            <QRCodeCanvas value={visitor._id} size={80} />
          </Box>
        )}

        {loadingQuiz ? (
          <Typography>Loading quiz...</Typography>
        ) : quizError ? (
          <Typography color="error">{quizError}</Typography>
        ) : quizQuestions.length === 0 ? (
          <Typography color="error">
            No quiz questions available. Please contact the administrator.
          </Typography>
        ) : !submitted ? (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            {quizQuestions.map((question, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                {question.imageUrl && (
                  <Box sx={{ mb: 2, textAlign: "center" }}>
                    <img
                      src={question.imageUrl}
                      alt={`Question ${index + 1}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        console.error("Failed to load image:", question.imageUrl);
                      }}
                    />
                  </Box>
                )}
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {index + 1}. {question.question}
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  >
                    {question.options.map((option, optionIndex) => (
                      <FormControlLabel
                        key={optionIndex}
                        value={option}
                        control={<Radio />}
                        label={option}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            ))}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#4b0082",
                color: "white",
                ":hover": { backgroundColor: "#6a0dad" },
                display: "block",
                mx: "auto",
              }}
              onClick={handleSubmit}
              disabled={answers.some((answer) => answer === "")}
            >
              Submit Quiz
            </Button>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 2, color: score > 75 ? "green" : "red" }}>
              {score > 75 ? "Congratulations! You Passed!" : "Sorry, You Did Not Pass"}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Score: {score.toFixed(2)}%
            </Typography>
            {score > 75 ? (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Your Generated ID: <strong>{generatedId}</strong>
                </Typography>
                {visitorError && (
                  <Typography variant="body1" sx={{ mb: 2, color: "red" }}>
                    {visitorError}. Printing a temporary ID.
                  </Typography>
                )}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4b0082",
                    color: "white",
                    ":hover": { backgroundColor: "#6a0dad" },
                    mr: 2,
                  }}
                  onClick={printVisitorCard}
                  disabled={loadingVisitor}
                >
                  {loadingVisitor ? "Loading..." : "Print ID"}
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  You need at least 75% to pass. Please retake the quiz, review the video, or go back to login.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4b0082",
                    color: "white",
                    ":hover": { backgroundColor: "#6a0dad" },
                    mr: 2,
                  }}
                  onClick={handleRetakeQuiz}
                >
                  Retake Quiz
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#4b0082",
                    color: "#4b0082",
                    ":hover": { borderColor: "#6a0dad", color: "#6a0dad" },
                    mr: 2,
                  }}
                  onClick={handleGoBackToVideo}
                >
                  Back to Video
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#4b0082",
                    color: "#4b0082",
                    ":hover": { borderColor: "#6a0dad", color: "#6a0dad" },
                  }}
                  onClick={handleGoBackToLogin}
                >
                  Back to Login
                </Button>
              </>
            )}
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Kioskquiz;