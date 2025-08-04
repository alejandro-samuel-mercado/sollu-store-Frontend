import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useLocation } from "react-router-dom";
import { MenuExpandible } from "./MenuExpandible";
import { useAuthContext } from "../../features/Auth/AuthContext";
import { useDatosPublic } from "../../context/DatosPublicContext";



export const Navbar = () => {
  const location = useLocation()
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [navBarFloat, setNavBarFloat] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const { isAuthenticated } = useAuthContext();
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  const { contenidosWeb } = useDatosPublic()
  const [logo, setLogo] = useState("static/logo.png")

  useEffect(() => {
    if (!contenidosWeb) return
    const logoE = contenidosWeb?.find((contenido) => contenido.nombre === "componente_logo")
    setLogo(logoE)
  }, [location, contenidosWeb])

  const toggleSidebar = () => {
    setIsMenuExpanded((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        setNavBarFloat(true);
      } else {
        setNavBarFloat(false);
      }
      if (currentScrollY > prevScrollY && currentScrollY > 200) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (loadingTimeout) clearTimeout(loadingTimeout); // Limpiar el timeout al desmontar
    };
  }, [prevScrollY]);


  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light px-4 ${navBarFloat ? "floating" : ""} ${isHidden ? "hidden" : ""
        }`}
    >
      <Link className="navbar-brand" to="/">
        {<img src={logo?.imagen || 'static/logo.png'} alt="Logo" className="navbar-logo" />}
      </Link>

      <div className="navbar-content">
        <div className="navbar-left">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              {location.pathname === "/" ? (
                <Link className="nav-link" to="/productos-listado">
                  Productos
                </Link>
              ) : (
                <Link className="nav-link" to="/">
                  Home
                </Link>
              )}
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="categoriasDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categorías
              </a>
              <ul className="dropdown-menu" aria-labelledby="categoriasDropdown">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/productos-listado/categorias/Remeras"
                  >
                    Remeras
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/productos-listado/categorias/Pantalones"
                  >
                    Pantalones
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/productos-listado/categorias/Camperas"
                  >
                    Camperas
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/categorias">
                    Ver más ...
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="items-right">
          <Link className="nav-link" to="/Mi-cuenta">
            {isAuthenticated ? "Mi Cuenta" : "Login"}
          </Link>
          <Link className="nav-link  carrito" to="/MiCarrito">
            <img src="/static/carrito.png" alt="Carrito" className="cart-icon" />
          </Link>
          <MenuExpandible
            isMenuExpanded={isMenuExpanded}
            toggleSidebar={toggleSidebar}
          />
        </div>
      </div>
    </nav>
  );
};