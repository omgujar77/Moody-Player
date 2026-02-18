import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./FacialExpession.css";
import axios from "axios";
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function FacialExpression({ setSongs }) {
  const videoRef = useRef(null);

  // Load face-api models
  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  // Start webcam
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "user",
          width: isMobile ? 320 : 640,
          height: isMobile ? 240 : 480,
        },
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  };

  // Detect mood and fetch songs
  const detectMood = async () => {
    if (!videoRef.current) return;

    const detections = await faceapi
      .detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: isMobile ? 224 : 512,
          scoreThreshold: 0.5,
        }),
      )
      .withFaceExpressions();

    if (!detections || detections.length === 0) {
      console.log("No faces detected");
      return;
    }

    let mostProbableExpression = 0;
    let expression = "";

    for (const exp of Object.keys(detections[0].expressions)) {
      if (detections[0].expressions[exp] > mostProbableExpression) {
        mostProbableExpression = detections[0].expressions[exp];
        expression = exp;
      }
    }

    console.log("Detected mood:", expression);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/songs?mood=${expression}`,
      );
      console.log("Songs received:", response.data);
      setSongs(response.data.songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);

  return (
    <div className="mood-element">
      <header className="app-header">
        <h1>🎵 Moody Player</h1>
        <p>Capture your mood, discover your music</p>
      </header>
      <main className="app-main">
        <video ref={videoRef} autoPlay muted className="user-video-feed" />
        <button className="capture-button" onClick={detectMood}>
          Detect Mood
        </button>
      </main>
    </div>
  );
}
