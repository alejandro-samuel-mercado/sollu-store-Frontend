import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import Modal from "react-modal";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { LoadingSpinner } from "./LoadingSpinner";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "90%",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    border: "none",
    borderRadius: "10px",
    padding: "10px", // Add padding for smaller screens
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: "1000",
  },
};

Modal.setAppElement("#root");

export const CameraModal = ({ productImage, onClose }) => {
  const webcamRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const lastUpdateRef = useRef(0);

  const [imageSize, setImageSize] = useState(100);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [allowMovement, setAllowMovement] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      setShowLoading(true);
      const timeout = setTimeout(() => {
        setShowLoading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [canvasRef.current]);

  useEffect(() => {
    const video = webcamRef.current?.video;
    if (!video) return;

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          processHandMovement(landmarks);
        }
      }
    });

    const mpCamera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 640,
      height: 480,
    });
    mpCamera.start();

    return () => {
      mpCamera.stop();
    };
  }, [webcamRef.current?.video]);

  const processHandMovement = (landmarks) => {
    const now = performance.now();
    if (now - lastUpdateRef.current < 100) return;
    lastUpdateRef.current = now;

    if (landmarks && landmarks.length > 0) {
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const middleTip = landmarks[12];
      const ringTip = landmarks[16];
      const pinkyTip = landmarks[20];

      const distanceThumbIndex = Math.hypot(
        thumbTip.x - indexTip.x,
        thumbTip.y - indexTip.y
      );
      const distanceMiddleRing = Math.hypot(
        middleTip.x - ringTip.x,
        middleTip.y - ringTip.y
      );
      const distanceRingPinky = Math.hypot(
        ringTip.x - pinkyTip.x,
        ringTip.y - pinkyTip.y
      );

      const openPalm =
        distanceThumbIndex > 0.07 &&
        distanceMiddleRing > 0.07 &&
        distanceRingPinky > 0.07;
      setAllowMovement(openPalm);

      if (openPalm) {
        setImageSize(distanceThumbIndex * 400);
        setImagePosition({ x: thumbTip.x * 100, y: thumbTip.y * 100 });
      }
    }
  };

  const handleMouseDown = (e) => {
    if (!allowMovement) return;
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleDrag = (e) => {
    if (!isDragging || !allowMovement) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setImagePosition({ x, y });
  };

  return (
    <Modal isOpen={true} onRequestClose={onClose} style={customStyles}>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "90%",
          overflow: "hidden",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
          }}
        />
        <img
          src={productImage}
          alt="Product"
          style={{
            position: "absolute",
            top: `${imagePosition.y}%`,
            left: `${imagePosition.x}%`,
            transform: `translate(-50%, -50%) scale(${imageSize / 100})`,
            maxWidth: "50vw",
            maxHeight: "50vh",
            zIndex: 20,
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
        />
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1vh",
            right: "1vw",
            zIndex: 30,
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            fontSize: "2rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          X
        </button>
      </div>
      {!canvasRef.current && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "10px",
            padding: "2vh",
            top: "5vh",
            width: "80%",
            textAlign: "center",
            zIndex: 40,
          }}
        >
          <p>Haga click sobre la imagen y utilice gestos para modificarla:</p>
          <p>- Mueva la mano para desplazarla.</p>
          <p>- Pellizque con los dedos para hacer zoom.</p>
          <p>- Cierre la palma para fijar la imagen.</p>
        </div>
      )}
      {showLoading && <LoadingSpinner />}
    </Modal>
  );
};