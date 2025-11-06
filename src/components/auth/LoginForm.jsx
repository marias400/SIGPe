export default function LoginForm({ onForgotPassword, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    onSubmit?.({ email, password });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label htmlFor="email">Correo electrónico</label>
        <input id="email" name="email" type="email" className="auth-input" required />
      </div>

      <div className="auth-field">
        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" className="auth-input" required />

        <div className="auth-forgot-link">
          <button type="button" onClick={onForgotPassword} className="auth-link">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>

      <button type="submit" className="auth-submit-btn">
        Login
      </button>

      {/* Nuevo link para ir a Register */}
      <div className="auth-link-container">
        <button
          type="button"
          onClick={() => (window.location.href = "/register")}
          className="auth-link"
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </div>
    </form>
  );
}
