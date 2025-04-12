import React, { useState, useRef } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const VideoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(null);

  // Get the userId from the login page
  const { userId } = location.state || {};

  // Handle video end event
  const handleVideoEnd = () => {
    console.log("Video ended");
    setVideoEnded(true);
    setVideoPlaying(false);
  };

  // Handle video error
  const handleVideoError = (e) => {
    console.error("Video playback error:", e);
    setVideoError("Failed to load the video. Please ensure the video file is correctly placed in the public/assets folder.");
    setVideoPlaying(false);
  };

  // Handle video load
  const handleVideoLoaded = () => {
    console.log("Video loaded successfully");
    setVideoError(null);
  };

  // Play the video manually
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

  // Replay the video
  const handleReplay = () => {
    setVideoEnded(false);
    setVideoPlaying(true);
    setVideoError(null);
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Reset video to start
      videoRef.current.play().catch((error) => {
        console.error("Error replaying video:", error);
        setVideoError("Error replaying the video. Please try again.");
        setVideoPlaying(false);
      });
    }
  };

  // Navigate to the Quizkiosk page
  const handleGoToQuiz = () => {
    navigate("/kioskquiz", { state: { userId } });
  };

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
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 3, color: "#4b0082" }} // Purple color from the theme
      >
        Welcome to the Kiosk Training Video
      </Typography>

      {/* Video Player */}
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
          muted // Add muted to allow playback in most browsers
          controls // Add controls for user interaction
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          onLoadedData={handleVideoLoaded}
          onPlay={() => {
            console.log("Video is playing");
            setVideoPlaying(true);
          }}
          style={{ width: "100%", display: "block" }}
        >
          {/* Reference the local video file in the public/assets folder */}
          <source src="/assets/vid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>

      {/* Display error message if video fails to load */}
      {videoError && (
        <Typography
          variant="body1"
          sx={{ color: "red", mb: 2, textAlign: "center" }}
        >
          {videoError}
        </Typography>
      )}

      {/* Play Video Button (shown initially and if video isn't playing) */}
      {!videoPlaying && !videoEnded && (
        <Button
          variant="contained"
          onClick={handlePlayVideo}
          sx={{
            backgroundColor: "#4b0082", // Purple color
            color: "white",
            ":hover": { backgroundColor: "#6a0dad" }, // Lighter purple on hover
            px: 4,
            py: 1,
            mb: 2,
          }}
        >
          Play Video
        </Button>
      )}

      {/* Buttons (shown only after the video ends) */}
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
              backgroundColor: "#4b0082", // Purple color
              color: "white",
              ":hover": { backgroundColor: "#6a0dad" }, // Lighter purple on hover
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
              backgroundColor: "#4b0082", // Purple color
              color: "white",
              ":hover": { backgroundColor: "#6a0dad" }, // Lighter purple on hover
              px: 4,
              py: 1,
            }}
          >
            Go to Quiz
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VideoPage;