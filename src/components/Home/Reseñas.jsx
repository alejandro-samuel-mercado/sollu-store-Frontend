import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useAuthContext } from "../../features/Auth/AuthContext.jsx";
import API from "../../Api/index.js"
import ReviewForm from "./ReviewForm.jsx";


const ReviewCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const { user } = useAuthContext();
  const sectionRef = useRef(null); // Referencia para la sección

  useEffect(() => {
    fetchReviews();

    // Configuración del Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("slide-in-active");
          }
        });
      },
      {
        threshold: 0.2, // Se activa cuando el 10% de la sección es visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Cleanup
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await API.get(`reviews/`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const avataresLista = [
    "pixel-art-neutral",
    "thumbs",
    "initials",
    "identicon",
    "fun-emoji",
    "bottts-neutral",
    "bottts",
    "big-ears-neutral",
    "avataaars-neutral",
    "adventurer-neutral",
    "adventurer",
  ];

  const obtenerAvatarRandom = (indice) => {
    return avataresLista[indice];
  };

  return (
    <div className="review-section-home" ref={sectionRef}>
      <h2>NUESTROS CLIENTES</h2>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={60}
        slidesPerView={2}
        slidesPerGroup={2}
        autoplay={{
          delay: 4000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        loop={true}
        breakpoints={{
          0: { slidesPerView: 1, slidesPerGroup: 1 },
          768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 5 },
          1024: { slidesPerView: 2, slidesPerGroup: 2 },
        }}
      >
        {reviews.map(
          (review) =>
            review.approved === true && (
              <SwiperSlide key={review.id}>
                <div className="review-card">
                  <img
                    src={`https://api.dicebear.com/9.x/${obtenerAvatarRandom(
                      Math.floor(Math.random() * avataresLista.length)
                    )}/svg`}
                  />
                  <h3>{review.user}</h3>
                  <div className="rating-date">
                    <div className="rating">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    <p className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <p>{review.comment}</p>
                </div>
              </SwiperSlide>
            )
        )}
      </Swiper>
      <hr
        style={{ border: "2px solid black", width: "100%", margin: "4vh 0" }}
      />
      <ReviewForm user={user} fetchReviews={fetchReviews} />
    </div>
  );
};

export default ReviewCarousel;