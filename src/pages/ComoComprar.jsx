import React from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaCartPlus,
  FaUser,
  FaHeadset,
  FaTruck,
  FaCreditCard,
  FaFileDownload,
  FaStore,
  FaEnvelope,
  FaExclamationTriangle,
} from "react-icons/fa";

const ComoComprar = () => {

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

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
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
    <div className="como-comprar-container">
      {/* Hero Section */}
      <motion.div
        className="hero-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="hero-title" variants={stepVariants}>
          ¿Cómo Comprar en Nuestra Tienda?
        </motion.h1>
        <motion.p className="hero-subtitle" variants={stepVariants}>
          Sigue estos sencillos pasos para realizar tu compra de forma rápida y
          segura.
        </motion.p>
      </motion.div>

      {/* Pasos para Comprar */}
      <motion.section
        className="steps-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Paso 1: Buscar Productos */}
        <motion.div className="step" variants={stepVariants}>
          <div className="step-number">1</div>
          <motion.div className="step-icon" variants={iconVariants}>
            <FaSearch />
          </motion.div>
          <h2 className="step-title">Busca tus productos</h2>
          <p className="step-description">
            Explora nuestro catálogo usando la barra de búsqueda o navegando por
            las categorías. Filtra por precio, categoría o popularidad para
            encontrar exactamente lo que necesitas.
          </p>
        </motion.div>

        {/* Paso 2: Añadir al Carrito */}
        <motion.div className="step" variants={stepVariants}>
          <div className="step-number">2</div>
          <motion.div className="step-icon" variants={iconVariants}>
            <FaCartPlus />
          </motion.div>
          <h2 className="step-title">Añade productos al carrito</h2>
          <p className="step-description">
            Haz clic en el producto que te interese y selecciona "Añadir al
            Carrito". Puedes ajustar la cantidad o eliminar productos desde el
            carrito antes de proceder al pago.
          </p>
        </motion.div>

        {/* Paso 3: Completar Formulario de Compra */}
        <motion.div className="step" variants={stepVariants}>
          <div className="step-number">3</div>
          <motion.div className="step-icon" variants={iconVariants}>
            <FaUser />
          </motion.div>
          <h2 className="step-title">Completa el formulario de compra</h2>
          <p className="step-description">
            Haz clic en "Finalizar Compra" desde el carrito. Inicia sesión en tu
            cuenta para que tus datos personales (nombre, email, teléfono,
            domicilio, etc.) se autocompleten automáticamente. Solo necesitarás
            ingresar los datos de entrega si eliges envío a domicilio.
          </p>
        </motion.div>

        {/* Paso 4: Seleccionar Método de Entrega */}
        <motion.div className="step" variants={stepVariants}>
          <div className="step-number">4</div>
          <motion.div className="step-icon" variants={iconVariants}>
            <FaTruck />
          </motion.div>
          <h2 className="step-title">Elige tu método de entrega</h2>
          <p className="step-description">
            Tienes dos opciones: <br />-{" "}
            <strong>Retiro en local o centro de comercio</strong>: Te
            mostraremos la dirección del local central y los horarios. <br />-{" "}
            <strong>Envío a domicilio</strong>: Si iniciaste sesión aparecerán
            tus datos correspondientes a tu domicilio. Puedes proceder a
            seleccionar el método de envío y la fecha de entrega(en caso de
            envío a domicilio). Te mostraremos el costo total incluyendo el
            envío y otras consideraciones en tales casos.
          </p>
        </motion.div>

        {/* Paso 5: Realizar el Pago */}
        <motion.div className="step" variants={stepVariants}>
          <div className="step-number">5</div>
          <motion.div className="step-icon" variants={iconVariants}>
            <FaCreditCard />
          </motion.div>
          <h2 className="step-title">Realiza el pago</h2>
          <p className="step-description">
            Selecciona tu método de pago preferido:{" "}
            <strong>Mercado Pago</strong> o <strong>PayPal</strong>. Serás
            redirigido a la plataforma de pago para completar la transacción de
            forma segura. Asegúrate de verificar el monto total antes de
            confirmar.
          </p>
        </motion.div>

        {/* Paso 6: Descargar Comprobante */}
        <motion.div className="step" variants={stepVariants}>
          <div className="step-number">6</div>
          <motion.div className="step-icon" variants={iconVariants}>
            <FaFileDownload />
          </motion.div>
          <h2 className="step-title">Descarga tu comprobante</h2>
          <p className="step-description">
            Una vez confirmado el pago, se generará un comprobante de compra en
            formato PDF que podrás descargar automáticamente. Al mismo tiempo,
            enviaremos una copia del comprobante a tu correo electrónico
            registrado y a nuestro correo oficial. Este comprobante es tu prueba
            de compra y será esencial en caso de cualquier inconveniente.
          </p>
          <motion.div className="email-info" whileHover={{ scale: 1.05 }}>
            <FaEnvelope className="email-icon" />
            <span>¡GUARDA BIEN TU COMPROBANTE!</span>
          </motion.div>
        </motion.div>

        {/* Paso 7: Retirar o Recibir el Pedido */}
        <motion.div className="step" variants={stepVariants}>
          <div className="step-number">7</div>
          <motion.div className="step-icon" variants={iconVariants}>
            <FaStore />
          </motion.div>
          <h2 className="step-title">Retira o recibe tu pedido</h2>
          <p className="step-description">
            - <strong>Retiro en local/centro</strong>: Dirígete al punto de
            retiro seleccionado el comprobante (digital o impreso) y un
            documento de identidad.
            <br />- <strong>Envío a domicilio</strong>: Recibirás tu pedido en
            la dirección indicada dentro del plazo estimado.
          </p>
        </motion.div>
      </motion.section>

      {/* Notas Importantes */}
      <motion.section
        className="notes-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="notes-content" variants={stepVariants}>
          <h2 className="notes-title">Notas importantes</h2>
          <div className="note-item">
            <motion.div className="note-icon" variants={iconVariants}>
              <FaExclamationTriangle />
            </motion.div>
            <p>
              <strong>Guarda tu comprobante:</strong> El comprobante de compra
              es fundamental para validar tu pedido. Úsalo para cualquier
              consulta, cambio o devolución. Si no recibes el correo, revisa tu
              carpeta de spam o contáctanos.
            </p>
          </div>
          <div className="note-item">
            <motion.div className="note-icon" variants={iconVariants}>
              <FaHeadset />
            </motion.div>
            <p>
              <strong>¿Problemas con tu compra?</strong> Si tienes algún
              inconveniente, contáctanos inmediatamente a través de nuestro
              soporte (tienda@tienda.com o WhatsApp). Necesitaremos tu
              comprobante para procesar cualquier solicitud.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.div
        className="footer-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.p variants={stepVariants}>
          ¡Estamos aquí para ayudarte en cada paso! Si tienes dudas,
          contáctanos.
        </motion.p>
        <motion.a
          href="https://wa.me/5491112345678"
          target="_blank"
          rel="noopener noreferrer"
          className="support-button"
          whileHover={{ scale: 1.1, backgroundColor: "#2e8b57" }}
          whileTap={{ scale: 0.95 }}
        >
          Contactar Soporte
        </motion.a>
      </motion.div>
    </div>
  );
};

export default ComoComprar;
