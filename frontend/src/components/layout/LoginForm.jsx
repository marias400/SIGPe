import { AuthContext } from "../../auth/AuthContext.jsx";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";

export default function LoginForm({ onForgotPassword, onSubmit }) {

    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target.email.value;
        const password = e.target.password.value;
        onSubmit({ username, password });
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
                <label htmlFor="email">Correo electrónico</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="auth-input"
                    name="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="auth-field">
                <label htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Contraseña"
                    className="auth-input"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="auth-forgot-link">
                    <button type="button" onClick={onForgotPassword} className="auth-link">
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>
            </div>
            {
                !loading &&
                <button type="submit" className="auth-submit-btn">
                    Login
                </button>
            }
            {
                loading &&
                <button type="button" className="auth-submit-btn" disabled>
                    Cargando...
                </button>
            }

            {/* 👇 Nuevo botón para ir al registro */}
            <div className="auth-link-container">
                <Link to="/register" className="auth-link">
                    ¿No tienes cuenta? Regístrate
                </Link>
            </div>
        </form>
    );
}
