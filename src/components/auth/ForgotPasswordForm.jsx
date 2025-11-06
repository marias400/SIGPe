export default function ForgotPasswordForm({ onBackToLogin, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target["forgot-email"].value;
    onSubmit?.({ email });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-forgot-description">
        <p>
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña.
        </p>
      </div>

      <div className="auth-field">
        <label htmlFor="forgot-email">Correo electrónico</label>
        <input id="forgot-email" type="email" className="auth-input" required />
      </div>

      <button type="submit" className="auth-submit-btn">
        Enviar enlace de recuperación
      </button>

      <div className="auth-link-container">
        <button type="button" onClick={onBackToLogin} className="auth-link">
          Volver al inicio de sesión
        </button>
      </div>
    </form>
  );
}
