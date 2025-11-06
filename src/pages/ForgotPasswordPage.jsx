import "../styles/Login.css";
import AuthLayout from "../components/auth/AuthLayout";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import "../styles/auth.css";


export default function ForgotPasswordPage() {
  const handleForgotPassword = async ({ email }) => {
    console.log("Recuperar contraseña para:", email);
    // Aquí va tu integración con backend
  };

  return (
    <AuthLayout showToggle={false} activeMode="forgot">
      <ForgotPasswordForm
        onBackToLogin={() => (window.location.href = "/login")}
        onSubmit={handleForgotPassword}
      />
    </AuthLayout>
  );
}
