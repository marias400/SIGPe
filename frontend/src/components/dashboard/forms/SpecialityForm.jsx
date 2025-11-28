import React, { useState } from "react";
import { AuthContext } from "../../../auth/AuthContext";

const SpecialityForm = () => {
  // const { authFetch } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      console.log("Submitting Speciality:", { name });
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // const res = await authFetch("/specialities", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name })
      // });

      setMessage({
        type: "success",
        text: "Especialidad creada con éxito (Simulado)",
      });
      setName("");
    } catch (error) {
      console.error("Error creating speciality:", error);
      setMessage({ type: "error", text: "Error al crear la especialidad" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3>Nueva Especialidad</h3>
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
          <label>Nombre de la Especialidad:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
            placeholder="Ej: Ortodoncia, Prótesis Fija..."
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Especialidad"}
        </button>
      </form>
    </div>
  );
};

export default SpecialityForm;
