import { BannerOfertas } from "../components/Home/BannerOfertas";
import { Novedades } from "../components/Home/Novedades";
import { SeccionVarios } from "../components/Home/SeccionVarios";
import ReviewCarousel from "../components/Home/Reseñas";
import { Hero } from "../components/Home/Hero";
import CarroPlatform from "../components/Home/CarritoAnimated";
import CircleCard from "../components/Home/CircleCard";
import { useAppDataContext } from "../features/AppData/AppDataContext";
import { useEffect } from "react";
import SeccionCategorias from "../components/Home/SeccionCategorias";
import { useLocation } from "react-router-dom";
import { useDatosPublic } from "../context/DatosPublicContext";
import { LoadingSpinner } from "../components/Windows/LoadingSpinner";
import { useDatosPublicComponentes } from "../features/ControlComponents/ControladorComponentesContext";

function Home() {
  const { cargando: cargandoApp } = useAppDataContext();
  const { loading: cargandoComponents, componentes } = useDatosPublicComponentes();
  const { cargando: cargandoPublic } = useDatosPublic();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (cargandoApp || cargandoPublic) {
    return (
      <div className="loading-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const ofertasActivado = componentes ? componentes.componente_anuncios : true;
  const tendenciasActivado = componentes ? componentes.componente_tendencia : true;
  const carritoAnimadoActivado = componentes ? componentes.componente_carrito_animado : true;
  const reseñasActivado = componentes ? componentes.componente_reseñas : true;
  const seccionVariosActivado = componentes ? componentes.componente_varios : true;
  const categoriasActivado = componentes ? componentes.componente_categoria : true;

  return (
    <div className="home">
      <div className="content">
        <Hero />
        <div className="content-below">
          {ofertasActivado && <BannerOfertas />}
          {tendenciasActivado && <Novedades />}
          {seccionVariosActivado && <SeccionVarios />}
          {categoriasActivado && <SeccionCategorias />}
          {carritoAnimadoActivado && <CarroPlatform rotacion={0} />}
          {<CircleCard />}
          {carritoAnimadoActivado && <CarroPlatform rotacion={0} invert={true} />}
          {reseñasActivado && <ReviewCarousel />}
        </div>
      </div>
    </div>
  );
}

export default Home;