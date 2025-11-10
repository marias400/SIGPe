import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext.jsx";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import LoginForm from "../components/layout/LoginForm";
import RegisterForm from "../components/layout/RegisterForm";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useContext(AuthContext);
  const [newMode, setNewMode] = useState("login");

  // Nuevo: estado para modal y mensaje
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleLogin = async ({ username, password }) => {
    const result = await login(username, password);
    if (result && result.email) {
      navigate("/");
    } else {
      alert("Credenciales inválidas");
    }
  };

  const handleRegister = async ({ name, lastname, email, password }) => {
    if (typeof register === "function") {
      const result = await register(name, lastname, email, password);
      if (result && result.email) {
        // Mostrar modal de éxito en vez de navegar directamente
        setMessage({ type: "success", text: "Usuario creado correctamente ✅" });
        setShowModal(true);
        return;
      }
      // Mostrar error simple si falla el registro
      setMessage({ type: "error", text: "Registro fallido. Verifique los datos e intente nuevamente." });
      setShowModal(true);
    } else {
      setMessage({ type: "error", text: "Funcionalidad de registro no implementada" });
      setShowModal(true);
    }
  };

  const handleModeChange = (mode) => {
    setNewMode(mode);
  };

  const closeModal = () => {
    setShowModal(false);
    setMessage({ type: "", text: "" });
  };

  const handleAcceptModal = () => {
    // Si fue éxito de registro — volver a la vista login
    if (message.type === "success") {
      setNewMode("login");
    }
    closeModal();
  };
  return (
    <AuthLayout showToggle={true} activeMode={newMode} onModeChange={handleModeChange}>
      {newMode === "login" && (
        <LoginForm
          onForgotPassword={() => navigate("/recover-password")}
          onSubmit={handleLogin}
        />
      )}

      {newMode === "register" && (
        <RegisterForm
          onSubmit={handleRegister}
        />
      )}

      {/* Modal reutilizable (igual al de Cotizacion) */}
      {showModal && message.text && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className={`modal-content ${message.type === "success" ? "modal-success" : "modal-error"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {message.type === "success" ? "✓ Éxito" : "✗ Error"}
              </h2>
              <button className="modal-close" onClick={closeModal} aria-label="Cerrar">
                ×
              </button>
            </div>
            <div className="modal-body">
              {message.text}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleAcceptModal}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}