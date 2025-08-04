import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className="design-one">
            <div className="error-404-container">
                <header className="error-404-header">
                    <h1 className="error-404-title">404</h1>
                    <div className="error-shape"></div>
                </header>

                <div className="error-404-content">
                    <div className="error-message">
                        <div className="error-icon">!</div>
                        <h2 className="error-subtitle">¡Página no encontrada!</h2>
                        <p className="error-text">
                            Parece que te perdiste en el espacio digital. No te preocupes, te
                            ayudaremos a volver al camino correcto.
                        </p>
                        <div className="error-actions">
                            <button
                                className="home-btn"
                                onClick={() => navigate("/")}
                            >
                                Volver al Inicio
                            </button>
                            <button
                                className="products-btn"
                                onClick={() => navigate("/productos-listado")}
                            >
                                Explorar Productos
                            </button>
                        </div>
                    </div>

                    {/* Elementos animados decorativos */}
                    <div className="floating-orb orb-1"></div>
                    <div className="floating-orb orb-2"></div>
                    <div className="floating-orb orb-3"></div>
                    <div className="spinning-gear gear-1"></div>
                    <div className="spinning-gear gear-2"></div>
                </div>

                <footer className="error-404-footer">
                    <p>
                        ¿Sigues perdido? Contáctanos en{" "}
                        <a href="mailto:soporte@tuempresa.com">soporte@tuempresa.com</a>
                    </p>
                    <p>© {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
};

export default Error404;