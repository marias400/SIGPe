import { AuthContext } from "../auth/AuthContext.jsx";
import { useState, useContext } from "react";


const Login = (AuthProvider) => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(username, password);
        setLoading(false);
        if (result.email) console.log("Login exitoso:", result); //hacer una redirect
        else setError(result.error);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
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
                {loading && <p>Cargando...</p>}
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
};

export default Login;