import React, { useState } from "react";
import { AuthContext } from "../../../auth/AuthContext";

const MaterialForm = () => {
  // const { authFetch } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    unit: "",
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
      console.log("Submitting Material:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage({
        type: "success",
        text: "Material creado con éxito (Simulado)",
      });
      setFormData({ name: "", cost: "", unit: "" });
    } catch (error) {
      console.error("Error creating material:", error);
      setMessage({ type: "error", text: "Error al crear el material" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3>Nuevo Material</h3>
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
          <label>Nombre del Material:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Ej: Acrílico, Metal, Cerámica..."
          />
        </div>
        <div className="form-group">
          <label>Costo Unitario:</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Unidad de Medida:</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Ej: gramo, ml, unidad..."
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Material"}
        </button>
      </form>
    </div>
  );
};

export default MaterialForm;
