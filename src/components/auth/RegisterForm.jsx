import { useState } from "react";

export default function RegisterForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit({ email, username, password });
    } catch {
      setError("Error en el registro. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <div className="auth-field">
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="auth-field auth-field-animate">
        <label htmlFor="username">Nombre de usuario</label>
        <input
          id="username"
          type="text"
          className="auth-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? "Registrando..." : "Register"}
      </button>
    </form>
  );
}
