import React, { useEffect, useRef, useState } from "react";
const CarroPlatform = ({ rotacion = -5, invert = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [distance, setDistance] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      setDistance(containerWidth + 50);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5, rootMargin: "160px 0px 100px 0px" }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div
      className="carro-platform"
      ref={containerRef}
      style={{ direction: invert ? "rtl" : "ltr" }}
    >
      <img
        src="static/carroA.png"
        className={`carro ${isVisible ? "visible" : ""}`}
        alt="Carrito"
        style={{
          position: "absolute",
          right: invert ? "0" : "auto",
          left: invert ? "auto" : "0",
          transform: isVisible
            ? `rotate(${invert ? -rotacion : rotacion}deg) 
               translate3d(${invert ? `-${distance + 200}px` : `${distance}px`
            }, 0, 0) 
               scaleX(${invert ? "-1" : "1"})`
            : `rotate(${invert ? -rotacion : rotacion
            }deg) translate3d(0, 0, 0) scaleX(${invert ? "-1" : "1"})`,
          transition: "transform 5s linear",
          transformOrigin: invert ? "bottom right" : "bottom left",
          willChange: "transform",
        }}
      />
      <div
        className="platform"
        style={{
          transform: `rotate(${invert ? -rotacion : rotacion}deg)`,
          transformOrigin: " bottom center",
          marginLeft: invert ? "0" : "-2vh",
          marginRight: invert ? "-2vh" : "0vh",
        }}
      ></div>
    </div>
  );
};

export default CarroPlatform;
