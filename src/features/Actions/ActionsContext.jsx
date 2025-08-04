import React, { createContext, useContext } from "react";
import { Actions } from "./useActions";

const ActionsContext = createContext();
export const useActionsContext = () => useContext(ActionsContext);

export const ActionsProvider = ({ children }) => {
  const actions = Actions();

  return (
    <ActionsContext.Provider value={actions}>
      {children}
    </ActionsContext.Provider>
  );
};

export const useActions = () => {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error("useActions debe ser usado dentro de un ActionsProvider");
  }
  return context;
};