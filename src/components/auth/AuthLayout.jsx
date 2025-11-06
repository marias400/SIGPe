import "../../styles/auth.css";

export default function AuthLayout({ children, activeMode }) {
  return (
    <div className="auth-container">
      {/* Left Section - Image */}
      <div className="auth-left">
        <div className="auth-overlay" />
        <img
          src="/ImageLoginPage.jpg"
          alt="Login background"
          className="auth-image"
        />
        <div className="auth-text">
          <h1 className="auth-title">Laboratorio 3D</h1>
          <p className="auth-subtitle">UNLaR – La Rioja</p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-logo">
            <span>Your Logo</span>
          </div>

          <div className="auth-welcome">
            <h2>
              {activeMode === "forgot"
                ? "Recuperar Contraseña"
                : activeMode === "register"
                ? "Registro"
                : "Bienvenido a CENIT"}
            </h2>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
