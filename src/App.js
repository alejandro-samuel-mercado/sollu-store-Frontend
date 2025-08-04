import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./features/Auth/AuthContext";
import { AppDataProvider } from "./features/AppData/AppDataContext";
import { ProductosProvider } from "./context/DatosPublicContext";
import { CarritoProvider } from "./context/CarritoContext";
import { ActionsProvider } from "./features/Actions/ActionsContext";
import { ComponentesProvider } from "./features/ControlComponents/ControladorComponentesContext";
import AppRoutes from "./routes/index";
import { LoadingProvider } from "./context/LoadingContext";

function App() {
  return (
    <Router>
      <LoadingProvider>
        <AuthProvider>
          <AppDataProvider>
            <ProductosProvider>
              <CarritoProvider>
                <ActionsProvider>
                  <ComponentesProvider>
                    <AppRoutes />
                  </ComponentesProvider>
                </ActionsProvider>
              </CarritoProvider>
            </ProductosProvider>
          </AppDataProvider>
        </AuthProvider>
      </LoadingProvider>
    </Router>
  );
}

export default App;
