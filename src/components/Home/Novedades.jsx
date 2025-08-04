import { useEffect, useState, useMemo, useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useDatosPublic } from "../../context/DatosPublicContext";
import { useLocation, useNavigate } from "react-router-dom";


export const Novedades = () => {
  const { productos } = useDatosPublic();
  const productosTendencia = useMemo(
    () => productos?.filter((producto) => producto.tendencia) || [],
    [productos]
  );
  const location = useLocation();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const breakpoints = {
    0: { slidesPerView: 1, spaceBetween: 10 },
    700: { slidesPerView: 2, spaceBetween: 10 },
    1000: { slidesPerView: 3, spaceBetween: 10 },
    1200: { slidesPerView: 4, spaceBetween: 10 },
  };

  const getSlidesPerView = () => {
    const width = window.innerWidth;
    if (width <= 700) return 1;
    if (width <= 1000) return 2;
    if (width <= 1200) return 3;
    return 4;
  };

  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());

  useEffect(() => {
    const handleResize = () => setSlidesPerView(getSlidesPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (!productos) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="novedades" ref={sectionRef}>
      <h2>TENDENCIAS</h2>
      <div className="tender-div">
        <div className="tender"></div>
        <div className="carousel-container">
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={10}
            breakpoints={breakpoints}
          >
            {productosTendencia.slice(0, 10).map((producto, index) => (
              <SwiperSlide key={producto.id}>
                <div className="percha-div">
                  <img
                    src="/static/percha.png"
                    alt="Percha"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/static/fallback-percha.png";
                    }}
                  />
                </div>
                <div
                  className={`card ${isVisible ? "animate" : ""}`}
                  style={{ "--swiper-slide-index": index }}
                >
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/static/fallback-product.png";
                    }}
                  />
                  <h3 className="font-semibold">{`${producto?.nombre} ${producto?.marca || ""} - ${producto?.modelo_talle || ""}`.trim()}</h3>
                  {producto.descripcion && <p>{producto.descripcion}</p>}
                  <button
                    onClick={() =>
                      navigate(`/productos-listado/producto/${producto.id}`)
                    }
                  >
                    {producto.descuento > 0 && <p>{producto.descuento}% OFF</p>}
                    <h3>$ {producto.precio_final}</h3>
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};