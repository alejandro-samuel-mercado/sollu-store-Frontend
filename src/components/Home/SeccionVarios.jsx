import { useDatosPublic } from "../../context/DatosPublicContext";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { PiCoinsFill } from "react-icons/pi";
import { useDatosPublicComponentes } from "../../features/ControlComponents/ControladorComponentesContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";


export const SeccionVarios = () => {
  const { productos, contenidosWeb, categorias, descuentos } = useDatosPublic();
  const { componentes } = useDatosPublicComponentes();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Ordenar productos por cantidad vendida total
  const productosMasVendidos = productos?.sort((a, b) => {
    return b.cantidad_vendida_total - a.cantidad_vendida_total;
  });

  // Filtrar categorías con descuentos
  const categoriasEnDescuento = categorias?.filter((categoria) =>
    descuentos.some((descuento) => descuento.categoria === categoria.id)
  );

  // Seleccionar los 10 productos más vendidos
  const ultimosProductosMasVenidos = productosMasVendidos?.slice(0, 10);

  // Productos en descuento
  const enDescuentos = productos?.filter((producto) =>
    categoriasEnDescuento.some((cat) => cat.nombre === producto.categoria)
  );
  console.log(productos)
  console.log(enDescuentos)
  // Productos canjeables o aleatorios
  const canjes_random =
    componentes && componentes.componente_canjes === true
      ? productos?.filter((prod) => prod.valor_en_puntos > 0).slice(0, 10) || []
      : productos?.sort(() => Math.random() - 0.5).slice(0, 10) || [];

  const contenido = contenidosWeb?.find((componente) => componente.nombre === "Anuncio 2");

  // Intersection Observer para animaciones
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
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

  if (!productos || !categorias || !descuentos) {
    return <div>Cargando...</div>;
  }

  return (
    <section className="section-various" ref={sectionRef}>
      <div className="varios-left">
        <button className="top">
          <h3>MÁS VENDIDOS</h3>
        </button>
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={1}
          spaceBetween={0}
          centeredSlides={true}
        >
          {ultimosProductosMasVenidos?.map((producto, index) => (
            <SwiperSlide key={producto.id}>
              <div
                className={`card ${isVisible ? "animate" : ""}`}
                style={{ "--swiper-slide-index": index }}
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  onError={(e) => {
                    e.target.src = "/static/fallback-product.png";
                  }}
                />
                <h3 className="font-semibold">{`${producto?.nombre} ${producto?.marca || ""} - ${producto?.modelo_talle || ""}`.trim()}</h3>
                {producto.descripcion && <p>{producto.descripcion}</p>}
                <button
                  className="botom"
                  onClick={() => navigate(`/productos-listado/producto/${producto.id}`)}
                >
                  <h3>$ {producto.precio_final}</h3>
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="varios-center">
        <div className="card-center">
          <button className="top">
            <h3>EN DESCUENTO</h3>
          </button>
          <Swiper
            modules={[Navigation]}
            navigation
            slidesPerView={1}
            spaceBetween={0}
            centeredSlides={true}
          >
            {enDescuentos?.map((producto, index) => (
              <SwiperSlide key={producto.id}>
                <div
                  className={`card ${isVisible ? "animate" : ""}`}
                  style={{ "--swiper-slide-index": index }}
                >
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    onError={(e) => {
                      e.target.src = "/static/fallback-product.png";
                    }}
                  />
                  <h3 className="font-semibold">{producto.nombre}</h3>
                  <button
                    className="botom"
                    onClick={() => navigate(`/productos-listado/producto/${producto.id}`)}
                  >
                    {producto.descuento > 0 && <p>{producto.descuento}%</p>}
                    <h3 style={{ marginTop: producto.descuento < 5 && "-2vh" }}>
                      $ {producto.precio_final}
                    </h3>
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="card-center">
          <button className="top">
            <h3>{componentes?.componente_canjes ? "CANJEABLES" : "ALEATORIO"}</h3>
          </button>
          <Swiper
            modules={[Navigation]}
            navigation
            slidesPerView={1}
            spaceBetween={0}
            centeredSlides={true}
          >
            {canjes_random?.map((producto, index) => (
              <SwiperSlide key={producto.id}>
                <div
                  className={`card ${isVisible ? "animate" : ""}`}
                  style={{ "--swiper-slide-index": index }}
                >
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    onError={(e) => {
                      e.target.src = "/static/fallback-product.png";
                    }}
                  />
                  <h3 className="font-semibold">{producto.nombre}</h3>
                  <button
                    className="botom"
                    onClick={() => navigate(`/productos-listado/producto/${producto.id}`)}
                  >
                    {componentes?.componente_canjes ? (
                      <h3>
                        <PiCoinsFill />
                        {producto.valor_en_puntos ? Math.round(producto.valor_en_puntos, 2) : "N/A"}
                      </h3>
                    ) : (
                      <h3>$ {producto.precio_final}</h3>
                    )}
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="varios-right">
        <div className="text-container">
          <span className="glowing-text">{contenido?.contenido}</span>
        </div>
      </div>
    </section>
  );
};