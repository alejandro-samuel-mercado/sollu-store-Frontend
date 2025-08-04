import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useDatosPublic } from "../../context/DatosPublicContext";
import { useDatosPublicComponentes } from "../../features/ControlComponents/ControladorComponentesContext";
import { useLocation } from "react-router-dom";


export const LateralFilter = ({
  isSidebarOpen,
  toggleSidebar,
  filtrar,
  reset,
}) => {
  const { categorias, productos } = useDatosPublic();
  const { componentes } = useDatosPublicComponentes();
  const sidebarRef = useRef(null);
  const location = useLocation();


  const atributosPorTipo = useMemo(() => {
    const mapa = {};
    productos?.forEach((producto) => {
      producto.producto_atributos?.forEach((atributoObj) => {
        const attr = atributoObj.atributo;
        if (attr && attr.nombre && attr.valor) {
          if (!mapa[attr.nombre]) {
            mapa[attr.nombre] = new Set();
          }
          mapa[attr.nombre].add(attr.valor);
        }
      });
    });
    Object.keys(mapa).forEach((nombre) => {
      mapa[nombre] = [...mapa[nombre]].sort();
    });
    return mapa;
  }, [productos]);

  // Generar una lista de tipos únicos
  const tiposUnicos = useMemo(() => {
    const tiposSet = new Set();
    productos?.forEach((producto) => {
      if (producto.tipo) {
        tiposSet.add(producto.tipo);
      }
    });
    return [...tiposSet].sort();
  }, [productos]);

  // Generar una lista de marcas únicas
  const marcasUnicas = useMemo(() => {
    const marcasSet = new Set();
    productos?.forEach((producto) => {
      if (producto.marca) {
        marcasSet.add(producto.marca);
      }
    });
    return [...marcasSet].sort();
  }, [productos]);

  // Generar una lista de modelo/talle únicos (campo modelo_talle)
  const modelosUnicos = useMemo(() => {
    const modelosSet = new Set();
    productos?.forEach((producto) => {
      if (producto.modelo_talle) {
        modelosSet.add(producto.modelo_talle);
      }
    });
    return [...modelosSet].sort();
  }, [productos]);

  // Cerrar la barra lateral al cambiar de ruta
  useEffect(() => {
    if (isSidebarOpen) {
      toggleSidebar();
    }
  }, [location.pathname]);

  const handleClickOutside = useCallback(
    (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        toggleSidebar();
      }
    },
    [isSidebarOpen, toggleSidebar]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    console.log("Sidebar isOpen:", isSidebarOpen);
  }, [isSidebarOpen]);

  if (!productos || !categorias) {
    return <div className="loading">Cargando filtros...</div>;
  }

  return (
    <div className="design-one">

      <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="closed-btn" onClick={toggleSidebar}>
          <span className="close-icon">✖</span>
        </button>

        <div className="sidebar-content">
          <button className="reset-btn btn" onClick={reset}>
            Quitar Filtros
          </button>

          <div className="filter-section special-filters">
            <h6 className="filter-title">Explora</h6>
            <div className="filter-group">
              {componentes?.componente_canjes && (
                <button
                  className="filter-btn"
                  onClick={() => filtrar("canjeables", "", "")}
                  aria-label="Filtrar por productos canjeables"
                >
                  Canjeables
                </button>
              )}
              <button
                className="filter-btn"
                onClick={() => filtrar("descuentos", "", "")}
                aria-label="Filtrar por productos con descuento"
              >
                Con Descuentos
              </button>
            </div>
          </div>

          {!location.pathname.includes("/productos/listado/categorias") && (
            <div className="filter-section categories">
              <h6 className="filter-title">Categorías</h6>
              <div className="filter-group">
                {categorias.map((categoria, index) => (
                  <button
                    key={categoria.id}
                    className="filter-btn"
                    onClick={() => filtrar("categorias", categoria.id, "")}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    aria-label={`Filtrar por categoría ${categoria.nombre}`}
                  >
                    {categoria.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtro por Tipos */}
          {tiposUnicos.length > 0 && (
            <div className="filter-section types">
              <h6 className="filter-title">Tipos</h6>
              <div className="filter-group">
                {tiposUnicos.map((tipo, index) => (
                  <button
                    key={tipo}
                    className="filter-btn"
                    onClick={() => filtrar("tipos", tipo, "")}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    aria-label={`Filtrar por tipo ${tipo}`}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtro por Marcas */}
          {marcasUnicas.length > 0 && (
            <div className="filter-section brands">
              <h6 className="filter-title">Marcas</h6>
              <div className="filter-group">
                {marcasUnicas.map((marca, index) => (
                  <button
                    key={marca}
                    className="filter-btn"
                    onClick={() => filtrar("marcas", marca, "")}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    aria-label={`Filtrar por marca ${marca}`}
                  >
                    {marca}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtro por Atributos (incluye talles, colores, etc.) */}
          {Object.entries(atributosPorTipo).map(([nombre, valores]) => (
            <div key={nombre} className="filter-section">
              <h6 className="filter-title">{nombre}</h6>
              <div className="filter-group">
                {valores.map((valor, index) => (
                  <button
                    key={`${nombre}-${valor}`}
                    className="filter-btn"
                    onClick={() => filtrar("atributos", { nombre, valor }, "")}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    aria-label={`Filtrar por ${nombre}: ${valor}`}
                  >
                    {valor}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Filtro por Modelo/Talle (campo modelo_talle) */}
          {modelosUnicos.length > 0 && (
            <div className="filter-section models">
              <h6 className="filter-title">Modelo/Talle</h6>
              <div className="filter-group">
                {modelosUnicos.map((modelo, index) => (
                  <button
                    key={modelo}
                    className="filter-btn"
                    onClick={() => filtrar("modelos", modelo, "")}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    aria-label={`Filtrar por modelo/talle ${modelo}`}
                  >
                    {modelo}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="filter-section prices">
            <h6 className="filter-title">Precios</h6>
            <div className="filter-group">
              <button
                className="filter-btn"
                onClick={() => filtrar("precios", 100, 1000)}
                aria-label="Filtrar por precio hasta $1000"
              >
                $1000
              </button>
              <button
                className="filter-btn"
                onClick={() => filtrar("precios", 1000, 5000)}
                aria-label="Filtrar por precio entre $1000 y $5000"
              >
                $1000 - $5000
              </button>
              <button
                className="filter-btn"
                onClick={() => filtrar("precios", 5000, 10000)}
                aria-label="Filtrar por precio entre $5000 y $10000"
              >
                $5000 - $10000
              </button>
              <button
                className="filter-btn"
                onClick={() => filtrar("precios", 10000, 30000)}
                aria-label="Filtrar por precio entre $10000 y $30000"
              >
                $10000 - $30000
              </button>
              <button
                className="filter-btn"
                onClick={() => filtrar("precios", 30000, 100000)}
                aria-label="Filtrar por precio desde $30000"
              >
                $30000
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};