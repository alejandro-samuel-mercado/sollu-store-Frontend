import React, { createContext, useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../features/Auth/AuthContext";
import { useLocation } from "react-router-dom";

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);
    const [error, setError] = useState(null);
    const { isTokenValid, logout, isAuthenticated } = useAuthContext();
    const [cargando, setCargando] = useState(false);
    const location = useLocation();

    const fetchCarrito = useCallback(async () => {
        if (!isAuthenticated) {
            setCarrito([]);
            setCargando(false);
            return;
        }
        setCargando(true);
        setError(null);

        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/carrito/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    setError("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
                    logout();
                    setCarrito([]);
                } else {
                    setError("Ocurrió un error al obtener el carrito.");
                    setCarrito([]);
                }
            } else {
                const data = await response.json();
                const productosValidos = (data.productos || []).filter(
                    (item) => item && item.producto_atributo && item.producto_atributo.producto
                );
                setCarrito(productosValidos);
                if (data.productos && productosValidos.length !== data.productos.length) {
                    console.warn("Algunos productos en el carrito no tienen la estructura esperada:", data.productos);
                }
            }
        } catch (err) {
            setError("Ocurrió un error al obtener el carrito.");
            console.error("Error en fetchCarrito:", err);
            setCarrito([]);
        } finally {
            setCargando(false);
        }
    }, [isAuthenticated, logout]);

    const agregarProducto = useCallback(
        async (productoAtributoId, cantidad) => {
            if (!isTokenValid()) {
                setError("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
                logout();
                return false;
            }

            setCargando(true);
            setError(null);

            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/api/carrito/agregar_producto/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ producto_atributo_id: productoAtributoId, cantidad }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 401) {
                        setError("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
                        logout();
                        return false;
                    }
                    throw new Error(errorData.detail || "Error al agregar producto al carrito");
                }

                await fetchCarrito();
                return true;
            } catch (err) {
                setError(err.message || "Error al agregar el producto al carrito.");
                console.error("Error en agregarProducto:", err);
                return false;
            } finally {
                setCargando(false);
            }
        },
        [isTokenValid, logout, fetchCarrito]
    );

    const eliminarProducto = useCallback(
        async (productoAtributoId) => {
            if (!isTokenValid()) {
                setError("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
                logout();
                return false;
            }

            setCargando(true);
            setError(null);

            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/api/carrito/eliminar_producto/`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ producto_atributo_id: productoAtributoId }),
                    }
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        setError("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
                        logout();
                        return false;
                    }
                    throw new Error("Error al eliminar producto del carrito");
                }

                await fetchCarrito();
                return true;
            } catch (err) {
                setError("Error al eliminar el producto del carrito.");
                console.error("Error en eliminarProducto:", err);
                return false;
            } finally {
                setCargando(false);
            }
        },
        [isTokenValid, logout, fetchCarrito]
    );

    useEffect(() => {
        if (isAuthenticated) {
            fetchCarrito();
        } else {
            setCarrito([]);
            setCargando(false);
        }
    }, [isAuthenticated, location.pathname, fetchCarrito]);

    return (
        <CarritoContext.Provider
            value={{ carrito, agregarProducto, eliminarProducto, error, cargando }}
        >
            {children}
        </CarritoContext.Provider>
    );
};