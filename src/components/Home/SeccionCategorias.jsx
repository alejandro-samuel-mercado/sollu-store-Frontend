import { useState, useEffect, useRef } from "react";
import { useDatosPublic } from "../../context/DatosPublicContext";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Player } from "@lottiefiles/react-lottie-player";
import { useNavigate } from "react-router-dom";


const SeccionCategorias = () => {

  const { productos, categorias } = useDatosPublic();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const circlesContainerRef = useRef(null);

  const algunasCategorias = [...categorias].slice(0, 4);

  const getProductsByCategory = (categoriaId) => {
    return productos.filter((producto) => producto.categoria === categoriaId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        circlesContainerRef.current &&
        !circlesContainerRef.current.contains(event.target)
      ) {
        setSelectedCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (categoria) => {
    setSelectedCategory(categoria);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (
        popupRef.current &&
        !popupRef.current.matches(":hover") &&
        circlesContainerRef.current &&
        !circlesContainerRef.current.matches(":hover")
      ) {
        setSelectedCategory(null);
      }
    }, 2000);
  };

  return (
    <section className="category-circles-section">
      <h2 className="text-center mb-4">CATEGORIAS</h2>
      <div className="category-container d-flex align-items-center justify-content-center gap-5">
        <div
          className="circles-container position-relative"
          ref={circlesContainerRef}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="circle central-circle rotating text-white"
            onMouseEnter={() => handleMouseEnter(null)}
            onClick={() => navigate("/categorias")}
          >
            Ver todas
          </div>
          {algunasCategorias.map((categoria, index) => (
            <div
              key={categoria.nombre}
              className={`circle surrounding-circle circle-${index} rotating text-white`}
              onMouseEnter={() => handleMouseEnter(categoria)}
            > <p>
                {categoria.nombre.toUpperCase()}</p>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <div
            className="carousel-popup position-absolute"
            ref={popupRef}
            onMouseLeave={handleMouseLeave}
          >
            <h3 className="text-center mb-3">{selectedCategory.nombre}</h3>
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              slidesPerView={1}
              spaceBetween={0}
              centeredSlides={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              className="swiper-custom"
            >
              {getProductsByCategory(selectedCategory.nombre).map((producto) => (
                <SwiperSlide key={producto.id}>
                  <div className="card shadow-sm product-card ">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="card-img-top"
                    />
                    <div className="card-body text-center">
                      <h4 className="card-title">{producto.nombre}</h4>
                      <div className="price d-flex justify-content-center align-items-center mb-2">
                        <h3 className="text-success">
                          ${producto.precio_final}
                        </h3>
                        {producto.descuento > 0 && (
                          <p className="text-danger ms-2">
                            -{producto.descuento}%
                          </p>
                        )}
                      </div>
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => navigate(`/productos-listado/producto/${producto.id}`)}
                      >
                        Ver más...
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className="player-wrapper d-flex justify-content-center align-items-center">
          <Player
            src="https://lottie.host/a2af3c08-82c0-4712-aa80-2b05dfd0323e/0YtEfNeR06.json"
            loop
            autoplay
            className="player-animation"
          />
        </div>
      </div>
    </section>
  );
};

export default SeccionCategorias;
