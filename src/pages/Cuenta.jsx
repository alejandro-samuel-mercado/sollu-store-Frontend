import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../features/Auth/AuthContext";
import { useDatosPublic } from "../context/DatosPublicContext";
import { PiCoinsFill } from "react-icons/pi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import API from "../Api/index";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import Swal from "sweetalert2";
import { LoadingSpinner } from "../components/Windows/LoadingSpinner";
import { useActionsContext } from "../features/Actions/ActionsContext";

const Cuenta = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, user } = useAuthContext();
  const {
    puntosDeUsuario,
    comprasDeUsuario,
    productos,
    comentariosDeUsuario,
    miPerfil,
    barrios,
    recargarDatos,
    cargando,
  } = useDatosPublic();
  const { updateReview, deleteReview } = useActionsContext();

  console.log(miPerfil)

  const [avatar, setAvatar] = useState();
  const compras = comprasDeUsuario?.sort(
    (a, b) => new Date(b.fecha_venta) - new Date(a.fecha_venta)
  );
  const [openEdit, setOpenEdit] = useState(false);
  const [openEditReview, setOpenEditReview] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [formReviewData, setFormReviewData] = useState({
    comment: "",
    rating: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const comprasPerPage = 5;
  const totalPages = Math.ceil(compras?.length / comprasPerPage) || 1;

  const indexOfLastCompra = currentPage * comprasPerPage;
  const indexOfFirstCompra = indexOfLastCompra - comprasPerPage;
  const currentCompras = compras?.slice(indexOfFirstCompra, indexOfLastCompra);

  const [formData, setFormData] = useState({
    nombre_apellido: miPerfil?.nombre_apellido || "",
    dni: miPerfil?.dni || "",
    telefono: miPerfil?.telefono || "",
    imagen: miPerfil?.imagen || null,
    barrio: miPerfil?.barrio || "",
    pais: miPerfil?.pais || "",
    domicilio: miPerfil?.domicilio || "",
  });
  const [previewImage, setPreviewImage] = useState(miPerfil?.imagen || null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const barrioEncontrado = (miBarrio) => {
    const barrioEnc = barrios?.find((barrio) => barrio.id === miBarrio) || "";
    return barrioEnc.nombre;
  };

  const avataresLista = [
    "pixel-art-neutral",
    "thumbs",
    "initials",
    "identicon",
    "fun-emoji",
    "bottts-neutral",
    "bottts",
    "big-ears-neutral",
    "avataaars-neutral",
    "adventurer-neutral",
    "adventurer",
  ];

  useEffect(() => {
    const obtenerAvatarRandom = (indice) => {
      return avataresLista[indice];
    };
    const indice = Math.floor(Math.random() * avataresLista.length);
    setAvatar(obtenerAvatarRandom(indice));
  }, []);

  useEffect(() => {
    setFormData({
      nombre_apellido: miPerfil?.nombre_apellido || "",
      dni: miPerfil?.dni || "",
      telefono: miPerfil?.telefono || "",
      pais: miPerfil?.pais || "",
      barrio: miPerfil?.barrio || "",
      imagen: miPerfil?.imagen || null,
      domicilio: miPerfil?.domicilio || "",
    });
    setPreviewImage(miPerfil?.imagen || null);
  }, [miPerfil]);


  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imagen: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre_apellido", formData.nombre_apellido);
      formDataToSend.append("dni", formData.dni);
      formDataToSend.append("telefono", formData.telefono);
      formDataToSend.append("barrio", formData.barrio);
      formDataToSend.append("domicilio", formData.domicilio);
      formDataToSend.append("pais", formData.pais);
      if (formData.imagen instanceof File) {
        formDataToSend.append("imagen", formData.imagen);
      }
      const response = await API.patch(
        "perfilesUsuarios/editar-mi-perfil/",
        formDataToSend
      );
      recargarDatos();
      setOpenEdit(false);
      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Tus datos han sido guardados correctamente.",
      });
    } catch (error) {
      console.error("Error al editar perfil:", error.response?.data || error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "No se pudo actualizar el perfil.",
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleEditReviewClick = (review) => {
    setCurrentReview(review);
    setFormReviewData({ comment: review.comment, rating: review.rating });
    setOpenEditReview(true);
  };

  const handleDeleteReviewClick = async (reviewId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará tu reseña permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const success = await deleteReview(reviewId);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Reseña eliminada",
          text: "Tu reseña ha sido eliminada correctamente.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la reseña.",
        });
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentReview) return;

    const success = await updateReview(currentReview.id, formReviewData);
    if (success) {
      Swal.fire({
        icon: "success",
        title: "Reseña actualizada",
        text: "Tu reseña ha sido actualizada correctamente.",
      });
      setOpenEditReview(false);
      setCurrentReview(null);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la reseña.",
      });
    }
  };

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setFormReviewData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return <div>Cargando usuario...</div>;
  }

  return (
    <div className="mi-cuenta">
      <div className="container-fluid mi-cuenta-container">
        {cargando && <LoadingSpinner />}
        <div className="row">
          <div className="col-md-3 left p-5 bg-light">
            <div className="text-center">
              <img
                src={miPerfil.imagen || `https://api.dicebear.com/9.x/${avatar}/svg`}
                alt="Avatar"
                className="img-fluid rounded-circle mb-3"
                style={{ width: "150px", height: "150px" }}
              />
              <h5>{user.username}</h5>
              <p className="text-muted">
                Puntos: <PiCoinsFill /> {puntosDeUsuario?.puntos_acumulados}
              </p>
            </div>
            <button
              className="btn btn-danger w-100 mt-3 btn-close-session"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>

          <div className="col-md-9 right p-4">
            <h2 className="mb-4">Perfil</h2>
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">
                  {miPerfil?.nombre_apellido || ""}
                </h5>
                <h6 className="card-title">DNI: {miPerfil?.dni || ""}</h6>
                <h6 className="card-title">
                  Teléfono: {miPerfil?.telefono || ""}
                </h6>
                <h6 className="card-title">
                  País: {miPerfil?.pais || ""}
                </h6>
                <h6 className="card-title">
                  Barrio/Ciudad: {barrioEncontrado(miPerfil?.barrio)}
                </h6>
                <h6 className="card-title">
                  Domicilio: {miPerfil?.domicilio || ""}
                </h6>
              </div>
              <button
                type="button"
                className="btn-edit-perfil"
                onClick={() => setOpenEdit(true)}
              >
                Editar datos
              </button>
            </div>

            <h2 className="mb-4">Historial de Compras</h2>
            {compras?.length > 0 ? (
              <>
                {currentCompras?.map((compra) => (
                  <div key={compra.id} className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">
                        Compra del{" "}
                        {new Date(compra.fecha_venta).toLocaleDateString()}
                      </h5>
                      <p className="card-text">
                        <strong>Total:</strong> ${compra.precio_total}
                      </p>
                      <ul className="list-group list-group-flush">
                        {compra.detalles?.map((detalle) => {
                          const producto = productos?.find(
                            (producto) => producto.id === detalle.producto
                          );
                          return (
                            <li key={detalle.id} className="list-group-item">
                              {producto?.nombre} - {detalle.cantidad} x $
                              {detalle.precio_unitario}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ))}
                {/* Controles de paginación */}
                <div className="pagination-controls">
                  <button
                    className="btn btn-secondary"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span className="pagination-info">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    className="btn btn-secondary"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              </>
            ) : (
              <p>No tienes compras recientes.</p>
            )}
            <h2 className="mt-5 mb-4">Gestionar Mis Reseñas</h2>
            {comentariosDeUsuario?.length > 0 ? (
              <div className="manage-reviews-section">
                {comentariosDeUsuario.map((review) => (
                  <div
                    key={review.id}
                    className="review-card manage-review-card"
                  >
                    <div className="review-header">
                      <img
                        src={`https://api.dicebear.com/9.x/${avatar}/svg`}
                        alt="Avatar"
                        className="review-avatar"
                      />
                      <div className="review-info">
                        <div className="rating">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                        <p className="review-status">
                          <strong>Estado:</strong>{" "}
                          {review.approved
                            ? "Aprobada"
                            : "Pendiente de aprobación"}
                        </p>
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <p className="review-date">
                      <strong>Fecha:</strong>{" "}
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                    <div className="review-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditReviewClick(review)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteReviewClick(review.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tienes reseñas realizadas.</p>
            )}

            {/* Sección de Reseñas Aprobadas (Slider) */}
            <h2 className="mt-5 mb-4">Tus Reseñas Aprobadas</h2>
            <div className="review-section">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                slidesPerView={2}
                slidesPerGroup={2}
                autoplay={{
                  delay: 6000,
                  pauseOnMouseEnter: true,
                  disableOnInteraction: false,
                }}
                loop={true}
                breakpoints={{
                  400: { slidesPerView: 1, slidesPerGroup: 1 },
                  640: { slidesPerView: 1, slidesPerGroup: 1 },
                  768: { slidesPerView: 1, slidesPerGroup: 1 },
                  1024: { slidesPerView: 2, slidesPerGroup: 2 },
                }}
              >
                {comentariosDeUsuario?.length > 0 ? (
                  comentariosDeUsuario
                    .filter((review) => review.approved)
                    .map((review) => (
                      <SwiperSlide key={review.id}>
                        <div className="review-card">
                          <img
                            src={`https://api.dicebear.com/9.x/${avatar}/svg`}
                            alt="Avatar"
                          />
                          <div className="rating">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                          <p>{review.comment}</p>
                        </div>
                      </SwiperSlide>
                    ))
                ) : (
                  <p className="no-recommendations">
                    No hay comentarios aprobados.
                  </p>
                )}
              </Swiper>
            </div>

            {/* Sección de Recomendaciones */}
            <h2 className="mt-5 mb-4">Recomendaciones para Ti</h2>
            {/* Sección de recomendaciones */}
            <div className="recommendations-section">
              <div className="recommendations-grid">
                {productos?.length > 0 ? (
                  productos?.slice(0, 3).map((recomendado, index) => (
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
                        <h3 className="recommendation-name">
                          {recomendado.nombre}
                        </h3>
                        <p className="recommendation-price">
                          ${recomendado.precio_final}
                        </p>
                        {recomendado.valor_en_puntos > 0 && (
                          <p className="recommendation-points">
                            <PiCoinsFill />{" "}
                            {Math.round(recomendado.valor_en_puntos, 2)} puntos
                          </p>
                        )}
                        <button
                          className="view-details-button"
                          onClick={() =>
                            navigate(
                              `/productos-listado/producto/${recomendado.id}`
                            )
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
          </div>
        </div>
      </div>

      {openEdit && (
        <div className="modal-overlay">
          <div className="modal-edit-perfil">
            <div className="container-edit-perfil">
              <button
                onClick={() => setOpenEdit(false)}
                className="btn-closed-perfil"
              >
                X
              </button>
              <h3>Editar Perfil</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group image-container">
                  <div className="avatar-wrapper">
                    <img
                      src={previewImage || `https://api.dicebear.com/9.x/${avatar}/svg`}
                      alt="Avatar"
                      className="avatar-image"
                    />
                    <label htmlFor="image-upload" className="edit-image-button">
                      Editar
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Nombre y Apellido</label>
                  <input
                    type="text"
                    name="nombre_apellido"
                    value={formData.nombre_apellido}
                    onChange={handleInputChange}
                    placeholder="Nombre y Apellido"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>DNI</label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    placeholder="DNI sin puntos"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Ej. +5412345678"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Pais</label>
                  <input
                    type="text"
                    name="pais"
                    value={formData.pais}
                    onChange={handleInputChange}
                    placeholder="Ej. Argentina"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Barrio/Ciudad</label>
                  <select
                    style={{ paddingTop: "3px" }}
                    name="barrio"
                    value={formData.barrio}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Selecciona un barrio</option>
                    {barrios?.map((barrio) => (
                      <option key={barrio.id} value={barrio.id}>
                        {barrio.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Domicilio</label>
                  <textarea
                    name="domicilio"
                    value={formData.domicilio}
                    onChange={handleInputChange}
                    placeholder="Domicilio"
                    className="form-control"
                    rows="3"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3 btn-save-changes"
                >
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Modal para editar reseñas */}
      {openEditReview && (
        <div className="modal-overlay">
          <div className="modal-edit-perfil">
            <button
              onClick={() => setOpenEditReview(false)}
              className="btn-closed-perfil"
            >
              X
            </button>
            <h3>Editar Reseña</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Comentario</label>
                <textarea
                  name="comment"
                  value={formReviewData.comment}
                  onChange={handleReviewInputChange}
                  placeholder="Escribe tu comentario..."
                  className="form-control"
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Calificación (1-5)</label>
                <input
                  type="number"
                  name="rating"
                  value={formReviewData.rating}
                  onChange={handleReviewInputChange}
                  min="1"
                  max="5"
                  className="form-control"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3 btn-save-changes"
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cuenta;
