import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../Api/index";
import { useDatosPublic } from "../context/DatosPublicContext";
import { CarritoContext } from "../context/CarritoContext";
import Swal from "sweetalert2";
import { useActionsContext } from "../features/Actions/ActionsContext";

const ExitoCompra = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [datosCompra, setDatosCompra] = useState(null);
  const [validado, setValidado] = useState(true);
  const { envio, barrios } = useDatosPublic();
  const { generarPDF } = useActionsContext();
  const [compraExitosa, setCompraExitosa] = useState("null");
  const { carrito, eliminarProducto } = useContext(CarritoContext);
  const [ventaCreada, setVentaCreada] = useState(false);
  const [ventaId, setVentaId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const datos = localStorage.getItem("datosCompra")
      ? JSON.parse(localStorage.getItem("datosCompra"))
      : null;

    setDatosCompra(datos);
  }, [location]);

  const crearVenta = async () => {
    console.log("datosCompra:", datosCompra);
    if (!datosCompra || !datosCompra.productos) {
      console.error("datosCompra o datosCompra.productos no está definido");
      setCompraExitosa(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontraron datos de la compra o productos. Por favor, intenta nuevamente.",
        confirmButtonText: "Volver a intentar",
        confirmButtonColor: "#e74c3c",
      });
      return;
    }

    try {
      const detalles = datosCompra.productos.map((item) => {
        const productoFinalId = Number(item.producto_final_id);
        if (!productoFinalId || isNaN(productoFinalId)) {
          throw new Error("producto_final_id no puede ser nulo o inválido");
        }
        return {
          producto_final_id: productoFinalId,
          cantidad: item.cantidad,
          precio_unitario: Number(item.precio_unitario) || 0,
          subtotal: (Number(item.precio_unitario) * item.cantidad) || 0,
        };
      });

      const tipoEnvio = envio.find(
        (env) =>
          env.nombre.toLowerCase() === datosCompra.finalEnvio.toLowerCase()
      );

      const ventaData = {
        estado: datosCompra.estadoFinalVenta.id,
        vendedor: null,
        precio_total: Number(datosCompra.precioFinal.toFixed(2)),
        barrio: datosCompra.barrio || null,
        tipo_envio: tipoEnvio?.id || null,
        domicilio: datosCompra.domicilio || null,
        fecha_entrega: datosCompra.fecha_entrega?.split("T")[0] || null,
        horario_entrega: datosCompra.horario_entrega || null,
        detalles: detalles,
      };

      const respuesta = await API.post("crear-venta/", ventaData);
      const nuevaVenta = respuesta?.data;

      if (respuesta && nuevaVenta) {
        await quitarProductosDeCarrito(detalles);
        setVentaId(nuevaVenta.id);
        const adjustedDatosCompra = {
          ...datosCompra,
          nombre: datosCompra.nombre || "",
          telefono: datosCompra.telefono || "",
          correo: datosCompra.correo || "",
          domicilio: datosCompra.domicilio || "",
          productos: datosCompra.productos.map((item) => ({
            nombre: item.nombre,
            talle: item.talle || "N/A",
            precio_unitario: item.precio_unitario,
            cantidad: item.cantidad,
            subtotal: item.subtotal,
          })),
          fecha_venta: datosCompra.fecha_venta || new Date().toISOString(),
          fecha_entrega: datosCompra.fecha_entrega || null,
          horario_entrega: datosCompra.horario_entrega || null,
        };

        console.log("adjustedDatosCompra antes de generarPDF:", adjustedDatosCompra);
        await generarPDF(adjustedDatosCompra, nuevaVenta.puntos_club_acumulados, nuevaVenta.id);
        setCompraExitosa(true);

        Swal.fire({
          icon: "success",
          title: "¡Compra Exitosa!",
          text: "Tu recibo ha sido enviado a tu correo y descargado.",
          confirmButtonText: "¡Gracias!",
          confirmButtonColor: "#27ae60",
        });
      }
    } catch (error) {
      console.error("Error al crear la venta:", error.response?.data || error);
      setCompraExitosa(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo completar la compra. Por favor, intenta nuevamente.",
        confirmButtonText: "Volver a intentar",
        confirmButtonColor: "#e74c3c",
      });
    }
  };

  const quitarProductosDeCarrito = (detalles) => {
    detalles.forEach((detalle) => {
      const productoAEliminar = carrito?.find(
        (item) => item.producto_final.id === detalle.producto_final_id
      );
      if (productoAEliminar) {
        eliminarProducto(productoAEliminar.producto_final.id);
      }
    });
  };

  useEffect(() => {
    if (!datosCompra || !validado || ventaCreada) return;
    setVentaCreada(true);
    crearVenta();
    localStorage.removeItem("datosCompra");
  }, [datosCompra, validado]);

  return (
    <div className="success-container">
      <header className="success-header">
        <h1 className="success-title">Confirmación de Compra</h1>
        <div className="header-shape"></div>
      </header>

      <div className="success-content">
        {compraExitosa === true ? (
          <div className="success-message">
            <div className="check-icon">✓</div>
            <h2 className="success-subtitle">¡Gracias por tu compra!</h2>
            <p className="success-text">
              Tu recibo ha sido descargado y enviado a tu correo. ¡Esperamos que
              disfrutes tus productos! Acumula puntos para tu próximo descuento.
            </p>
            <div className="order-details">
              <p>
                <strong>Total Pagado:</strong> ${datosCompra?.precioFinal || 0}
              </p>
              <p>
                <strong>Fecha de Entrega Estimada:</strong>{" "}
                {datosCompra?.fecha_entrega?.split("T")[0] || "Por definir"}
              </p>
            </div>
            <div className="success-actions">
              <button
                className="continue-shopping-btn"
                onClick={() => navigate("/productos-listado")}
              >
                Explorar Más Productos
              </button>
              <button
                className="back-cart-btn"
                onClick={() => navigate("/MiCarrito")}
              >
                Volver al Carrito
              </button>
            </div>
          </div>
        ) : compraExitosa === "null" ? (
          <div className="loading-section" role="status">
            <div className="spinner"></div>
            <span className="sr-only">Procesando tu compra...</span>
          </div>
        ) : (
          <div className="error-message">
            <div className="error-icon">✕</div>
            <h2 className="error-subtitle">¡Compra no realizada!</h2>
            <p className="error-text">
              Ha ocurrido un error durante la compra. Por favor, intenta
              nuevamente o contacta al soporte.
            </p>
            <button
              className="retry-btn"
              onClick={() => navigate("/MiCarrito")}
            >
              Intentar de Nuevo
            </button>
          </div>
        )}
      </div>

      <div className="success-footer">
        <p>
          ¿Necesitas ayuda? Contáctanos en{" "}
          <a href="mailto:soporte@tuempresa.com">soporte@tuempresa.com</a>
        </p>
        <p>© {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default ExitoCompra;