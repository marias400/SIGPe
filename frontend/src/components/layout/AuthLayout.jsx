import "../../styles/auth.css";

import unlarLogo from "../../public/assets/Logo_unlar.avif"

export default function AuthLayout({ children, showToggle, activeMode, onModeChange }) {
  return (
    <div className="auth-container">
      {/* Left Section - Background */}
      <div className="auth-left">
        <div className="auth-overlay" />
        <div className="auth-text">
          <h1 className="auth-title">Laboratorio 3D</h1>
          <p className="auth-subtitle">UNLaR - La Rioja</p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-logo">
            <img src={unlarLogo} alt="Logo" />
          </div>
          <div className="auth-welcome">
            <h2>{activeMode === "forgot" ? "Recuperar Contraseña" : "Bienvenido"}</h2>
          </div>
          {showToggle && (
            <div className="auth-toggle">
              <button
                onClick={() => onModeChange("login")}
                className={`auth-toggle-btn ${activeMode === "login" ? "active" : ""}`}
              >
                Login
              </button>
              <button
                onClick={() => onModeChange("register")}
                className={`auth-toggle-btn ${activeMode === "register" ? "active" : ""}`}
              >
                Register
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
