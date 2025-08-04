import React, { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
} from "react-icons/fa";
import { motion } from "framer-motion";
import API from "../Api/index";
import { SuccessNotification } from "../components/Windows/SuccessNotification";
import { LoadingSpinner } from "../components/Windows/LoadingSpinner";
import { useDatosPublic } from "../context/DatosPublicContext";



const Contacto = () => {
  const { informacionWeb } = useDatosPublic()
  const horarioMañana = informacionWeb?.find((info) => info.nombre.toLowerCase() === "horarios_mañana")
  const horarioTarde = informacionWeb?.find((info) => info.nombre.toLowerCase() === "horarios_tarde")
  const email = informacionWeb?.find((info) => info.nombre.toLowerCase() === "correo_sitio")
  const telefono = informacionWeb?.find((info) => info.nombre.toLowerCase() === "telefono")
  const ciudad = informacionWeb?.find((info) => info.nombre.toLowerCase() === "ciudad")
  const direccion = informacionWeb?.find((info) => info.nombre.toLowerCase() === "direccion_local")
  const ubicacion = informacionWeb?.find((info) => info.nombre.toLowerCase() === "ubicacion_en_mapa")
  const instagram = informacionWeb?.find((info) => info.nombre.toLowerCase() === "instagram")
  const facebook = informacionWeb?.find((info) => info.nombre.toLowerCase() === "facebook")
  const twitter = informacionWeb?.find((info) => info.nombre.toLowerCase() === "twitter")


  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const response = await API.post("enviar-mail/", formData);
      if (response) {
        setIsLoading(false)
        setIsSubmitted(true);
        setFormData({
          nombre: "",
          email: "",
          mensaje: "",
        });
      }
    } catch (error) {
      setIsLoading(false)
      console.error(error);
    } finally {
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="contacto-container">
      <Player
        src="static/contact.json"
        className="contacto-animation"
        loop
        autoplay
        onError={(error) => console.error("Error en Lottie Player:", error)}
      />

      <motion.div
        className="contacto-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="contacto-header" variants={itemVariants}>
          <h1 className="contacto-title">Contáctanos</h1>
          <p className="contacto-subtitle">
            Estamos aquí para ayudarte con cualquier consulta. ¡Hablemos!
          </p>
        </motion.div>

        <motion.div className="contact-info" variants={itemVariants}>
          <div className="info-item">
            <FaPhone className="info-icon" />
            <p>
              <strong>Teléfono:</strong> <br /> {telefono?.contenido || ""}
            </p>
          </div>
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <p style={{ width: "80%", overflowWrap: "break-word", inlineSize: "80%" }}>
              <strong>Email:</strong> <br />
              {email?.contenido || ""}
            </p>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <p>
              <strong>Dirección:</strong> <br /> {direccion?.contenido || ""}, {ciudad?.contenido || ""}
            </p>
          </div>
          <div className="info-item">
            <FaClock className="info-icon" />
            <p>
              <strong>Horario:</strong>
              <br /> Lunes a Viernes
              <br />{horarioMañana?.contenido}
              <br />{horarioTarde?.contenido}
            </p>
          </div>
        </motion.div>

        <motion.div className="contact-form-section" variants={itemVariants}>
          <h2 className="form-title">Envíanos tu mensaje</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <motion.input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
              className="form-input"
              whileFocus={{ scale: 1.02, borderColor: "#50c878" }}
            />
            <motion.input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Tu email"
              required
              className="form-input"
              whileFocus={{ scale: 1.02, borderColor: "#50c878" }}
            />
            <motion.textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              placeholder="Tu mensaje"
              required
              className="form-textarea"
              whileFocus={{ scale: 1.02, borderColor: "#50c878" }}
            />
            <motion.button
              type="submit"
              className="form-submit"
              whileHover={{ scale: 1.1, backgroundColor: "#2e8b57" }}
              whileTap={{ scale: 0.95 }}
            >
              Enviar
            </motion.button>
          </form>
        </motion.div>

        <motion.div className="map-section" variants={itemVariants}>
          <h2 className="map-title">Nuestra ubicación</h2>
          <iframe
            src={ubicacion?.contenido}
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "15px" }}
            allowFullScreen=""
            loading="lazy"
            title="Ubicación del local"
          />
        </motion.div>

        <motion.div className="social-section" variants={itemVariants}>
          <h2 className="social-title">Síguenos</h2>
          <div className="social-links">
            <motion.a
              href={facebook?.contenido}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/667px-2023_Facebook_icon.svg.png"
                alt="Facebook"
                className="social-icon"
              />
            </motion.a>
            <motion.a
              href={instagram?.contenido}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: -5 }}
            >
              <img
                src="https://images.vexels.com/media/users/3/137380/isolated/lists/1b2ca367caa7eff8b45c09ec09b44c16-instagram-icon-logo.png"
                alt="Instagram"
                className="social-icon"
              />
            </motion.a>
            <motion.a
              href={twitter?.contenido}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <img
                src="https://images.freeimages.com/image/large-previews/f35/x-twitter-logo-on-black-circle-5694247.png?h=350"
                alt="Twitter"
                className="social-icon"
              />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="https://wa.me/5491112345678"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 1.5 } }}
        whileHover={{ scale: 1.15, backgroundColor: "#2e8b57" }}
        whileTap={{ scale: 0.9 }}
      >
        <FaWhatsapp /> Chatear por WhatsApp
      </motion.a>
      {isLoading && <LoadingSpinner />}
      {!isLoading && isSubmitted && (
        <SuccessNotification
          message="Mensaje enviado con éxito"
          onClose={() => setIsSubmitted(false)}
        />
      )}
    </div>
  );
};

export default Contacto;
