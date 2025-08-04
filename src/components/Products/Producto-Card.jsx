import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDatosPublic } from "../../context/DatosPublicContext";
import { useActionsContext } from "../../features/Actions/ActionsContext";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export const ProductoCard = ({ producto }) => {
  const location = useLocation();
  const hayStock = producto?.stock_total > 0;
  const [esFavorito, setEsFavorito] = useState(false);
  const { misFavoritos } = useDatosPublic();
  const { handleFavoritoClick } = useActionsContext();

  useEffect(() => {
    const esFavorito = misFavoritos.some((fav) => fav.id === producto.id);
    setEsFavorito(esFavorito);
  }, [location.pathname, misFavoritos, producto.id]);

  // Depuración: Registrar stock_total y hayStock
  useEffect(() => {
    console.log(`Producto: ${producto.nombre}, stock_total: ${producto.stock_total}, hayStock: ${hayStock}`);
  }, [producto, hayStock]);

  const nombreCompleto = `${producto?.nombre} ${producto?.marca || ""} - ${producto?.modelo_talle || ""}`.trim();

  return (
    <div className="card-all">
      <button
        onClick={() => handleFavoritoClick(producto, setEsFavorito)}
        className="ml-2 focus:outline-none favorite-btn"
        aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        {esFavorito ? (
          <FaHeart className="text-red-500" size={24} />
        ) : (
          <FaRegHeart className="text-gray-500" size={24} />
        )}
      </button>
      <img
        src={producto?.imagen}
        alt={producto.nombre}
        onError={(e) => {
          e.target.src = "/static/fallback-product.png";
        }}
      />
      <h3 className="font-semibold">
        {nombreCompleto}
      </h3>
      {producto?.descripcion && <p>{producto.descripcion}</p>}
      {hayStock ? (
        <Link
          className="button"
          to={`/productos-listado/producto/${producto.id}`}
          aria-label={`Ver detalles de ${producto.nombre}`}
        >
          {producto.descuento > 0 && (
            <p className="discount">{producto.descuento}% OFF</p>
          )}
          <h3 className="price">$ {producto?.precio_final}</h3>
        </Link>
      ) : (
        <div
          className="button no-stock"
          aria-label={`Producto ${producto.nombre} sin stock`}
        >
          <h3>Sin Stock</h3>
        </div>
      )}
    </div>
  );
};