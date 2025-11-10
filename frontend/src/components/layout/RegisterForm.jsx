import { useState } from "react";

// Validaciones inspiradas en VineJS pero implementadas para el navegador
// VineJS está diseñado para backend/Node.js y no funciona bien en el navegador

export default function RegisterForm({ onSubmit }) {
  const [mail, setMail] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados para errores de validación
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validar campo individual (implementación inspirada en VineJS para el navegador)
  const validateField = (fieldName, value) => {
    let errorMessage = "";

    if (fieldName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMessage = "";
      } else if (!emailRegex.test(value)) {
        errorMessage = "El correo electrónico no es válido";
      }
    } else if (fieldName === "password") {
      if (!value) {
        errorMessage = "";
      } else if (value.length < 8) {
        errorMessage = "La contraseña debe tener al menos 8 caracteres";
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        errorMessage = "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número";
      }
    } else if (fieldName === "confirmPassword") {
      if (!value) {
        errorMessage = "";
      } else if (value !== password) {
        errorMessage = "Las contraseñas no coinciden";
      }
    }

    if (errorMessage) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: errorMessage,
      }));
      return false;
    } else {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
      return true;
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setMail(value);
    if (value) {
      validateField("email", value);
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value) {
      validateField("password", value);
      // Revalidar confirmPassword si ya tiene valor
      if (confirmPassword) {
        validateField("confirmPassword", confirmPassword);
      }
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value) {
      validateField("confirmPassword", value);
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    const emailValid = validateField("email", mail);
    const passwordValid = validateField("password", password);
    const confirmPasswordValid = validateField("confirmPassword", confirmPassword);

    if (emailValid && passwordValid && confirmPasswordValid) {
      const email = e.target.email.value;
      const name = e.target.name.value;
      const lastname = e.target.lastname.value;
      const password = e.target.password.value;
      onSubmit({ email, name, lastname, password });
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          className={`auth-input ${errors.email ? "auth-input-error" : ""}`}
          required
          value={mail}
          onChange={handleEmailChange}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>

      <div className="auth-field auth-field-animate">
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          name="name"
          type="text"
          className="auth-input"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="auth-field auth-field-animate">
        <label htmlFor="lastname">Apellido</label>
        <input
          id="lastname"
          name="lastname"
          type="text"
          className="auth-input"
          required
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          className={`auth-input ${errors.password ? "auth-input-error" : ""}`}
          required
          value={password}
          onChange={handlePasswordChange}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
      </div>

      <div className="auth-field">
        <label htmlFor="confirm-password">Confirmar Contraseña</label>
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          className={`auth-input ${errors.confirmPassword ? "auth-input-error" : ""}`}
          required
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}
      </div>

      <button type="submit" className="auth-submit-btn">
        Register
      </button>
    </form>
  );
}
