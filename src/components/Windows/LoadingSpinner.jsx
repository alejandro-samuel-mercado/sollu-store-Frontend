import "./LoadingSpinner.css";
import { useState, useEffect } from "react";

const phrases = [
  "Creando momentos épicos...",
  "Preparando algo increíble...",
  "¡La magia está en camino!",
  "Cargando tu próxima aventura...",
  "¡Un momento, estamos brillando!",
];

export const LoadingSpinner = () => {
  const [randomPhrase, setRandomPhrase] = useState("");

  useEffect(() => {
    setRandomPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
  }, []);

  return (
    <div className="loading-overlay">
      <div className="spinner-container">
        <div className="logo-spinner">
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="logo"
          >
            <path
              d="M50 10 L90 90 H10 Z"
              stroke="url(#grad)"
              strokeWidth="6"
              fill="none"
              className="triangle"
            />
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="url(#grad)"
              className="inner-circle"
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                  offset="0%"
                  style={{ stopColor: "#007bff", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#00d4ff", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p>{randomPhrase}</p>
      </div>
    </div>
  );
};
