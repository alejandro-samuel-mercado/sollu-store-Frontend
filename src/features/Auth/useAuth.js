import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PROTECTED_PATHS } from "../../utils/constants";
import { authService } from "../../Api/services/authService";
import { useFetch } from "../../hooks/useFetch";

const isTokenValidFn = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [failedSuccess, setFailedSuccess] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("access_token");
    return !!token && isTokenValidFn();
  });

  const [userRole, setUserRole] = useState(() => {
    const role = localStorage.getItem("user_role");
    return role || "user";
  });

  const [user, setUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || null;
  });

  const {
    refetch: refreshToken,
    loading: refreshLoading,
    error: refreshError,
  } = useFetch(
    () => authService.refreshToken(localStorage.getItem("refresh_token")),
    "refreshToken",
    [],
    { immediate: false }
  );

  const isTokenValid = useCallback(() => isTokenValidFn(), []);

  const clearSession = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserRole("user");
    setUser(null);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    navigate("/login");
  }, [navigate, clearSession]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("access_token"));
      setUserRole(localStorage.getItem("user_role") || "user");
      setUser(JSON.parse(localStorage.getItem("user")) || null);
    };

    const checkAuthAndRedirect = () => {
      console.log("Verificando token:", {
        isAuthenticated,
        pathname: location.pathname,
      });
      const valid = isTokenValid();
      const requiresAuth = PROTECTED_PATHS.some((path) =>
        location.pathname.startsWith(path)
      );
      if (!valid) {
        if (requiresAuth) {
          logout();
          setFailedSuccess(true);
        } else {
          clearSession();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(checkAuthAndRedirect, 30000);

    if (location.pathname == "/MiCarrito" || location.pathname == "Mi-cuenta") {
      checkAuthAndRedirect();
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [logout, isTokenValid, clearSession]);

  return {
    isAuthenticated,
    setIsAuthenticated,
    userRole,
    setUserRole,
    user,
    setUser,
    isTokenValid,
    logout,
    login: useCallback((token, refreshToken, role, userData) => {
      localStorage.setItem("access_token", token);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_role", role);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsAuthenticated(true);
      setUserRole(role);
      setUser(userData);
    }, []),
    failedSuccess,
    setFailedSuccess,
    refreshToken,
    refreshLoading,
    refreshError,
  };
};
