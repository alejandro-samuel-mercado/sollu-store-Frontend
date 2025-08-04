import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../features/Auth/AuthContext";

export const BottomBar = () => {
    const location = useLocation();
    const [isHidden, setIsHidden] = useState(false);
    const [prevScrollY, setPrevScrollY] = useState(0);
    const { isAuthenticated } = useAuthContext();
    const [loadingTimeout, setLoadingTimeout] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
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
            if (loadingTimeout) clearTimeout(loadingTimeout);
        };
    }, [prevScrollY, loadingTimeout]);

    return (
        <nav className={`bottombar ${isHidden ? "hidden" : ""}`}>
            <div className="bottombar-content">
                <Link
                    to="/"
                    className={`bottombar-nav-link ${location.pathname === "/" ? "active" : ""}`}
                >
                    <i className="bi bi-house-fill"></i>
                    <span>Home</span>
                </Link>
                <Link
                    to="/productos-listado"
                    className={`bottombar-nav-link ${location.pathname === "/productos-listado" ? "active" : ""
                        }`}
                >
                    <i className="bi bi-grid-fill"></i>
                    <span>Productos</span>
                </Link>
                <Link
                    to="/MiCarrito"
                    className={`bottombar-nav-link ${location.pathname === "/MiCarrito" ? "active" : ""
                        }`}
                >
                    <i className="bi bi-cart-fill"></i>
                    <span>Carrito</span>
                </Link>
                <Link
                    to="/Mi-cuenta"
                    className={`bottombar-nav-link ${location.pathname === "/Mi-cuenta" ? "active" : ""
                        }`}
                >
                    <i className="bi bi-person-fill"></i>
                    <span>{isAuthenticated ? "Cuenta" : "Login"}</span>
                </Link>
            </div>
        </nav>
    );
};