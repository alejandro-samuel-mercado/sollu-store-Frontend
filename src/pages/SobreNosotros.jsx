import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaShippingFast,
  FaStar,
  FaHeadset,
  FaLock,
} from "react-icons/fa";

const SobreNosotros = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { duration: 0.5, type: "spring" },
    },
  };

  return (
    <div className="sobre-nosotros-container">
      {/* Hero Section */}
      <motion.div
        className="hero-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-content" variants={itemVariants}>
          <h1 className="hero-title">Sobre Nosotros</h1>
          <p className="hero-subtitle">
            Descubre quiénes somos y por qué somos tu mejor opción para compras
            online.
          </p>
        </motion.div>
        <Player
          src="static/online-shop.json"
          className="hero-animation"
          loop
          autoplay
          onError={(error) => console.error("Error en Lottie Hero:", error)}
        />
      </motion.div>

      {/* Importancia del Comercio Electrónico */}
      <motion.section
        className="ecommerce-importance"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-content" variants={itemVariants}>
          <h2 className="section-title">La importancia de una tienda online</h2>
          <p className="section-text">
            En la era digital, una tienda online te permite comprar desde la
            comodidad de tu hogar, con acceso a una amplia variedad de productos
            y entregas rápidas. Nosotros estamos aquí para hacer que tu
            experiencia de compra sea fácil, segura y divertida.
          </p>
        </motion.div>
        <Player
          src="static/shopping-cart.json"
          className="section-animation"
          loop
          autoplay
          onError={(error) =>
            console.error("Error en Lottie Ecommerce:", error)
          }
        />
      </motion.section>

      {/* Funcionamiento del Sitio */}
      <motion.section
        className="site-functionality"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-content" variants={itemVariants}>
          <h2 className="section-title">¿Cómo funciona nuestro sitio?</h2>
          <p className="section-text">
            1. Explora nuestro catálogo y añade productos al carrito. <br />
            2. Ingresa tus datos de envío y pago de forma segura. <br />
            3. Recibe tu pedido en la puerta de tu casa en pocos días.
          </p>
        </motion.div>
        <Player
          src="static/purchase-flow.json"
          className="section-animation"
          loop
          autoplay
          onError={(error) => console.error("Error en Lottie Purchase:", error)}
        />
      </motion.section>

      {/* Objetivos de la Tienda */}
      <motion.section
        className="objectives-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="section-title" variants={itemVariants}>
          Nuestros objetivos
        </motion.h2>
        <div className="objectives-list">
          <motion.div className="objective-item" variants={itemVariants}>
            <motion.div variants={iconVariants}>
              <FaStar className="objective-icon" />
            </motion.div>
            <p>Ofrecer productos de alta calidad a precios competitivos.</p>
          </motion.div>
          <motion.div className="objective-item" variants={itemVariants}>
            <motion.div variants={iconVariants}>
              <FaHeadset className="objective-icon" />
            </motion.div>
            <p>Brindar un soporte al cliente excepcional 24/7.</p>
          </motion.div>
          <motion.div className="objective-item" variants={itemVariants}>
            <motion.div variants={iconVariants}>
              <FaShippingFast className="objective-icon" />
            </motion.div>
            <p>Entregar tus pedidos de forma rápida y segura.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Por qué Elegirnos */}
      <motion.section
        className="why-choose-us"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="section-title" variants={itemVariants}>
          ¿Por qué elegirnos?
        </motion.h2>
        <div className="reasons-list">
          <motion.div className="reason-item" variants={itemVariants}>
            <motion.div className="reason-icon" variants={iconVariants}>
              <FaShoppingCart />
            </motion.div>
            <h3>Variedad</h3>
            <p>Amplio catálogo de productos para todos los gustos.</p>
          </motion.div>
          <motion.div className="reason-item" variants={itemVariants}>
            <motion.div className="reason-icon" variants={iconVariants}>
              <FaLock />
            </motion.div>
            <h3>Seguridad</h3>
            <p>Pagos seguros y protección de datos garantizada.</p>
          </motion.div>
          <motion.div className="reason-item" variants={itemVariants}>
            <motion.div className="reason-icon" variants={iconVariants}>
              <FaShippingFast />
            </motion.div>
            <h3>Envíos rápidos</h3>
            <p>Entregas en tiempo récord a todo el país.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer Decorativo */}
      <motion.div
        className="footer-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.p variants={itemVariants}>
          ¡Gracias por confiar en nosotros! Estamos emocionados de acompañarte
          en tu experiencia de compra.
        </motion.p>
        <Player
          src="static/thank-you.json"
          className="footer-animation"
          loop
          autoplay
          onError={(error) => console.error("Error en Lottie Footer:", error)}
        />
      </motion.div>
    </div>
  );
};

export default SobreNosotros;
