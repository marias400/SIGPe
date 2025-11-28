import React from "react";
import ProsthesisForm from "./forms/ProsthesisForm";
import "../../styles/ProsthesesSection.css";

const ProsthesisManagementSection = () => {
  return (
    <div className="prostheses-section">
      <h2>Gestión de Prótesis</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Utilice el asistente a continuación para crear nuevas prótesis y
        gestionar sus datos asociados (especialidades, talles, materiales).
      </p>

      <div
        className="form-content-area"
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <ProsthesisForm />
      </div>
    </div>
  );
};

export default ProsthesisManagementSection;
