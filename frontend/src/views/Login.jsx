import { useState } from 'react';
import AuthService from "../services/auth.service";

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const loginForm = async (e) => {
        e.preventDefault();
        try {
            setMessage(""); // Reset message on new submission
            const data = await AuthService.login(username, password);
            console.log("Login exitoso:", data);
            setMessage("Inicio de sesión correcto ✅");
        } catch (error) {
            const errorMessage = "Usuario o contraseña incorrectos ❌";
            setMessage(errorMessage);
        }
    };

    return (
        <div>
            <form onSubmit={loginForm}>
                <h2>Iniciar Sesión</h2>
                <div>
                    <label htmlFor="username">Email:</label>
                    <input
                        type="email"
                        placeholder="Email"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    {message && <p>{message}</p>}
                </div>
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
};

export default Login;