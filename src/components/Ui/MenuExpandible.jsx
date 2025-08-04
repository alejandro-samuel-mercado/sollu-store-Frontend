import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";

export const MenuExpandible = ({ isMenuExpanded, toggleSidebar }) => {
  const location = useLocation();
  const [isMin, setIsMin] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMin(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuExpanded &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuExpanded, toggleSidebar]);
  useEffect(() => {
    if (isMenuExpanded) {
      toggleSidebar();
    }
  }, [location.pathname]);

  return (
    <div ref={sidebarRef}>
      <div className="expandable-menu">
        <button
          className="expandable-btn bg-dark"
          onClick={toggleSidebar}
        >
          {isMenuExpanded ? (
            <img src="/static/cancelar.png" />
          ) : (
            <img src="/static/menu.png" />
          )}
        </button>
        <div
          className={`menu-content ${isMenuExpanded ? "expanded" : ""}`}
        >
          <ul>
            {!location.pathname.includes("/productos") && (
              <li className="nav-item">
                <Link className="nav-link" to="/productos-listado">
                  TODOS
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/mis-favoritos">
                MIS FAVORITOS
              </Link>
            </li>
            {isMin && (
              <li className="nav-item">
                <Link className="nav-link" to="/categorias">
                  CATEGORIAS
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/info-page">
                ¿COMO COMPRAR?
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">
                CONTACTO
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about-us">
                SOBRE NOSOTROS
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/terminos-politicas">
                TERMINOS Y POLITICAS
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
