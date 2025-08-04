// Hero.jsx
import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { useDatosPublic } from "../../context/DatosPublicContext";
import { useAppDataContext } from "../../features/AppData/AppDataContext";


export const Hero = () => {
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const banRef = useRef(null);
  const { contenidosWeb } = useDatosPublic();
  const { diseñoActivo } = useAppDataContext()
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const imagenBannerBackend = contenidosWeb?.find(
    (contenido) => contenido.nombre === "Imagen_banner"
  );
  const imagen = imagenBannerBackend?.imagen || "static/hero.png";


  useLayoutEffect(() => {
    if (isImageLoaded) {
      if (diseñoActivo?.nombre === "Diseño 1") {
        gsap.fromTo(
          [img1Ref.current, img2Ref.current, banRef.current],
          { rotation: -2 },
          {
            rotation: 2,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          }
        )
      } else {
        gsap.fromTo(
          [img1Ref.current, img2Ref.current, banRef.current],
          { rotation: -0.5 },
          {
            rotation: 0.5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          }
        );
      }
    }
  }, [isImageLoaded]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <div className="hero-container">
      <div className="hero-sosten">
        <img ref={img1Ref} src="static/palo.jpg" alt="Sosten" />
        <img ref={img2Ref} src="static/palo.jpg" alt="Sosten" />
      </div>
      <div className="hero-div">
        {!isImageLoaded && (
          <div
            className="hero-placeholder"
            style={{
              backgroundColor: "var(--fondo1)",
              height: "200px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50px",
              color: "var(--colorFuente1)",
            }}
          >
            <p>Cargando imagen...</p>
          </div>
        )}
        <img
          ref={banRef}
          className="video-hero"
          src={imagen}
          onLoad={handleImageLoad}
          onError={() => {
            console.error("Error al cargar la imagen del Hero:", imagen);
            setIsImageLoaded(true); // Mostramos el placeholder si hay un error
          }}
          style={{ display: isImageLoaded ? "block" : "none" }}
          alt="Hero Banner"
        />
      </div>
    </div>
  );
};