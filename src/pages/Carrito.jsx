import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import { useAuthContext } from "../features/Auth/AuthContext";
import FormularioCompra from "../components/Forms/FormularioCompra";
import { LoadingSpinner } from "../components/Windows/LoadingSpinner";
import { FailedNotification } from "../components/Windows/FailedNotification";


const Carrito = () => {
  const location = useLocation();
  const [formPay, setFormPay] = useState(false);
  const [precio, setPrecio] = useState(0);
  const { carrito, eliminarProducto, cargando, error } = useContext(CarritoContext);
  const { isAuthenticated } = useAuthContext();
  const [productosComprables, setProductosComprables] = useState([]);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    if (!carrito) return;
    console.log(carrito)
    // Filtrar productos con stock disponible
    const productosConStock = carrito.filter(
      (item) => item.producto_atributo?.stock > 0
    );
    setProductosComprables(productosConStock);

    // Calcular el precio total
    const precioTotalProductos = () => {
      const precioTotalNuevo = carrito.reduce((acumulador, item) => {
        const producto = item.producto_atributo?.producto;
        const precioProducto = producto?.precio_final
          ? Number(producto.precio_final * item.cantidad)
          : 0;
        return acumulador + precioProducto;
      }, 0);
      setPrecio(precioTotalNuevo);
    };
    precioTotalProductos();
  }, [carrito]);

  const handleComprar = () => {
    setFormPay(true);
  };

  const cerrarModal = () => {
    setFormPay(false);
  };

  const handleEliminar = async (productoAtributoId) => {
    const success = await eliminarProducto(productoAtributoId);
    if (!success) {
      setDeleteError("No se pudo eliminar el producto. Intenta de nuevo.");
    }
  };

  return (
    <div className="carrito-container">
      <header className="carrito-header">
        <h1>Tu Carrito</h1>
        <div className="header-shape"></div>
      </header>

      {!isAuthenticated && (
        <p className="message">Inicia sesión para ver tu carrito</p>
      )}

      {cargando && <LoadingSpinner />}

      {error && (
        <FailedNotification
          message={error}
          onClose={() => { }}
        />
      )}

      {deleteError && (
        <FailedNotification
          message={deleteError}
          onClose={() => setDeleteError(null)}
        />
      )}

      <div className="carrito-content">
        {!cargando && carrito?.length > 0 ? (
          <ul className="carrito-list">
            {carrito.map((item, index) => {
              const producto = item.producto_atributo?.producto;
              const atributo = item.producto_atributo?.atributo;
              if (!item.producto_atributo || !producto || !atributo) {
                console.warn("Producto incompleto en el carrito:", item);
                return null;
              }

              return (
                <li
                  key={item.id}
                  className="carrito-item"
                  style={{
                    backgroundColor: item.producto_atributo?.stock > 0 ? "#fff" : "#ffcccc",
                    opacity: item.producto_atributo?.stock > 0 ? 1 : 0.6,
                  }}
                  data-index={index}
                >
                  <div className="item-image">
                    <img
                      src={item.producto_atributo.imagen || producto.imagen || "placeholder.jpg"}
                      alt={producto.nombre || "Producto"}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{producto.nombre || "Producto no disponible"}</h3>
                    <p className="atributo">
                      {atributo.nombre}: {atributo.valor}
                    </p>
                    <p className="price">
                      ${(producto.precio_final * item.cantidad).toFixed(2) || 0}
                    </p>
                    <p>Cantidad: {item.cantidad}</p>
                    {item.producto_atributo?.stock < 1 && (
                      <p className="stock-warning">⚠️ Sin stock</p>
                    )}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleEliminar(item.producto_atributo?.id || item.id)}
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          !cargando && isAuthenticated && (
            <p className="message">
              Tu carrito está vacío. ¡Agrega algunos productos!
            </p>
          )
        )}
      </div>

      {productosComprables.length > 0 && (
        <button className="buy-btn" onClick={handleComprar}>
          Comprar Todo (${precio.toFixed(2)})
        </button>
      )}

      {formPay && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={cerrarModal}>
              ✕
            </button>
            <FormularioCompra productosCarrito={productosComprables} precio={precio} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;