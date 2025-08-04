import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PagoFallido = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className="failure-container">
            <header className="failure-header">
                <h1 className="failure-title">Pago Fallido</h1>
                <div className="header-shape"></div>
            </header>

            <div className="failure-content">
                <div className="error-message">
                    <div className="error-icon">✕</div>
                    <h2 className="error-subtitle">¡Lo sentimos!</h2>
                    <p className="error-text">
                        No pudimos procesar tu pago. Puede deberse a un problema con tu método de pago o una interrupción en el servicio. Por favor, revisa tus datos e intenta nuevamente.
                    </p>
                    <div className="failure-actions">
                        <button
                            className="retry-btn"
                            onClick={() => navigate("/MiCarrito")}
                        >
                            Volver al Carrito
                        </button>
                        <button
                            className="support-btn"
                            onClick={() => navigate("/contacto")}
                        >
                            Contactar Soporte
                        </button>
                    </div>
                </div>
            </div>

            <footer className="failure-footer">
                <p>
                    ¿Necesitas ayuda? Contáctanos en{" "}
                    <a href="mailto:${infoWeb.ssnis}">soporte@tuempresa.com</a>
                </p>
                <p>© {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default PagoFallido;