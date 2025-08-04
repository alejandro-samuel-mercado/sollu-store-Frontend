import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaCreditCard,
  FaGift,
  FaTruck,
  FaUndo,
  FaDatabase,
  FaBan,
  FaTools,
  FaFileInvoiceDollar,
  FaSignOutAlt,
  FaShieldAlt,
  FaCookieBite,
  FaUserShield,
  FaGlobe,
  FaEnvelope,
} from "react-icons/fa";


const Politicas = () => {

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

  const sectionVariants = {
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
    <div className="politicas-container">
      {/* Hero Section */}
      <motion.div
        className="hero-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="hero-title" variants={sectionVariants}>
          Políticas de Privacidad <br /> Términos y Condiciones
        </motion.h1>
        <motion.p className="hero-subtitle" variants={sectionVariants}>
          Lea cuidadosamente los términos que rigen tu uso de nuestro sitio y la
          protección de tus datos.
        </motion.p>
      </motion.div>

      {/* Términos y Condiciones Generales */}
      <motion.section
        className="terms-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="section-title" variants={sectionVariants}>
          Términos y Condiciones Generales
        </motion.h2>
        <motion.p className="intro-text" variants={sectionVariants}>
          Este contrato describe los términos y condiciones generales aplicables
          al acceso y uso de los servicios . Cualquier persona que desee acceder
          y/o usar el Sitio o los Servicios (los “Usuarios”) podrá hacerlo
          sujetándose a estos Términos y Condiciones Generales, junto con todas
          las demás políticas y condiciones que rigen al Sitio y que son
          incorporados al presente por referencia. En consecuencia, todas las
          visitas y cada uno de los contratos y transacciones que se realicen en
          este Sitio, como asimismo sus efectos jurídicos, quedarán regidos por
          estos Términos y Condiciones Generales y sometidos a la legislación
          aplicable en la República Argentina. Los Términos y Condiciones
          Generales se aplicarán y se entenderán como formando parte de cada uno
          de los actos y contratos que se ejecuten o celebren mediante los
          sistemas de oferta y comercialización comprendidos en el Sitio entre
          los Usuarios y Nuestro Sitio, y por cualquiera de las otras sociedades
          o empresas que sean filiales, vinculadas, controladas y/o controlantes
          del mismo, a las cuales se las denominará en adelante también en forma
          indistinta como “las Empresas”, o bien “la Empresa Oferente”, el
          “Proveedor” o la “Empresa Proveedora”, según convenga al sentido del
          texto.{" "}
          <strong>
            CUALQUIER PERSONA QUE NO ACEPTE ESTOS TÉRMINOS Y CONDICIONES
            GENERALES, LOS CUALES TIENEN UN CARÁCTER OBLIGATORIO Y VINCULANTE,
            DEBERÁ ABSTENERSE DE UTILIZAR EL SITIO Y/O LOS SERVICIOS.
          </strong>{" "}
          En forma previa a su registración y a cada contratación, el Usuario
          deberá leer, entender y aceptar todos los términos y condiciones
          establecidos en estos Términos y Condiciones Generales, así como sus
          modificaciones. Si el Usuario utiliza este Sitio significa que ha
          aceptado plenamente los Términos y Condiciones Generales y las
          políticas obligándose a cumplir expresamente con los mismos.
        </motion.p>

        {/* Capacidad */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaUser />
          </motion.div>
          <h3 className="term-title">Capacidad</h3>
          <p className="term-text">
            Los Usuarios deben tener capacidad legal para contratar y realizar
            operaciones en el Sitio. No podrán utilizar los Servicios personas
            menores de 18 años o quienes estén incapacitados legalmente, salvo
            que cuenten con la autorización de sus representantes legales.
          </p>
        </motion.div>

        {/* Registración */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaUser />
          </motion.div>
          <h3 className="term-title">Registración</h3>
          <p className="term-text">
            La registración a nuestro Sitio es gratuita. Al adquirir un producto
            o servicio, el Usuario deberá pagar el precio publicado y, de
            corresponder, los gastos de envío y entrega. El Usuario debe
            proporcionar datos veraces y actualizados durante el registro.
          </p>
        </motion.div>

        {/* Privacidad de la Información */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaLock />
          </motion.div>
          <h3 className="term-title">Privacidad de la Información</h3>
          <p className="term-text">
            Protegemos la información personal de los Usuarios conforme a las
            Políticas de Privacidad detalladas a continuación. Toda la
            información será tratada con confidencialidad y utilizada únicamente
            para los fines establecidos.
          </p>
        </motion.div>

        {/* Modificaciones de los Términos y Condiciones Generales */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaFileInvoiceDollar />
          </motion.div>
          <h3 className="term-title">
            Modificaciones de los Términos y Condiciones Generales
          </h3>
          <p className="term-text">
            Se reserva el derecho de modificar estos Términos y Condiciones en
            cualquier momento. Las modificaciones serán notificadas con al menos
            15 días de antelación a través del Sitio o por email, y entrarán en
            vigor tras su publicación.
          </p>
        </motion.div>

        {/* Medios de Pago */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaCreditCard />
          </motion.div>
          <h3 className="term-title">Medios de Pago</h3>
          <p className="term-text">
            Los Usuarios pueden pagar mediante tarjeta de crédito/débito siempre
            y cuando la compra se realice de manera online. No se aceptan pagos
            en cuotas a través del Sitio.
          </p>
        </motion.div>

        {/* Promociones */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaGift />
          </motion.div>
          <h3 className="term-title">Promociones</h3>
          <p className="term-text">
            Las promociones son válidas mientras se indique en el Sitio y están
            sujetas a disponibilidad. No se acumulan con otras ofertas a menos
            que se especifique lo contrario.
          </p>
        </motion.div>

        {/* Despacho de los Productos */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaTruck />
          </motion.div>
          <h3 className="term-title">Despacho de los Productos</h3>
          <p className="term-text">
            Los productos serán despachados según el método de entrega elegido
            (retiro en local o envío a domicilio) dentro de los plazos estimados
            indicados en el Sitio.
          </p>
        </motion.div>

        {/* Procedimiento de Cambios y Devoluciones */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaUndo />
          </motion.div>
          <h3 className="term-title">
            Procedimiento de Cambios y Devoluciones
          </h3>
          <p className="term-text">
            Los cambios y devoluciones se aceptan dentro de los 10 días
            posteriores a la compra, presentando el comprobante original y el
            producto en perfectas condiciones. Consulta los detalles en el
            Sitio.
          </p>
        </motion.div>

        {/* Uso de los Datos Personales */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaDatabase />
          </motion.div>
          <h3 className="term-title">Uso de los Datos Personales</h3>
          <p className="term-text">
            Los datos personales serán utilizados para procesar compras, enviar
            notificaciones y mejorar la experiencia del usuario, siempre
            respetando las leyes de protección de datos.
          </p>
        </motion.div>

        {/* Violaciones del Sistema o Bases de Datos */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaBan />
          </motion.div>
          <h3 className="term-title">
            Violaciones del Sistema o Bases de Datos
          </h3>
          <p className="term-text">
            Cualquier intento de violar la seguridad del Sitio será considerado
            un delito y será denunciado ante las autoridades competentes.
          </p>
        </motion.div>

        {/* Sanciones. Suspensión de Operaciones */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaBan />
          </motion.div>
          <h3 className="term-title">Sanciones. Suspensión de Operaciones</h3>
          <p className="term-text">
            Se procederá a suspender o cancelar la cuenta de un Usuario que
            incumpla estos Términos sin previo aviso, notificando las razones de
            la sanción.
          </p>
        </motion.div>

        {/* Fallas en el Sistema */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaTools />
          </motion.div>
          <h3 className="term-title">Fallas en el Sistema</h3>
          <p className="term-text">
            No asumimos la total responsabilidad por fallas técnicas o
            interrupciones del Sitio debido a causas ajenas a su control, pero
            nos comprometemos a restablecer el servicio lo antes posible.
          </p>
        </motion.div>

        {/* Tarifas y Facturación */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaFileInvoiceDollar />
          </motion.div>
          <h3 className="term-title">Tarifas y Facturación</h3>
          <p className="term-text">
            Los precios incluyen impuestos aplicables. Los gastos de envío se
            detallan al finalizar la compra y son responsabilidad del Usuario.
          </p>
        </motion.div>

        {/* Terminación */}
        <motion.div className="term-item" variants={sectionVariants}>
          <motion.div className="term-icon" variants={iconVariants}>
            <FaSignOutAlt />
          </motion.div>
          <h3 className="term-title">Terminación</h3>
          <p className="term-text">
            Se procederá a bloquear el acceso al Sitio en caso de incumplimiento
            grave o por decisión unilateral, notificando al Usuario con
            antelación razonable.
          </p>
        </motion.div>
      </motion.section>

      {/* Políticas de Privacidad */}
      <motion.section
        className="privacy-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="section-title" variants={sectionVariants}>
          Políticas de Privacidad
        </motion.h2>
        <motion.div className="privacy-item" variants={sectionVariants}>
          <motion.div className="privacy-icon" variants={iconVariants}>
            <FaShieldAlt />
          </motion.div>
          <h3 className="privacy-title">Recolección y Uso de Datos</h3>
          <p className="privacy-text">
            Recolectamos datos personales como nombre, email y dirección para
            procesar compras y mejorar nuestro servicio. Estos datos no serán
            compartidos con terceros sin tu consentimiento, salvo por
            obligaciones legales.
          </p>
        </motion.div>
        <motion.div className="privacy-item" variants={sectionVariants}>
          <motion.div className="privacy-icon" variants={iconVariants}>
            <FaLock />
          </motion.div>
          <h3 className="privacy-title">Seguridad de la Información</h3>
          <p className="privacy-text">
            Utilizamos medidas de seguridad como cifrado SSL para proteger tus
            datos. Sin embargo, no garantizamos seguridad absoluta contra
            accesos no autorizados.
          </p>
        </motion.div>
        <motion.div className="privacy-item" variants={sectionVariants}>
          <motion.div className="privacy-icon" variants={iconVariants}>
            <FaCookieBite />
          </motion.div>
          <h3 className="privacy-title">
            Cookies y Tecnologías de Seguimiento
          </h3>
          <p className="privacy-text">
            Usamos cookies para personalizar tu experiencia y analizar el uso
            del Sitio. Puedes gestionarlas desde la configuración de tu
            navegador.
          </p>
        </motion.div>
        <motion.div className="privacy-item" variants={sectionVariants}>
          <motion.div className="privacy-icon" variants={iconVariants}>
            <FaUserShield />
          </motion.div>
          <h3 className="privacy-title">
            Derechos del Usuario sobre sus Datos
          </h3>
          <p className="privacy-text">
            Tienes derecho a acceder, rectificar, eliminar o limitar el uso de
            tus datos personales. Para ejercer estos derechos, contáctanos a
            nuestro correo oficial.
          </p>
        </motion.div>
        <motion.div className="privacy-item" variants={sectionVariants}>
          <motion.div className="privacy-icon" variants={iconVariants}>
            <FaGlobe />
          </motion.div>
          <h3 className="privacy-title">
            Transferencia Internacional de Datos
          </h3>
          <p className="privacy-text">
            Tus datos pueden ser transferidos a servidores internacionales para
            procesar pagos (ej. PayPal). Estas transferencias cumplen con las
            leyes aplicables.
          </p>
        </motion.div>
        <motion.div className="privacy-item" variants={sectionVariants}>
          <motion.div className="privacy-icon" variants={iconVariants}>
            <FaEnvelope />
          </motion.div>
          <h3 className="privacy-title">
            Contacto para Consultas de Privacidad
          </h3>
          <p className="privacy-text">
            Para cualquier duda sobre tus datos, escribe a{" "}
            <a href="mailto:alesamu.am@gmail.com">alesamu.am@gmail.com</a> o
            llama al +54 388 3118692.
          </p>
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
        <motion.p variants={sectionVariants}>
          Te recomendamos guardar una copia de estas Políticas y Términos. Para
          más información, contáctanos.
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

export default Politicas;
