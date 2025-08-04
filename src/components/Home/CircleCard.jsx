import { useDatosPublic } from "../../context/DatosPublicContext";
import { useState, useEffect, useRef } from "react";
import "./CircleCard.css"

const CircleCard = () => {
  const { contenidosWeb } = useDatosPublic();
  const [contenido1, setContenido1] = useState();
  const [contenido2, setContenido2] = useState();
  const [contenido3, setContenido3] = useState();
  const sectionRef = useRef(null); // Referencia a la sección
  const [isVisible, setIsVisible] = useState(false); // Estado de visibilidad

  useEffect(() => {
    if (!contenidosWeb) return;
    setContenido1(
      contenidosWeb?.find((componente) => componente["nombre"] === "Circulo 1")
    );
    setContenido2(
      contenidosWeb?.find((componente) => componente["nombre"] === "Circulo 2")
    );
    setContenido3(
      contenidosWeb?.find((componente) => componente["nombre"] === "Circulo 3")
    );
  }, [contenidosWeb]);

  // Intersection Observer para detectar cuando la sección está en el viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting); // Actualiza visibilidad
      },
      {
        threshold: 0.2, // Se activa cuando el 20% de la sección es visible
        rootMargin: "0px", // Sin margen adicional
      }
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

  return (
    <>
      {contenidosWeb && (
        <div className="circle-card-container" ref={sectionRef}>
          <div className="div-card-circle">
            <div
              className={`circle-card ${isVisible ? "animate" : ""}`}
              style={{ backgroundColor: "var(--primario2)", "--index": 0 }} // Retraso escalonado
            >
              <img src={contenido1?.imagen} />
            </div>
            <h3>{contenido1?.contenido || ""}</h3>
          </div>
          <div className="div-card-circle">
            <div
              className={`circle-card ${isVisible ? "animate" : ""}`}
              style={{ backgroundColor: "var(--secundario2)", "--index": 1 }} // Retraso escalonado
            >
              <img src={contenido2?.imagen} />
            </div>
            <h3>{contenido2?.contenido || ""}</h3>
          </div>
          <div className="div-card-circle">
            <div
              className={`circle-card ${isVisible ? "animate" : ""}`}
              style={{ backgroundColor: "var(--terciario)", "--index": 2 }} // Retraso escalonado
            >
              <img src={contenido3?.imagen} />
            </div>
            <h3>{contenido3?.contenido || ""}</h3>
          </div>
        </div>
      )}
    </>
  );
};

export default CircleCard;