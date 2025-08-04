import React, { useEffect } from "react";
import { useDatosPublic } from "../context/DatosPublicContext";
import { Link, useLocation } from "react-router-dom";
import { LoadingSpinner } from "../components/Windows/LoadingSpinner";


const Categorias = () => {
  const { categorias, cargando } = useDatosPublic();
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="categorias-container">
      <header className="categorias-header">
        <h1 className="header-title">Explora Nuestras Categorías</h1>
        <div className="header-shape"></div>
      </header>
      {cargando && <LoadingSpinner />}

      <div className="categorias-grid">
        {categorias.length > 0 ? (
          categorias.map((categoria, index) => (
            <Link
              key={categoria.id}
              className="categoria-card"
              to={`/productos-listado/categorias/${categoria.nombre}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="categoria-shape">
                <div className="categoria-content">
                  <h2>{categoria.nombre}</h2>
                  <img
                    src={categoria.imagen}
                    alt={categoria.nombre}
                  />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <>
            {!cargando && (
              <div className="no-categorias">No hay categorías disponibles</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Categorias