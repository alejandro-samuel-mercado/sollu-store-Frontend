import React, { useState, useContext, useEffect } from "react";
import { useDatosPublic } from "../context/DatosPublicContext";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import { useAuthContext } from "../features/Auth/AuthContext";
import { CameraModal } from "../components/Windows/CamaraModalproduct";
import { PiCoinsFill } from "react-icons/pi";
import { SuccessNotification } from "../components/Windows/SuccessNotification";
import { FailedNotification } from "../components/Windows/FailedNotification";
import { FaArrowLeft, FaHeart, FaRegHeart, FaMinus, FaPlus, FaStar } from "react-icons/fa";
import { useDatosPublicComponentes } from "../features/ControlComponents/ControladorComponentesContext";
import { useActionsContext } from "../features/Actions/ActionsContext";
import API from "../Api/index.js";


const ProductoDetalle = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();
  const { id } = useParams();
  const { productos, cargando, categorias, misFavoritos, reviewsProducts } = useDatosPublic();
  const { componentes } = useDatosPublicComponentes();
  const { agregarProducto, carrito } = useContext(CarritoContext);
  const { handleFavoritoClick } = useActionsContext();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [yaFueAgregado, setYaFueAgregado] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [failedSuccessVariante, setFailedSuccessVariante] = useState(false);
  const [failedSuccessStock, setFailedSuccessStock] = useState(false);
  const [failedSuccessAdd, setFailedSuccessAdd] = useState(false);
  const [failedSuccessSesion, setFailedSuccessSesion] = useState(false);
  const [failedNoProductos, setFailedNoProductos] = useState(false);
  const [selectedAtributo, setSelectedAtributo] = useState(null); // Atributo seleccionado (ProductoAtributo)
  const [hoveredAtributo, setHoveredAtributo] = useState(null); // Atributo sobre el que se pasa el mouse
  const [productosRecomendados, setProductosRecomendados] = useState([]);
  const [producto, setProducto] = useState({});
  const [esFavorito, setEsFavorito] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [overallRating, setOverallRating] = useState({ average_rating: 0, total_reviews: 0 });
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);


  // Mapa de colores a hexadecimales
  const colorMap = {
    Rojo: "#FF0000",
    Azul: "#0000FF",
    Negro: "#000000",
    Blanco: "#FFFFFF",
    Verde: "#008000",
    Amarillo: "#FFFF00",
    // Agrega más colores según los valores en tu base de datos
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    if (!productos) {
      setFailedNoProductos(true);
      return;
    }
    const foundProduct = productos?.find((p) => p.id === parseInt(id));
    if (!foundProduct) {
      setFailedNoProductos(true);
      return;
    }
    setProducto(foundProduct);
    setMainImage(foundProduct?.imagen || "");
  }, [productos, navigate, location, id]);

  // Verificar si el producto ya está en el carrito (comparar por producto_atributo_id)
  useEffect(() => {
    if (!selectedAtributo || !carrito) return;
    const existeEnElCarrito = carrito?.some(
      (item) => item.producto_atributo?.id === selectedAtributo.id
    );
    setYaFueAgregado(existeEnElCarrito);
  }, [carrito, selectedAtributo, navigate]);

  // Verificar si el producto está en favoritos
  useEffect(() => {
    if (!producto) return;
    const esFavorito = misFavoritos.some((fav) => fav.id === producto.id);
    setEsFavorito(esFavorito);
  }, [location.pathname, misFavoritos, producto]);

  // Obtener productos recomendados
  useEffect(() => {
    if (producto && productos && categorias) {
      const categoriaId = producto.categoria;
      const relacionados = productos
        .filter((p) => p.categoria === categoriaId && p.id !== producto.id)
        .slice(0, 4);
      setProductosRecomendados(relacionados);
    }
  }, [producto, productos, categorias, location, navigate]);

  // Obtener atributos disponibles (por ejemplo, colores)
  const atributosDisponibles = producto?.producto_atributos || [];

  // Filtrar colores (atributos con nombre "color")
  const coloresDisponibles = atributosDisponibles
    .filter((pa) => pa.atributo.nombre.toLowerCase() === "color")
    .map((pa) => ({
      id: pa.id,
      valor: pa.atributo.valor,
      stock: pa.stock,
    }));

  // Filtrar otros atributos (que no sean "color")
  const otrosAtributos = atributosDisponibles
    .filter((pa) => pa.atributo.nombre.toLowerCase() !== "color")
    .reduce((acc, pa) => {
      const nombre = pa.atributo.nombre;
      if (!acc[nombre]) {
        acc[nombre] = [];
      }
      acc[nombre].push({
        id: pa.id,
        valor: pa.atributo.valor,
        stock: pa.stock,
      });
      return acc;
    }, {});

  const atributoPrincipal = otrosAtributos ? Object.keys(otrosAtributos)[0] : null;
  const valoresAtributoPrincipal = atributoPrincipal
    ? otrosAtributos[atributoPrincipal].sort((a, b) => a.valor.localeCompare(b.valor))
    : [];

  // Seleccionar automáticamente el primer atributo disponible
  useEffect(() => {
    if (atributosDisponibles.length > 0 && !selectedAtributo) {
      const primerColor = coloresDisponibles[0];
      const primerAtributo = primerColor || atributosDisponibles[0];
      setSelectedAtributo(primerAtributo);
    }
  }, [atributosDisponibles, coloresDisponibles, selectedAtributo]);

  // Actualizar la imagen principal cuando se selecciona un atributo
  useEffect(() => {
    if (selectedAtributo?.imagen) {
      setMainImage(selectedAtributo.imagen);
    } else {
      setMainImage(producto?.imagen || "");
    }
  }, [selectedAtributo, producto]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddToCart = async (cantidad) => {
    // Resetear notificaciones previas para evitar conflictos
    setShowSuccess(false);
    setFailedSuccessVariante(false);
    setFailedSuccessStock(false);
    setFailedSuccessAdd(false);
    setFailedSuccessSesion(false);

    // Verificar si hay un atributo seleccionado
    if (!selectedAtributo) {
      setFailedSuccessVariante(true);
      return;
    }

    // Verificar si el producto tiene stock total
    if (producto.stock_total <= 0) {
      setFailedSuccessStock(true);
      return;
    }

    // Verificar si el atributo seleccionado tiene stock
    if (selectedAtributo.stock <= 0) {
      setFailedSuccessStock(true);
      return;
    }

    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      setFailedSuccessSesion(true);
      return;
    }

    // Verificar si el producto con el atributo seleccionado ya está en el carrito
    if (yaFueAgregado) {
      setFailedSuccessAdd(true);
      return;
    }

    // Si pasa todas las validaciones, agregar al carrito
    try {
      await agregarProducto(selectedAtributo.id, cantidad);
      setShowSuccess(true);
    } catch (error) {
      setFailedSuccessAdd(true); // En caso de error al agregar, mostramos una notificación de error
    }
  };

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess(false);

    if (!isAuthenticated) {
      setReviewError("Debes iniciar sesión para dejar una reseña.");
      return;
    }

    if (!newReview.comment.trim()) {
      setReviewError("El comentario no puede estar vacío.");
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      setReviewError("Por favor, selecciona una calificación entre 1 y 5 estrellas.");
      return;
    }

    try {
      const response = await API.post(
        "reviewsProducts/",
        {
          product: producto.id,
          comment: newReview.comment,
          rating: newReview.rating,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setReviews([...reviews, response.data]);
      setNewReview({ comment: "", rating: 0 });
      setReviewSuccess(true);
      setReviewError("");
      const ratingResponse = await API.get(`reviewsProducts/overall-rating/${producto.id}/`);
      setOverallRating(ratingResponse.data);
    } catch (error) {
      setReviewError("Error al enviar la reseña. Inténtalo de nuevo.");
    }
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };


  // Construir el nombre completo del producto
  const nombreCompleto = `${producto?.nombre} ${producto?.marca || ""} - ${producto?.modelo_talle || ""}`.trim();

  if (cargando) {
    return (
      <div>

        <p className="loading-text">Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <div className="product-detail-container">
        {failedSuccessAdd && (
          <FailedNotification
            message="El producto con este atributo ya está en el carrito."
            onClose={() => setFailedSuccessAdd(false)}
          />
        )}
        {failedSuccessSesion && (
          <FailedNotification
            message="Debes iniciar sesión para agregar productos al carrito"
            onClose={() => setFailedSuccessSesion(false)}
          />
        )}
        {failedSuccessStock && (
          <FailedNotification
            message="No hay stock disponible para este producto o atributo."
            onClose={() => setFailedSuccessStock(false)}
          />
        )}
        {failedSuccessVariante && (
          <FailedNotification
            message="Debes seleccionar un atributo"
            onClose={() => setFailedSuccessVariante(false)}
          />
        )}

        {showSuccess && (
          <SuccessNotification
            message="Producto añadido al carrito"
            onClose={() => setShowSuccess(false)}
          />
        )}

        {/* Botón de regresar */}
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Volver
        </button>

        {/* Sección principal: Imagen y detalles */}
        <div className="product-main">
          <div className="product-image-section">
            <img
              src={mainImage || "https://via.placeholder.com/500"}
              alt={nombreCompleto}
              className="product-image"
            />
            <div className="image-preview-section">
              {[
                { src: producto?.imagen, key: "main" },
                { src: producto?.imagen_secundaria, key: "secondary" },
                { src: producto?.imagen_terciaria, key: "tertiary" },
              ]
                .filter((img) => img.src)
                .map((img) => (
                  <img
                    key={img.key}
                    src={img.src}
                    alt={`${nombreCompleto} - ${img.key}`}
                    className={`preview-image ${mainImage === img.src ? "active" : ""}`}
                    onClick={() => handleImageClick(img.src)}
                  />
                ))}
            </div>
          </div>
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
          <div className="product-info-section">
            <h1 className="product-title">{nombreCompleto}</h1>
            {parseFloat(producto?.precio) !== parseFloat(producto?.precio_final) && (
              <p className="product-price-tach">${producto?.precio}</p>
            )}
            <p className="product-price">${producto?.precio_final}</p>
            {producto?.valor_en_puntos > 0 && (
              <p className="product-points">
                Canjeable por <PiCoinsFill /> {Math.round(producto?.valor_en_puntos, 2)} puntos
              </p>
            )}
            <p className="product-description">{producto?.descripcion}</p>
            <div className="categoria-desc">
              <p>Categoría</p>
              <Link
                to={`/productos-listado/categorias/${producto?.categoria}`}
                className="categoria-link"
              >
                {producto?.categoria}
              </Link>
            </div>

            {/* Selección de color */}
            {coloresDisponibles.length > 0 && (
              <div className="product-color-selector">
                <label>Color:</label>
                <div className="color-options">
                  {coloresDisponibles.map((color) => (
                    <div
                      key={color.id}
                      className={`color-box ${selectedAtributo?.id === color.id ? "selected" : ""}`}
                      style={{ backgroundColor: colorMap[color.valor] || "#ccc" }}
                      onClick={() => setSelectedAtributo(color)}
                      onMouseEnter={() => setHoveredAtributo(color)}
                      onMouseLeave={() => setHoveredAtributo(null)}
                      title={color.valor}
                      aria-label={`Seleccionar color ${color.valor}`}
                    >
                      {(hoveredAtributo?.id === color.id || selectedAtributo?.id === color.id) && (
                        <span className="stock-tooltip">Stock: {color.stock}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selección de otros atributos */}
            {atributoPrincipal && valoresAtributoPrincipal.length > 0 && (
              <div className="product-attribute-selector">
                <label>{atributoPrincipal}:</label>
                <div className="attribute-options">
                  {valoresAtributoPrincipal.map((attr) => (
                    <button
                      key={attr.id}
                      className={`attribute-box ${selectedAtributo?.id === attr.id ? "selected" : ""}`}
                      onClick={() => setSelectedAtributo(attr)}
                      onMouseEnter={() => setHoveredAtributo(attr)}
                      onMouseLeave={() => setHoveredAtributo(null)}
                      aria-label={`Seleccionar ${atributoPrincipal} ${attr.valor}`}
                    >
                      {attr.valor}
                      {(hoveredAtributo?.id === attr.id || selectedAtributo?.id === attr.id) && (
                        <span className="stock-tooltip">Stock: {attr.stock}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Vista previa de stock */}
            <div className="stock-preview">
              <p>Stock total: {producto.stock_total}</p>
            </div>

            {/* Selección de cantidad */}
            <div className="product-quantity-selector">
              <label>Cantidad:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setCantidad((c) => (c > 1 ? c - 1 : 1))}
                  disabled={
                    !selectedAtributo ||
                    selectedAtributo.stock === 0 ||
                    producto.stock_total === 0 ||
                    yaFueAgregado
                  }
                >
                  <FaMinus />
                </button>
                <span>{cantidad}</span>
                <button
                  onClick={() =>
                    setCantidad((c) =>
                      c < (selectedAtributo?.stock || 0) ? c + 1 : c
                    )
                  }
                  disabled={
                    !selectedAtributo ||
                    selectedAtributo.stock === 0 ||
                    producto.stock_total === 0 ||
                    yaFueAgregado
                  }
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="product-actions">
              {componentes?.componente_probarProducto && (
                <button className="try-button" onClick={openModal}>
                  Probar Producto
                </button>
              )}
              <button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(cantidad)}
                // Eliminamos el disabled para permitir que handleAddToCart maneje las verificaciones y muestre las notificaciones
                aria-label="Agregar producto al carrito"
                title={
                  !selectedAtributo
                    ? "Selecciona un atributo"
                    : selectedAtributo.stock === 0 || producto.stock_total === 0
                      ? "Sin stock disponible"
                      : yaFueAgregado
                        ? "Producto ya está en el carrito"
                        : "Agregar al carrito"
                }
              >
                Agregar al Carrito
              </button>
            </div>
            {isModalOpen && (
              <CameraModal
                productImage={producto.imagen}
                onClose={closeModal}
              />
            )}
          </div>
        </div>
      </div>


      {/* Reviews Section */}
      <div className="reviews-section-product">
        <h2 className="reviews-title">Reseñas del Producto</h2>
        <div className="overall-rating">
          <h3>Calificación General: {overallRating.average_rating.toFixed(1)} / 5</h3>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(overallRating.average_rating) ? "star-filled" : "star-empty"}
              />
            ))}
            <span>({overallRating.total_reviews} reseñas)</span>
          </div>
        </div>
        {reviewsProducts.length > 0 ? (
          <div className="reviews-list">
            {reviewsProducts.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="review-user">{review.user}</span>
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? "star-filled" : "star-empty"}
                      />
                    ))}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                <span className="review-date">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">No hay reseñas para este producto.</p>
        )}

        <div className="review-form">
          <h3>Deja tu Reseña</h3>
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Calificación:</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={star <= newReview.rating ? "star-filled" : "star-empty"}
                      onClick={() => handleRatingChange(star)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Comentario:</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  placeholder="Escribe tu reseña aquí..."
                  required
                />
              </div>
              <button type="submit" className="submit-review-button">
                Enviar Reseña
              </button>
            </form>
          ) : (
            <p>
              <Link to="/login">Inicia sesión</Link> para dejar una reseña.
            </p>
          )}
        </div>
      </div>

      <div className="recommendations-section">
        <h2 className="recommendations-title">Productos Recomendados</h2>
        <div className="recommendations-grid">
          {productosRecomendados.length > 0 ? (
            productosRecomendados?.map((recomendado, index) => (
              <div
                key={recomendado.id}
                className="recommendation-card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <img
                  src={recomendado.imagen}
                  alt={recomendado.nombre}
                  className="recommendation-image"
                />
                <div className="recommendation-info">
                  <h3 className="recommendation-name">{recomendado.nombre}</h3>
                  <p className="recommendation-price">
                    ${recomendado.precio_final}
                  </p>
                  {recomendado.valor_en_puntos > 0 && (
                    <p className="recommendation-points">
                      <PiCoinsFill /> {Math.round(recomendado.valor_en_puntos, 2)} puntos
                    </p>
                  )}
                  <button
                    className="view-details-button"
                    onClick={() =>
                      navigate(`/productos-listado/producto/${recomendado.id}`)
                    }
                  >
                    Ver Detalle
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-recommendations">
              No hay productos relacionados disponibles.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductoDetalle;