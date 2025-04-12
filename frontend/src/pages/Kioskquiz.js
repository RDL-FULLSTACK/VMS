// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   Button,
//   Container,
// } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Sample quiz questions related to visitor safety protocols
// const quizQuestions = [
//   {
//     question: "What should you do if you notice a fire hazard during your visit?",
//     options: [
//       "Ignore it and continue your visit",
//       "Report it to the nearest staff member immediately",
//       "Take a photo and post it on social media",
//       "Try to fix it yourself",
//     ],
//     correctAnswer: "Report it to the nearest staff member immediately",
//   },
//   {
//     question: "Where should you wear your visitor badge at all times?",
//     options: [
//       "In your pocket",
//       "On your vehicle dashboard",
//       "Visible on your person",
//       "At home",
//     ],
//     correctAnswer: "Visible on your person",
//   },
//   {
//     question: "What is the first thing you should do upon arriving at the facility?",
//     options: [
//       "Start your meeting immediately",
//       "Check in at the reception or kiosk",
//       "Wander around to explore the facility",
//       "Take a coffee break",
//     ],
//     correctAnswer: "Check in at the reception or kiosk",
//   },
//   {
//     question: "What should you do if you get lost in the facility?",
//     options: [
//       "Keep walking until you find your way",
//       "Ask a staff member for directions",
//       "Leave the facility immediately",
//       "Call a friend for help",
//     ],
//     correctAnswer: "Ask a staff member for directions",
//   },
// ];

// const Kioskquiz = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const visitorId = location.state?.userId; // Get the visitor ID from the previous page

//   // State to store user answers and quiz results
//   const [answers, setAnswers] = useState(Array(quizQuestions.length).fill(""));
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [generatedId, setGeneratedId] = useState("");

//   // Handle answer selection
//   const handleAnswerChange = (questionIndex, value) => {
//     const newAnswers = [...answers];
//     newAnswers[questionIndex] = value;
//     setAnswers(newAnswers);
//   };

//   // Generate a simple random ID (e.g., 6-character alphanumeric string)
//   const generateRandomId = () => {
//     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let result = "";
//     for (let i = 0; i < 6; i++) {
//       result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
//   };

//   // Handle quiz submission
//   const handleSubmit = () => {
//     // Calculate the score
//     let correctAnswers = 0;
//     answers.forEach((answer, index) => {
//       if (answer === quizQuestions[index].correctAnswer) {
//         correctAnswers += 1;
//       }
//     });

//     const scorePercentage = (correctAnswers / quizQuestions.length) * 100;
//     setScore(scorePercentage);
//     setSubmitted(true);

//     // Check if the user passed (75% or higher)
//     if (scorePercentage > 75) {
//       const newId = generateRandomId();
//       setGeneratedId(newId);
//       toast.success(`Congratulations! You passed the quiz with a score of ${scorePercentage.toFixed(2)}%. Your ID: ${newId}`);
//     } else {
//       toast.error(`You scored ${scorePercentage.toFixed(2)}%. You need at least 75% to pass. Please retake the quiz or review the video.`);
//     }
//   };

//   // Handle retake quiz
//   const handleRetakeQuiz = () => {
//     setAnswers(Array(quizQuestions.length).fill(""));
//     setSubmitted(false);
//     setScore(0);
//     setGeneratedId("");
//   };

//   // Handle proceeding after passing
//   const handleProceed = () => {
//     // Redirect to the VisitorCard page with the full visitor ID
//     navigate(`/VisitorCardKiosk/${visitorId}`);
//   };

//   // Handle going back to login if failed
//   const handleGoBackToLogin = () => {
//     navigate("/LoginKiosk");
//   };

//   // Handle going back to the video page if failed
//   const handleGoBackToVideo = () => {
//     navigate("/VideoPage", { state: { userId: visitorId } });
//   };

//   // If visitorId is not available, redirect to login
//   if (!visitorId) {
//     toast.error("Visitor ID not found. Please log in again.");
//     setTimeout(() => {
//       navigate("/");
//     }, 2000);
//     return null;
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//       <Container maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
//         <Typography
//           variant="h4"
//           sx={{ textAlign: "center", mb: 4, color: "#4b0082", fontWeight: "bold" }}
//         >
//           Visitor Safety Quiz
//         </Typography>

//         {!submitted ? (
//           <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
//             {quizQuestions.map((question, index) => (
//               <Box key={index} sx={{ mb: 4 }}>
//                 <Typography variant="h6" sx={{ mb: 2 }}>
//                   {index + 1}. {question.question}
//                 </Typography>
//                 <FormControl component="fieldset">
//                   <RadioGroup
//                     value={answers[index]}
//                     onChange={(e) => handleAnswerChange(index, e.target.value)}
//                   >
//                     {question.options.map((option, optionIndex) => (
//                       <FormControlLabel
//                         key={optionIndex}
//                         value={option}
//                         control={<Radio />}
//                         label={option}
//                         sx={{ mb: 1 }}
//                       />
//                     ))}
//                   </RadioGroup>
//                 </FormControl>
//               </Box>
//             ))}
//             <Button
//               variant="contained"
//               sx={{
//                 backgroundColor: "#4b0082",
//                 color: "white",
//                 ":hover": { backgroundColor: "#6a0dad" },
//                 display: "block",
//                 mx: "auto",
//               }}
//               onClick={handleSubmit}
//               disabled={answers.some((answer) => answer === "")}
//             >
//               Submit Quiz
//             </Button>
//           </Paper>
//         ) : (
//           <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
//             <Typography variant="h5" sx={{ mb: 2, color: score > 75 ? "green" : "red" }}>
//               {score > 75 ? "Congratulations! You Passed!" : "Sorry, You Did Not Pass"}
//             </Typography>
//             <Typography variant="h6" sx={{ mb: 2 }}>
//               Your Score: {score.toFixed(2)}%
//             </Typography>
//             {score > 75 ? (
//               <>
//                 <Typography variant="body1" sx={{ mb: 2 }}>
//                   Your Generated ID: <strong>{generatedId}</strong>
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   sx={{
//                     backgroundColor: "#4b0082",
//                     color: "white",
//                     ":hover": { backgroundColor: "#6a0dad" },
//                     mr: 2,
//                   }}
//                   onClick={handleProceed}
//                 >
//                   Proceed
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Typography variant="body1" sx={{ mb: 2 }}>
//                   You need at least 75% to pass. Please retake the quiz, review the video, or go back to login.
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   sx={{
//                     backgroundColor: "#4b0082",
//                     color: "white",
//                     ":hover": { backgroundColor: "#6a0dad" },
//                     mr: 2,
//                   }}
//                   onClick={handleRetakeQuiz}
//                 >
//                   Retake Quiz
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   sx={{
//                     borderColor: "#4b0082",
//                     color: "#4b0082",
//                     ":hover": { borderColor: "#6a0dad", color: "#6a0dad" },
//                     mr: 2,
//                   }}
//                   onClick={handleGoBackToVideo}
//                 >
//                   Back to Video
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   sx={{
//                     borderColor: "#4b0082",
//                     color: "#4b0082",
//                     ":hover": { borderColor: "#6a0dad", color: "#6a0dad" },
//                   }}
//                   onClick={handleGoBackToLogin}
//                 >
//                   Back to Login
//                 </Button>
//               </>
//             )}
//           </Paper>
//         )}
//       </Container>
//     </Box>
//   );
// };

// export default Kioskquiz;

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
import { QRCodeCanvas } from "qrcode.react"; // Import QRCodeCanvas for QR code generation

// Sample quiz questions related to visitor safety protocols
const quizQuestions = [
  {
    question: "What should you do if you notice a fire hazard during your visit?",
    options: [
      "Ignore it and continue your visit",
      "Report it to the nearest staff member immediately",
      "Take a photo and post it on social media",
      "Try to fix it yourself",
    ],
    correctAnswer: "Report it to the nearest staff member immediately",
  },
  {
    question: "Where should you wear your visitor badge at all times?",
    options: [
      "In your pocket",
      "On your vehicle dashboard",
      "Visible on your person",
      "At home",
    ],
    correctAnswer: "Visible on your person",
  },
  {
    question: "What is the first thing you should do upon arriving at the facility?",
    options: [
      "Start your meeting immediately",
      "Check in at the reception or kiosk",
      "Wander around to explore the facility",
      "Take a coffee break",
    ],
    correctAnswer: "Check in at the reception or kiosk",
  },
  {
    question: "What should you do if you get lost in the facility?",
    options: [
      "Keep walking until you find your way",
      "Ask a staff member for directions",
      "Leave the facility immediately",
      "Call a friend for help",
    ],
    correctAnswer: "Ask a staff member for directions",
  },
];

const Kioskquiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const visitorId = location.state?.userId; // Get the visitor ID from the previous page
  const qrCodeRef = useRef(null); // Ref to access the QR code canvas

  // State to store user answers and quiz results
  const [answers, setAnswers] = useState(Array(quizQuestions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [generatedId, setGeneratedId] = useState("");
  const [visitor, setVisitor] = useState(null); // State to store visitor data
  const [loadingVisitor, setLoadingVisitor] = useState(false); // State for loading visitor data
  const [visitorError, setVisitorError] = useState(null); // State for visitor fetch errors

  // Fetch visitor data when the user passes the quiz
  useEffect(() => {
    if (submitted && score > 75 && visitorId) {
      const fetchVisitorData = async () => {
        try {
          setLoadingVisitor(true);
          let url = "http://localhost:5000/api/visitors/latest";
          if (visitorId) {
            url = `http://localhost:5000/api/visitors/${visitorId}`;
          }
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Failed to fetch visitor data");
          }
          const data = await response.json();
          const visitorData = data.data || data;
          setVisitor(visitorData);
        } catch (err) {
          setVisitorError(err.message);
          console.error("Error fetching visitor details:", err);
          toast.error("Failed to fetch visitor data for printing.");
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

  // Generate a simple random ID (e.g., 6-character alphanumeric string)
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
    // Calculate the score
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correctAnswer) {
        correctAnswers += 1;
      }
    });

    const scorePercentage = (correctAnswers / quizQuestions.length) * 100;
    setScore(scorePercentage);
    setSubmitted(true);

    // Check if the user passed (75% or higher)
    if (scorePercentage > 75) {
      const newId = generateRandomId();
      setGeneratedId(newId);
      toast.success(`Congratulations! You passed the quiz with a score of ${scorePercentage.toFixed(2)}%. Your ID: ${newId}`);
    } else {
      toast.error(`You scored ${scorePercentage.toFixed(2)}%. You need at least 75% to pass. Please retake the quiz or review the video.`);
    }
  };

  // Handle retake quiz
  const handleRetakeQuiz = () => {
    setAnswers(Array(quizQuestions.length).fill(""));
    setSubmitted(false);
    setScore(0);
    setGeneratedId("");
    setVisitor(null); // Reset visitor data
    setVisitorError(null); // Reset error
  };

  // Handle going back to login if failed
  const handleGoBackToLogin = () => {
    navigate("/LoginKiosk");
  };

  // Handle going back to the video page if failed
  const handleGoBackToVideo = () => {
    navigate("/VideoPage", { state: { userId: visitorId } });
  };

  // Print the visitor card
  const printVisitorCard = () => {
    if (!visitor) {
      toast.error("Visitor data not available for printing.");
      return;
    }

    // Get the QR code data URL from the hidden QRCodeCanvas
    const qrCanvas = qrCodeRef.current?.querySelector("canvas");
    if (!qrCanvas) {
      toast.error("Failed to generate QR code for printing.");
      return;
    }
    const qrDataUrl = qrCanvas.toDataURL("image/png");

    // Preload the visitor's photo (or use a default if not available)
    const preloadImage = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url || "/default-avatar.png";
        img.onload = () => resolve(img.src);
        img.onerror = () => resolve("/default-avatar.png");
      });
    };

    preloadImage(visitor.photoUrl).then((photoUrl) => {
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
        <h3>${visitor.fullName}</h3>
        <p><strong>ID:</strong> ${visitor._id}</p>
        <p><strong>Check-In Time:</strong> ${new Date(visitor.checkInTime).toLocaleString()}</p>
        <p><strong>Purpose:</strong> ${visitor.reasonForVisit}</p>
        <p><strong>Designation:</strong> ${visitor.designation}</p>
        <p><strong>Company:</strong> ${visitor.visitorCompany}</p>
        <p><strong>Department:</strong> ${visitor.department}</p>
        <p><strong>Host:</strong> ${visitor.personToVisit}</p>
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
    // Trigger print dialog after the window loads
    window.onload = () => {
      window.focus(); // Ensure the window is focused
      window.print(); // Open the print dialog
    };

    // Close the window after printing or canceling the print dialog
    window.addEventListener('afterprint', () => {
      window.close();
    });

    // Fallback: If the user closes the tab without printing, close after a timeout
    setTimeout(() => {
      window.close();
    }, 10000); // Close after 10 seconds if no action is taken
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

  // If visitorId is not available, redirect to login
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

        {/* Hidden QRCodeCanvas to generate the QR code for printing */}
        {visitor && (
          <Box sx={{ display: "none" }} ref={qrCodeRef}>
            <QRCodeCanvas value={visitor._id} size={80} />
          </Box>
        )}

        {!submitted ? (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            {quizQuestions.map((question, index) => (
              <Box key={index} sx={{ mb: 4 }}>
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
                {visitorError ? (
                  <Typography variant="body1" sx={{ mb: 2, color: "red" }}>
                    {visitorError}
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#4b0082",
                      color: "white",
                      ":hover": { backgroundColor: "#6a0dad" },
                      mr: 2,
                    }}
                    onClick={printVisitorCard}
                    disabled={loadingVisitor || !visitor}
                  >
                    {loadingVisitor ? "Loading..." : "Print ID"}
                  </Button>
                )}
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