import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../pages/Layout";
import Home from "../pages/Home";
import Contacto from "../pages/Contacto";
import ComoComprar from "../pages/ComoComprar";
import SobreNosotros from "../pages/SobreNosotros";
import Politicas from "../pages/Politicas";
import Carrito from "../pages/Carrito";
import Categorias from "../pages/Categorias";
import AuthForm from "../pages/Login";
import Cuenta from "../pages/Cuenta";
import ProductoDetalle from "../pages/ProductoDetalle";
import PorApartado from "../pages/PorApartado";
import Productos from "../pages/Productos";
import PagoFallido from "../pages/FallidaCompra";
import ExitoCompra from "../pages/ExitoCompra";
import Error404 from "../pages/Error404";
import ProtectedRoute from "./ProtectedRoute";
import MisFavoritos from "../pages/MisFavoritos";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/info-page" element={<ComoComprar />} />
        <Route path="/about-us" element={<SobreNosotros />} />
        <Route path="/terminos-politicas" element={<Politicas />} />
        <Route
          path="/MiCarrito"
          element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          }
        />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/register" element={<AuthForm />} />
        <Route
          path="/Mi-cuenta"
          element={
            <ProtectedRoute>
              <Cuenta />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-favoritos"
          element={
            <ProtectedRoute>
              <MisFavoritos />
            </ProtectedRoute>
          }
        />
        <Route path="/productos-listado/producto/:id?" element={<ProductoDetalle />} />
        <Route path="/productos-listado/categorias/:categoria?" element={<PorApartado />} />
        <Route path="/productos-listado" element={<Productos />} />
        <Route path="/pago-fallido" element={<PagoFallido />} />
        <Route path="/pago-exitoso" element={<ExitoCompra />} />
        <Route path="/*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}