import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import "../../styles/ValidateDoctorsSection.css";

const ValidateDoctorsSection = () => {
  const { authFetch } = useContext(AuthContext);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPendingDoctors();
  }, []);

  const loadPendingDoctors = async () => {
    try {
      setLoading(true);
      const res = await authFetch("/doctors/pending");
      if (res.ok) {
        const data = await res.json();
        setPendingDoctors(data);
      } else {
        console.error("Error loading pending doctors");
        setPendingDoctors([]);
      }
    } catch (error) {
      console.error("Error loading pending doctors:", error);
      setPendingDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleApprove = async () => {
    if (!selectedDoctor) return;

    try {
      const res = await authFetch(`/doctors/${selectedDoctor.user_id}/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Médico aprobado exitosamente");
        setSelectedDoctor(null);
        loadPendingDoctors();
      } else {
        const errorData = await res.json();
        alert(`Error al aprobar médico: ${errorData.detail || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error approving doctor:", error);
      alert("Error al aprobar el médico");
    }
  };

  const handleReject = async () => {
    if (!selectedDoctor) return;

    if (!window.confirm("¿Estás seguro de que deseas rechazar esta solicitud?")) {
      return;
    }

    try {
      const res = await authFetch(`/doctors/${selectedDoctor.user_id}/reject`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Solicitud rechazada exitosamente");
        setSelectedDoctor(null);
        loadPendingDoctors();
      } else {
        const errorData = await res.json();
        alert(`Error al rechazar solicitud: ${errorData.detail || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      alert("Error al rechazar la solicitud");
    }
  };

  const filteredDoctors = pendingDoctors.filter((doctor) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const user = doctor.user || {};
    return (
      doctor.user_id.toString().includes(searchLower) ||
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (user.lastname && user.lastname.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (doctor.license_number && doctor.license_number.toLowerCase().includes(searchLower)) ||
      (doctor.institution_name && doctor.institution_name.toLowerCase().includes(searchLower)) ||
      (doctor.speciality && doctor.speciality.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="validate-doctors-section">
      <h1>Validar Médicos</h1>

      <div className="validate-doctors-layout">
        {/* Lista de médicos pendientes */}
        <div className="doctors-list-container">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por ID, nombre, email, licencia, institución, especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p>Cargando solicitudes...</p>
          ) : filteredDoctors.length === 0 ? (
            <div className="empty-state">
              <p>No hay solicitudes de médicos pendientes</p>
            </div>
          ) : (
            <div className="doctors-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Licencia</th>
                    <th>Institución</th>
                    <th>Especialidad</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor) => (
                    <tr
                      key={doctor.user_id}
                      className={selectedDoctor?.user_id === doctor.user_id ? "selected" : ""}
                      onClick={() => handleDoctorClick(doctor)}
                    >
                      <td>{doctor.user_id}</td>
                      <td>
                        {doctor.user?.name} {doctor.user?.lastname}
                      </td>
                      <td>{doctor.user?.email}</td>
                      <td>{doctor.license_number || "N/A"}</td>
                      <td>{doctor.institution_name || "N/A"}</td>
                      <td>{doctor.speciality || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detalle del médico seleccionado */}
        <div className="doctor-detail-container">
          {selectedDoctor ? (
            <div className="doctor-detail">
              <h2>Detalle de Solicitud</h2>
              <div className="detail-content">
                <div className="detail-group">
                  <h3>Información del Usuario</h3>
                  <p><strong>ID:</strong> {selectedDoctor.user_id}</p>
                  <p><strong>Nombre:</strong> {selectedDoctor.user?.name || "N/A"}</p>
                  <p><strong>Apellido:</strong> {selectedDoctor.user?.lastname || "N/A"}</p>
                  <p><strong>Email:</strong> {selectedDoctor.user?.email || "N/A"}</p>
                  <p><strong>Tipo de Usuario:</strong> {selectedDoctor.user?.user_type || "N/A"}</p>
                </div>

                <div className="detail-group">
                  <h3>Información Médica</h3>
                  <p><strong>Número de Licencia:</strong> {selectedDoctor.license_number || "N/A"}</p>
                  <p><strong>Institución:</strong> {selectedDoctor.institution_name || "N/A"}</p>
                  <p><strong>Especialidad:</strong> {selectedDoctor.speciality || "N/A"}</p>
                  <p><strong>Estado:</strong> {selectedDoctor.is_verified ? "Verificado" : "Pendiente"}</p>
                </div>

                <div className="detail-actions">
                  <button className="btn-approve" onClick={handleApprove}>
                    Aprobar
                  </button>
                  <button className="btn-reject" onClick={handleReject}>
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Selecciona un médico de la lista para ver sus detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidateDoctorsSection;

