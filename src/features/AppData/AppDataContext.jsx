import React, { createContext, useContext, useMemo, useEffect } from "react";
import { useAppData } from "./useAppData";
import { LoadingSpinner } from "../../components/Windows/LoadingSpinner";

const AppDataContext = createContext();
export const useAppDataContext = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  const { state, cargando, temaAplicado } = useAppData();

  const contextValue = useMemo(
    () => ({
      ...state,
      cargando,
      temaAplicado,
    }),
    [state, cargando, temaAplicado]
  );

  if (cargando || !temaAplicado) {
    return (
      <AppDataContext.Provider value={contextValue}>
        <div className="loading-screen">
          <LoadingSpinner />
        </div>
      </AppDataContext.Provider>
    );
  }

  return (
    <AppDataContext.Provider value={contextValue}>
      <div className={state.diseñoActivo?.nombre === "Diseño 1" ? "design-one" : "design-two"}>
        {children}
      </div>
    </AppDataContext.Provider>
  );
};