import React, { createContext, useContext } from "react";
import { useAuth } from "./useAuth";
import { FailedNotification } from "../../components/Windows/FailedNotification";

const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
      {auth.failedSuccess && (
        <FailedNotification
          message="Sessión expirada, redirigiendo al Login..."
          onClose={() => auth.setFailedSuccess(false)}
        />
      )}
    </AuthContext.Provider>
  );
};