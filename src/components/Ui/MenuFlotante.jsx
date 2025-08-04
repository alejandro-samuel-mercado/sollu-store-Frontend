import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillMuted } from "react-icons/ai";
import { IoVolumeMuteSharp } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { BsQrCode } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import "./MenuFlotante.css";
import { useActionsContext } from "../../features/Actions/ActionsContext";
import { useDatosPublicComponentes } from "../../features/ControlComponents/ControladorComponentesContext";

import { useLocation } from "react-router-dom";

export const MenuFlotante = () => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showButton] = useState(true);
  const [sonidoOn, setSonidoOn] = useState(false)
  const {
    isMuted,
    toggleMute,
    toggleLink,
    toggleQRScanner,
    showQRScanner,
    startQRScan,
    stopQRScan,
  } = useActionsContext();
  const { componentes } = useDatosPublicComponentes();
  useEffect(() => {
    if (!componentes) return
    setSonidoOn(componentes?.componente_sonido === true);
  }, [componentes])

  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [location.pathname]);


  useEffect(() => {
    if (isMenuOpen && showQRScanner && videoRef.current) {
      startQRScan(videoRef.current.id);
    } else if (!showQRScanner) {
      stopQRScan();
    }
  }, [showQRScanner, startQRScan, stopQRScan]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (scannerRef.current && !scannerRef.current.contains(event.target)) {
        stopQRScan();
      }
    };

    if (showQRScanner) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showQRScanner, stopQRScan]);

  const menuItems = sonidoOn
    ? [
      {
        id: 1,
        label: <FaCartShopping />,
        color: "bg-primary",
        action: () => toggleLink("/MiCarrito"),
      },
      {
        id: 2,
        label: isMuted ? <AiFillMuted /> : <IoVolumeMuteSharp />,
        color: "bg-danger",
        action: toggleMute,
      },
      {
        id: 3,
        label: <BsQrCode />,
        color: "bg-secondary",
        action: toggleQRScanner,
      },
      {
        id: 4,
        label: <FaWhatsapp />,
        color: "bg-primary",
        action: () => toggleLink("https://google.com.ar"),
      },
    ]
    : [
      {
        id: 1,
        label: <FaCartShopping />,
        color: "bg-primary",
        action: () => toggleLink("/MiCarrito"),
      },
      {
        id: 2,
        label: <BsQrCode />,
        color: "bg-secondary",
        action: toggleQRScanner,
      },
      {
        id: 3,
        label: <FaWhatsapp />,
        color: "bg-primary",
        action: () => toggleLink("https://google.com.ar"),
      },
    ];

  const mainButtonVariants = {
    hidden: { opacity: 0.9, scale: 0.9 },
    visible: { opacity: 1, scale: 1, y: [0, -10, 0] },
    exit: { opacity: 0.8, scale: 0.9 },
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 120 } },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (index) => {
      const angle = (index * 180) / (menuItems.length - 1) - 90;
      const radius = 120;
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius - 40;
      return {
        opacity: 1,
        scale: 1,
        x,
        y,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: index * 0.1,
        },
      };
    },
    exit: { opacity: 0, scale: 0 },
    hover: { scale: 1.2 },
    tap: { scale: 0.9 },
  };

  return (
    <>
      <div className="floating-menu-container">
        <AnimatePresence>
          {showButton && (
            <motion.button
              className="main-button"
              onClick={toggleMenu}
              variants={mainButtonVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "linear-gradient(to right, #0d1114, #1f4f58)",
              }}
              aria-label="Abrir menú flotante"
            >
              {isMenuOpen ? "✖" : "☰"}
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="menu-items"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className={`menu-item ${item.color}`}
                  custom={index}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={item.action}
                  aria-label={
                    item.label.props["aria-label"] || `Opción ${item.id}`
                  }
                >
                  <span className="menu-item-icon">{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Escáner QR */}
      <AnimatePresence>
        {showQRScanner && (
          <motion.div
            ref={scannerRef}
            style={{
              position: "fixed",
              top: "10%",
              left: "5%",
              zIndex: 10000,
              width: "90%",
              height: "70%",
              backgroundColor: "black",
              padding: "0",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              border: "2px solid red",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <video
              id="qr-video"
              ref={videoRef}
              style={{ width: "100%", height: "90%" }}
            />
            <button className="btn btn-danger mt-2 w-100" onClick={stopQRScan}>
              Cerrar Escáner
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MenuFlotante;
