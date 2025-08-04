import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "../features/Auth/AuthContext";
import { useLocation } from "react-router-dom";
import API from "../Api/index";

const DatosPublicContext = createContext();

export const useDatosPublic = () => useContext(DatosPublicContext);

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [envio, setEnvio] = useState([]);
  const [descuentos, setDescuentos] = useState([]);
  const [atributos, setAtributos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsProducts, setReviewsProducts] = useState([]);
  const [estadosDeVenta, setEstadosDeVenta] = useState([]);
  const [contenidosWeb, setContenidosWeb] = useState([]);
  const [informacionWeb, setInformacionWeb] = useState([]);
  const [puntosDeUsuario, setPuntosDeUsuarios] = useState([]);
  const [miPerfil, setMiPerfil] = useState([]);
  const [misFavoritos, setMisFavoritos] = useState([]);
  const [comprasDeUsuario, setComprasDeUsuario] = useState([]);
  const [comentariosDeUsuario, setComentariosDeusuario] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { user, isAuthenticated } = useAuthContext();
  const location = useLocation();

  const fetchData = async (endpoint, setData) => {
    try {
      const res = await API.get(endpoint);
      setData(res.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error.message);
      setData([]);
    }
  };

  const actualizarProductos = async () => {
    await fetchData("productos/", setProductos);
  };

  const actualizarCategorias = async () => {
    await fetchData("categorias/", setCategorias);
  };

  const actualizarComentarios = async () => {
    await fetchData("reviews/", setReviews);
  };
  const actualizarComentariosProductos = async () => {
    await fetchData("reviewsProducts/", setReviewsProducts);
  };

  const actualizarPuntosDeUsuario = async () => {
    if (user) {
      await fetchData(
        `perfilesUsuarios/puntos/${user?.username}`,
        setPuntosDeUsuarios
      );
    }
  };

  const actualizarComprasDeUsuario = async () => {
    await fetchData("ventas/mis-compras/", setComprasDeUsuario);
  };

  const actualizarComentariosDeUsuario = async () => {
    await fetchData("reviews/mis-comentarios/", setComentariosDeusuario);
  };
  const actualizarMiPerfil = async () => {
    await fetchData("perfilesUsuarios/mi-perfil/", setMiPerfil);
  };
  const actualizarMisFavoritos = async () => {
    await fetchData("perfilesUsuarios/mis-favoritos/", setMisFavoritos);
  };

  const recargarDatos = async () => {
    setCargando(true);

    if (isAuthenticated) {
      await Promise.all([
        actualizarMiPerfil(),
        actualizarPuntosDeUsuario(),
        actualizarComprasDeUsuario(),
      ]);
    }

    await Promise.all([
      actualizarComentariosDeUsuario(),
      actualizarComentariosProductos(),
      actualizarProductos(),
      actualizarCategorias(),
      fetchData("vendedores/", setVendedores),
      fetchData("envio/", setEnvio),
      fetchData("barrios/", setBarrios),
      fetchData("descuentos/", setDescuentos),
      fetchData("atributos/", setAtributos),
      actualizarComentarios(),
      fetchData("contenidosWeb/", setContenidosWeb),
      fetchData("informacionWeb/", setInformacionWeb),
      fetchData("informacionWeb/", setInformacionWeb),
      fetchData("estados/", setEstadosDeVenta),
    ]);
    setCargando(false);
  };

  useEffect(() => {
    if (cargando) {
      recargarDatos();
    }
    actualizarMisFavoritos()
  }, [location.pathname, user?.username]);



  return (
    <DatosPublicContext.Provider
      value={{
        productos,
        cargando,
        envio,
        categorias,
        vendedores,
        barrios,
        descuentos,
        atributos,
        reviews, reviewsProducts,
        miPerfil,
        misFavoritos,
        contenidosWeb,
        informacionWeb,
        puntosDeUsuario,
        comprasDeUsuario,
        comentariosDeUsuario,
        estadosDeVenta,
        setComentariosDeusuario,
        actualizarProductos,
        actualizarCategorias,
        actualizarComentarios,
        actualizarPuntosDeUsuario,
        actualizarComprasDeUsuario,
        actualizarComentariosDeUsuario,
        recargarDatos,
      }}
    >
      {children}
    </DatosPublicContext.Provider>
  );
};
