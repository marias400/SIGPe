import React, { useState } from "react";
import { AuthContext } from "../../../auth/AuthContext";

const ModifierForm = () => {
  // const { authFetch } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    factor: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      console.log("Submitting Modifier:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage({
        type: "success",
        text: "Modificador creado con éxito (Simulado)",
      });
      setFormData({ name: "", factor: "" });
    } catch (error) {
      console.error("Error creating modifier:", error);
      setMessage({ type: "error", text: "Error al crear el modificador" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3>Nuevo Modificador</h3>
      <p className="form-hint">
        Los modificadores afectan el precio final (ej: Urgencia x1.5)
      </p>
      {message && (
        <div
          className={`alert ${
            message.type === "success" ? "alert-success" : "alert-error"
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Modificador:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Ej: Urgencia, Descuento..."
          />
        </div>
        <div className="form-group">
          <label>Factor Multiplicador:</label>
          <input
            type="number"
            name="factor"
            value={formData.factor}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="form-control"
            placeholder="Ej: 1.5 para 50% extra"
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Modificador"}
        </button>
      </form>
    </div>
  );
};

export default ModifierForm;
