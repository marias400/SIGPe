import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/EditUserData.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const EditUserData = () => {
  const { authFetch, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        lastname: user.lastname || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "El apellido es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrors({});

    try {
      const updateData = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
      };

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await authFetch(`/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        setSuccessMessage("Datos actualizados correctamente");
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
        // Reload user data
        window.location.reload();
      } else {
        const errorData = await res.json();
        setErrors({ submit: errorData.detail || "Error al actualizar los datos" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setErrors({ submit: "Error al actualizar los datos" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await authFetch(`/users/${user.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Cuenta eliminada correctamente");
        logout();
        navigate("/");
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Error al eliminar la cuenta");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error al eliminar la cuenta");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="edit-user-data">
      <h2>Editar Datos de Cuenta</h2>

      <form onSubmit={handleSubmit} className="edit-user-form">
        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Apellido</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            className={errors.lastname ? "error" : ""}
          />
          {errors.lastname && <span className="field-error">{errors.lastname}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Nueva Contraseña (dejar vacío para no cambiar)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        {formData.password && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? "error" : ""}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>

      <div className="delete-section">
        <h3>Zona de Peligro</h3>
        <p>Eliminar tu cuenta es permanente. Esta acción no se puede deshacer.</p>
        <button
          type="button"
          className="btn-delete-account"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={loading}
        >
          Eliminar Cuenta
        </button>

        {showDeleteConfirm && (
          <div className="delete-confirm-modal">
            <div className="delete-confirm-content">
              <h3>¿Estás seguro?</h3>
              <p>Esta acción eliminará permanentemente tu cuenta. Esta acción no se puede deshacer.</p>
              <div className="delete-confirm-actions">
                <button
                  type="button"
                  className="btn-confirm-delete"
                  onClick={handleDeleteUser}
                  disabled={loading}
                >
                  {loading ? "Eliminando..." : "Sí, eliminar cuenta"}
                </button>
                <button
                  type="button"
                  className="btn-cancel-delete"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUserData;

