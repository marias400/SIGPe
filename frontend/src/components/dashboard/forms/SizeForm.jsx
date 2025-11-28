import React, { useState } from "react";
import { AuthContext } from "../../../auth/AuthContext";

const SizeForm = () => {
  // const { authFetch } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      console.log("Submitting Size:", { name });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage({
        type: "success",
        text: "Talle creado con éxito (Simulado)",
      });
      setName("");
    } catch (error) {
      console.error("Error creating size:", error);
      setMessage({ type: "error", text: "Error al crear el talle" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3>Nuevo Talle</h3>
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
          <label>Nombre del Talle:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
            placeholder="Ej: Chico, Mediano, Grande, 14mm..."
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Talle"}
        </button>
      </form>
    </div>
  );
};

export default SizeForm;
