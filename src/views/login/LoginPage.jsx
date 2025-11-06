import "../../styles/auth.css";
import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  const handleLogin = async ({ email, password }) => {
    console.log("Login con:", email, password);
    // Aquí va tu integración con backend
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
