import React, { useState, useEffect, useRef } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VideoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userId } = location.state || {};

  useEffect(() => {
    const fetchLatestQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/quizzes");
        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        const data = await response.json();
        if (data.length > 0) {
          setVideoUrl(data[0].videoUrl);
        } else {
          throw new Error("No quizzes available");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setVideoError("Failed to load the video. Please try again later.");
        toast.error("Failed to load video content.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestQuiz();
  }, []);

  const handleVideoEnd = () => {
    console.log("Video ended");
    setVideoEnded(true);
    setVideoPlaying(false);
  };

  const handleVideoError = (e) => {
    console.error("Video playback error:", e);
    setVideoError("Failed to play the video. Please ensure the video is accessible.");
    setVideoPlaying(false);
  };

  const handleVideoLoaded = () => {
    console.log("Video loaded successfully");
    setVideoError(null);
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          console.log("Video started playing");
          setVideoPlaying(true);
          setVideoError(null);
        })
        .catch((error) => {
          console.error("Error playing video:", error);
          setVideoError("Error playing the video. Please try again.");
          setVideoPlaying(false);
        });
    }
  };

  const handleReplay = () => {
    setVideoEnded(false);
    setVideoPlaying(true);
    setVideoError(null);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((error) => {
        console.error("Error replaying video:", error);
        setVideoError("Error replaying the video. Please try again.");
        setVideoPlaying(false);
      });
    }
  };

  const handleGoToQuiz = () => {
    navigate("/kioskquiz", { state: { userId } });
  };

  if (!userId) {
    toast.error("User ID not found. Please log in again.");
    setTimeout(() => {
      navigate("/");
    }, 2000);
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
        backgroundColor: "#f5f5f5",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 3, color: "#4b0082" }}
      >
        Welcome to the Kiosk Training Video
      </Typography>

      {loading ? (
        <Typography>Loading video...</Typography>
      ) : videoUrl ? (
        <>
          <Box
            sx={{
              width: "100%",
              maxWidth: "800px",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              mb: 3,
            }}
          >
            <video
              ref={videoRef}
              muted
              controls
              onEnded={handleVideoEnd}
              onError={handleVideoError}
              onLoadedData={handleVideoLoaded}
              onPlay={() => {
                console.log("Video is playing");
                setVideoPlaying(true);
              }}
              style={{ width: "100%", display: "block" }}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>

          {videoError && (
            <Typography
              variant="body1"
              sx={{ color: "red", mb: 2, textAlign: "center" }}
            >
              {videoError}
            </Typography>
          )}

          {!videoPlaying && !videoEnded && (
            <Button
              variant="contained"
              onClick={handlePlayVideo}
              sx={{
                backgroundColor: "#4b0082",
                color: "white",
                ":hover": { backgroundColor: "#6a0dad" },
                px: 4,
                py: 1,
                mb: 2,
              }}
            >
              Play Video
            </Button>
          )}

          {videoEnded && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                onClick={handleReplay}
                sx={{
                  backgroundColor: "#4b0082",
                  color: "white",
                  ":hover": { backgroundColor: "#6a0dad" },
                  px: 4,
                  py: 1,
                }}
              >
                Replay Video
              </Button>
              <Button
                variant="contained"
                onClick={handleGoToQuiz}
                sx={{
                  backgroundColor: "#4b0082",
                  color: "white",
                  ":hover": { backgroundColor: "#6a0dad" },
                  px: 4,
                  py: 1,
                }}
              >
                Go to Quiz
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Typography color="error">
          No video available. Please contact the administrator.
        </Typography>
      )}
    </Box>
  );
};

export default VideoPage;