import "../styles/auth.css";
import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

export default function RegisterPage() {
  const handleRegister = async ({ email, username, password }) => {
    console.log("Registro con:", { email, username, password });
    // Aquí va tu integración con backend
  };

  return (
    <AuthLayout showToggle={false} activeMode="register">
      <RegisterForm onSubmit={handleRegister} />
    
      <div className="auth-link-container">
        <button
          type="button"
          onClick={() => (window.location.href = "/login")}
          className="auth-link"
        >
          ¿Ya tienes cuenta? Inicia sesión aquí
        </button>
      </div>
    </AuthLayout>
  );
}
