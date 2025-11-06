import "../styles/Login.css";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import "../styles/auth.css";
import "../styles/panelAdmin.css";
import { useAuth } from "../context/AuthContext"; // 👈 Importamos el hook

export default function Login() {
  const { login } = useAuth(); // 👈 Obtenemos la función login del contexto

  const handleLogin = async ({ email, password }) => {
    const success = login({ email, password }); // 👈 Usamos el login del contexto
    if (success) {
      // Redirigir al panel si el login fue correcto
      window.location.href = "/panelCliente";
    } else {
      alert("Credenciales inválidas");
    }
  };

  return (
    <AuthLayout showToggle={false} activeMode="login">
      <LoginForm
        onForgotPassword={() => (window.location.href = "/forgot")}
        onSubmit={handleLogin}
      />
    </AuthLayout>
  );
}
