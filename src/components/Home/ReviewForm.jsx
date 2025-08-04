import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../Api/index.js"
import { FailedNotification } from "../Windows/FailedNotification.jsx";
import { SuccessNotification } from "../Windows/SuccessNotification.jsx";

const ReviewForm = ({ user, fetchReviews }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [failedSuccess, setFailedSuccess] = useState(false);
  const approved = false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setFailedSuccess(true);
      return;
    }

    try {
      await API.post(`reviews/`, {
        comment,
        rating,
        approved,
      });
      setShowSuccess(true);
      setComment("");
      setRating(0);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <>
      {failedSuccess && (
        <FailedNotification
          message="Debes iniciar sesión para escribir una reseña."
          onClose={() => setFailedSuccess(false)}
        />
      )}
      {showSuccess && (
        <SuccessNotification
          message="Su publicación será revisada."
          onClose={() => setShowSuccess(false)}
        />
      )}
      {!user ? (
        <p>
          <Link to="/login">Inicia sesión</Link> para dejar un comentario.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}>
          <div className="review-form">
            <div className="coment-input">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe tu reseña..."
                required
              />
            </div>
            <div className="rating-input">
              <div className="span-div">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    style={{ cursor: "pointer" }}
                  >
                    {star <= rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button type="submit">Enviar Reseña</button>
        </form>
      )}
    </>
  );
};

export default ReviewForm;
