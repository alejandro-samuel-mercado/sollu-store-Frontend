import React, { createContext, useContext } from "react";
import { useComponents } from "./useComponents";

const ComponentesContext = createContext();
export const useDatosPublicComponentes = () => useContext(ComponentesContext);

export const ComponentesProvider = ({ children }) => {
  const components = useComponents();

  return (
    <ComponentesContext.Provider value={components}>
      {children}
    </ComponentesContext.Provider>
  );
};