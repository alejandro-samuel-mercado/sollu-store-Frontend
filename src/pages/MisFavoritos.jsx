import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useDatosPublic } from "../context/DatosPublicContext";
import { ProductoCard } from "../components/Products/Producto-Card";
import { LoadingSpinner } from "../components/Windows/LoadingSpinner";


const Favoritos = () => {
    const location = useLocation();
    const { misFavoritos, cargando } = useDatosPublic();
    const [productosFavoritos, setProductosFavoritos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    const productosMainRef = useRef(null);

    useEffect(() => {
        if (!cargando && misFavoritos) {
            setProductosFavoritos(misFavoritos);
        }
    }, [cargando, misFavoritos, location]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productosFavoritos.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(productosFavoritos.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        if (productosMainRef.current) {
            const offsetTop = productosMainRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: offsetTop - 20, behavior: "smooth" });
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, rotate: -5 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            rotate: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 80,
            },
        }),
        hover: {
            scale: 1.05,
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
            transition: { duration: 0.3 },
        },
        tap: { scale: 0.95 },
    };

    const titleVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const particleVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: {
            opacity: 0.5,
            scale: 1,
            transition: { duration: 1, repeat: Infinity, repeatType: "reverse" },
        },
    };

    return (
        <div className="favoritos-container">
            {/* Fondo con partículas animadas */}
            <motion.div
                className="particles-background"
                initial="hidden"
                animate="visible"
                variants={particleVariants}
            >
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: `rgba(255, 99, 71, ${Math.random() * 0.5 + 0.2})`,
                        }}
                        variants={particleVariants}
                    />
                ))}
            </motion.div>

            {cargando && <LoadingSpinner />}

            <motion.header
                className="favoritos-header"
                initial="hidden"
                animate="visible"
                variants={titleVariants}
            >
                <h1>
                    <FaHeart className="heart-icon" /> Mis Favoritos
                </h1>
                <p className="subtitle">
                    {productosFavoritos.length}{" "}
                    {productosFavoritos.length === 1 ? "producto favorito" : "productos favoritos"}
                </p>
            </motion.header>

            <div className="favoritos-main" ref={productosMainRef}>
                <div className="productos-all">
                    <AnimatePresence>
                        {!cargando && currentProducts.length > 0 ? (
                            currentProducts.map((producto, index) => (
                                <motion.div
                                    key={producto.id}
                                    custom={index}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={cardVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <ProductoCard producto={producto} />
                                </motion.div>
                            ))
                        ) : (
                            !cargando && (
                                <motion.div
                                    className="no-products"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    No tienes productos favoritos aún. <br />
                                    <Link to="/productos-listado" className="explore-link">
                                        ¡Explora nuestro catálogo!
                                    </Link>
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                </div>

                {totalPages > 1 && (
                    <motion.div
                        className="pagination"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="page-btn"
                            aria-label="Página anterior"
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                                aria-label={`Página ${index + 1}`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="page-btn"
                            aria-label="Página siguiente"
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Favoritos;