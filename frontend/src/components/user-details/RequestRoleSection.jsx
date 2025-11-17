import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import "../../styles/RequestRoleSection.css";

const RequestRoleSection = () => {
  const { authFetch, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    license_number: "",
    institution_name: "",
    speciality: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [hasRequest, setHasRequest] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);

  useEffect(() => {
    checkExistingRequest();
  }, []);

  const checkExistingRequest = async () => {
    try {
      const res = await authFetch("/doctors/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentRequest(data);
        setHasRequest(true);
        if (data.is_verified) {
          setMessage({
            type: "success",
            text: "Tu solicitud de médico ha sido aprobada. Ya eres médico en el sistema.",
          });
        } else {
          setMessage({
            type: "info",
            text: "Ya tienes una solicitud pendiente de revisión.",
          });
        }
      } else if (res.status === 404) {
        setHasRequest(false);
      }
    } catch (error) {
      console.error("Error checking existing request:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await authFetch("/doctors/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Solicitud enviada exitosamente. Serás notificado cuando se revise tu solicitud.",
        });
        setFormData({
          license_number: "",
          institution_name: "",
          speciality: "",
        });
        checkExistingRequest();
      } else {
        const errorData = await res.json();
        setMessage({
          type: "error",
          text: errorData.detail || "Error al enviar la solicitud",
        });
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setMessage({
        type: "error",
        text: "Error al enviar la solicitud. Por favor, intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (hasRequest && currentRequest?.is_verified) {
    return (
      <div className="request-role-section">
        <h1>Solicitar Rol de Médico</h1>
        <div className="request-status approved">
          <h2>✓ Solicitud Aprobada</h2>
          <p>Tu solicitud de médico ha sido aprobada. Ya tienes acceso a las funcionalidades de médico.</p>
          <div className="request-details">
            <p><strong>Número de Licencia:</strong> {currentRequest.license_number || "N/A"}</p>
            <p><strong>Institución:</strong> {currentRequest.institution_name || "N/A"}</p>
            <p><strong>Especialidad:</strong> {currentRequest.speciality || "N/A"}</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasRequest && !currentRequest?.is_verified) {
    return (
      <div className="request-role-section">
        <h1>Solicitar Rol de Médico</h1>
        <div className="request-status pending">
          <h2>⏳ Solicitud Pendiente</h2>
          <p>Tu solicitud está siendo revisada. Serás notificado cuando se tome una decisión.</p>
          <div className="request-details">
            <p><strong>Número de Licencia:</strong> {currentRequest.license_number || "N/A"}</p>
            <p><strong>Institución:</strong> {currentRequest.institution_name || "N/A"}</p>
            <p><strong>Especialidad:</strong> {currentRequest.speciality || "N/A"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="request-role-section">
      <h1>Solicitar Rol de Médico</h1>
      <div className="request-form-container">
        <p className="form-description">
          Completa el siguiente formulario para solicitar el rol de médico en el sistema.
          Un administrador revisará tu solicitud y te notificará el resultado.
        </p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="request-form">
          <div className="form-group">
            <label htmlFor="license_number">
              Número de Licencia <span className="required">*</span>
            </label>
            <input
              type="text"
              id="license_number"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              placeholder="Ej: LM-9845"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="institution_name">
              Nombre de la Institución <span className="required">*</span>
            </label>
            <input
              type="text"
              id="institution_name"
              name="institution_name"
              value={formData.institution_name}
              onChange={handleChange}
              placeholder="Ej: Hospital Universitario"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="speciality">
              Especialidad <span className="required">*</span>
            </label>
            <input
              type="text"
              id="speciality"
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              placeholder="Ej: Traumatología, Odontología, etc."
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestRoleSection;

