import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../Api/index";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../features/Auth/AuthContext";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { SuccessNotification } from "../components/Windows/SuccessNotification";

axios.defaults.withCredentials = true;
const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_API_KEY_FIREBASE}`,
  authDomain: `${process.env.REACT_APP_AUTHDOMAIN_FIREBASE}`,
  projectId: `${process.env.REACT_APP_PROJECT_ID_FIREBASE}`,
  storageBucket: `${process.env.REACT_APP_STORAGEBUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_MESSAGING_SENDER_ID_FIREBASE}`,
  appId: `${process.env.REACT_APP_APP_ID_FIREBASE}`,
  measurementId: `${process.env.REACT_APP_MEASUREMENT_ID_FIREBASE}`,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthForm = () => {
  const { isAuthenticated, setIsAuthenticated, setUserRole, login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");
  const [email, setEmail] = useState(
    location.pathname === "/login" ? "null" : ""
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
    setEmail(location.pathname === "/login" ? "null" : "");
  }, [location.pathname, isAuthenticated, navigate]);

  const handleCheckboxChange = () => setIsChecked(!isChecked);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!username || (!isLogin && !email) || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    const url = isLogin
      ? `${process.env.REACT_APP_API_BASE_URL}/api/auth/token/`
      : `${process.env.REACT_APP_API_BASE_URL}/api/registro/`;
    const payload = { username, email, password };

    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (isLogin) {
        const { access, refresh, user } = response.data;
        login(access, refresh, user.is_staff ? "admin" : "user", user);
        window.open("/Mi-cuenta", "_self");

      } else {
        setShowSuccess(true);
        setIsLogin(true);
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        if (isLogin) {
          setError(errorData.detail || "Error al iniciar sesión");
        } else {
          const errorObj = errorData.error || {};
          setError(
            errorObj.username ||
            errorObj.email ||
            errorObj.password ||
            "Error al registrarse"
          );
        }
      } else {
        setError("Ocurrió un error inesperado.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await API.post("auth/google/", { id_token: idToken });
      const { access, refresh, user: backendUser } = response.data;

      login(access, refresh, backendUser.is_staff ? "admin" : "user", backendUser);
      navigate("/Mi-cuenta");
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        setError("");
      } else {
        console.error("Error en Google Login:", error);
        setError(`Error con Google: ${error.message}`);
      }
      console.error("Error en Google Login:", error);
      setError(`Error con Google: ${error.message}`);
    }
  };

  const handlePasswordResetRequest = async () => {
    if (!resetEmail) {
      setModalError("Ingresa tu correo.");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/password-reset/request/`,
        { email: resetEmail }
      );
      setModalError("");
      setModalStep(2);
    } catch (error) {
      setModalError(
        error.response?.data?.error || "Error al enviar el correo."
      );
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setModalError("Ingresa el código.");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/password-reset/verify/`,
        { code: verificationCode, email: resetEmail }
      );
      setModalError("");
      setModalStep(3);
    } catch (error) {
      setModalError(error.response?.data?.error || "Código incorrecto.");
    }
  };

  const handlePasswordResetConfirm = async () => {
    if (!newPassword || !confirmPassword) {
      setModalError("Completa ambos campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setModalError("Las contraseñas no coinciden.");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/password-reset/confirm/`,
        {
          password: newPassword,
          confirm_password: confirmPassword,
          email: resetEmail,
        }
      );
      setModalError("");
      setShowModal(false);
      setShowSuccess(true);
      setModalStep(1);
      setResetEmail("");
      setVerificationCode("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (error) {
      setModalError(
        error.response?.data?.error || "Error al cambiar la contraseña."
      );
    }
  };

  const toggleMode = () => {
    setError("");
    setPassword("");
    setUsername("");
    setEmail("");

    setIsLogin(!isLogin);
    navigate(isLogin ? "/register" : "/login");
  };

  return (
    <div className="auth-container">
      {showSuccess && (
        <SuccessNotification
          message={
            modalStep === 1
              ? "Registro exitoso."
              : "Contraseña cambiada con éxito."
          }
          onClose={() => setShowSuccess(false)}
        />
      )}
      <div className="auth-card">
        <div className="auth-form">
          <div className="left-side">
            <img
              src="https://cdn.pixabay.com/photo/2022/06/22/06/53/cabinet-7277181_1280.jpg"
              alt="Background"
            />
            <div className="overlay-shape"></div>
          </div>
          <div className="right-side">
            <h2 className="auth-title">
              {isLogin ? "Iniciar Sesion" : "Registrarse"}
            </h2>
            <form onSubmit={handleAuth}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              {!isLogin && (
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {isLogin && (
                <p className="recovery-link" onClick={() => setShowModal(true)}>
                  ¿Olvidaste tu contraseña?
                </p>
              )}
              {!isLogin && (
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    required
                  />
                  <label htmlFor="terms">
                    Acepto los <a href="#">Términos y Condiciones</a>
                  </label>
                </div>
              )}
              <button type="submit" className="auth-btn">
                {isLogin ? "Iniciar Sesión" : "Registrarse"}
              </button>
              {error && <p className="error-message">{error}</p>}
            </form>
            <div className="divider">
              <span>O</span>
            </div>
            <button className="google-btn" onClick={handleGoogleLogin}>
              <img src="https://imgur.com/vLtArRw.png" alt="Google" />
              {isLogin ? "Iniciar con Google" : "Registrarse con Google"}
            </button>
            <p className="toggle-link">
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              <button onClick={toggleMode}>
                {isLogin ? "Regístrate" : "Inicia Sesión"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ✖
            </button>
            <h3>Recuperar Contraseña</h3>
            {modalStep === 1 && (
              <>
                <p>Ingresa tu correo para recibir un código.</p>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <button onClick={handlePasswordResetRequest}>Enviar</button>
              </>
            )}
            {modalStep === 2 && (
              <>
                <p>Ingresa el código recibido.</p>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Código"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
                <button onClick={handleVerifyCode}>Verificar</button>
              </>
            )}
            {modalStep === 3 && (
              <>
                <p>Ingresa tu nueva contraseña.</p>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button onClick={handlePasswordResetConfirm}>Cambiar</button>
              </>
            )}
            {modalError && <p className="modal-error">{modalError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm