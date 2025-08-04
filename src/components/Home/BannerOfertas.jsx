import { useDatosPublic } from "../../context/DatosPublicContext";

export const BannerOfertas = () => {

  const { contenidosWeb } = useDatosPublic();
  const contenido = contenidosWeb?.find(
    (componente) => componente["nombre"].toLowerCase() === "anuncio 1"
  );

  return (
    <div className="banner-container">
      <div className="text-container">
        <span className="glowing-text">{contenido?.contenido}</span>
        <span className="glowing-text">{contenido?.contenido}</span>
      </div>
    </div>
  );
};
