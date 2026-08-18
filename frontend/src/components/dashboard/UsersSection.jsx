import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import "../../styles/UsersSection.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const UsersSection = () => {
  const { authFetch } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const [doctorPage, setDoctorPage] = useState(1);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearchTermSpecific, setUserSearchTermSpecific] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
    loadDoctors();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, userSearchTerm]);

  useEffect(() => {
    filterDoctors();
  }, [doctors, doctorSearchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // NOTE: This requires a backend endpoint GET /users/all
      // For now, we'll show an empty state. The backend needs to add this endpoint.
      // Example endpoint: @user_router.get("/all", response_model=list[UserSchema])
      const res = await authFetch("/users/all");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else if (res.status === 404) {
        // Endpoint doesn't exist yet
        console.warn("Endpoint /users/all not found. Please add it to the backend.");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      // NOTE: This requires a backend endpoint GET /doctors/all
      // For now, we'll show an empty state. The backend needs to add this endpoint.
      // Example endpoint: @doctor_router.get("/all", response_model=list[DoctorSchema])
      const res = await authFetch("/doctors/all");
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      } else if (res.status === 404) {
        // Endpoint doesn't exist yet
        console.warn("Endpoint /doctors/all not found. Please add it to the backend.");
        setDoctors([]);
      }
    } catch (error) {
      console.error("Error loading doctors:", error);
      setDoctors([]);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    if (userSearchTerm) {
      const searchLower = userSearchTerm.toLowerCase();
      filtered = filtered.filter((user) => {
        return (
          user.id.toString().includes(searchLower) ||
          (user.name && user.name.toLowerCase().includes(searchLower)) ||
          (user.lastname && user.lastname.toLowerCase().includes(searchLower)) ||
          (user.email && user.email.toLowerCase().includes(searchLower)) ||
          (user.user_type && user.user_type.toLowerCase().includes(searchLower))
        );
      });
    }
    setFilteredUsers(filtered);
    setUserPage(1);
  };

  const filterDoctors = () => {
    let filtered = [...doctors];
    if (doctorSearchTerm) {
      const searchLower = doctorSearchTerm.toLowerCase();
      filtered = filtered.filter((doctor) => {
        return (
          doctor.user_id.toString().includes(searchLower) ||
          (doctor.user?.name && doctor.user.name.toLowerCase().includes(searchLower)) ||
          (doctor.user?.lastname && doctor.user.lastname.toLowerCase().includes(searchLower)) ||
          (doctor.user?.email && doctor.user.email.toLowerCase().includes(searchLower)) ||
          (doctor.speciality && doctor.speciality.toLowerCase().includes(searchLower)) ||
          (doctor.license_number && doctor.license_number.toLowerCase().includes(searchLower))
        );
      });
    }
    setFilteredDoctors(filtered);
    setDoctorPage(1);
  };

  const searchUser = async () => {
    if (!userSearchTermSpecific.trim()) {
      setSelectedUser(null);
      return;
    }

    try {
      // Try to find by ID first
      const userId = parseInt(userSearchTermSpecific);
      if (!isNaN(userId)) {
        const res = await authFetch(`/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedUser(data);
          return;
        }
      }

      // Otherwise search in users list
      const found = users.find((user) => {
        const searchLower = userSearchTermSpecific.toLowerCase();
        return (
          user.id.toString().includes(searchLower) ||
          (user.name && user.name.toLowerCase().includes(searchLower)) ||
          (user.lastname && user.lastname.toLowerCase().includes(searchLower)) ||
          (user.email && user.email.toLowerCase().includes(searchLower)) ||
          (user.user_type && user.user_type.toLowerCase().includes(searchLower))
        );
      });

      if (found) {
        setSelectedUser(found);
      } else {
        alert("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Error searching user:", error);
      alert("Error al buscar el usuario");
    }
  };

  // Calculate pagination
  const userTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const userStartIndex = (userPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(userStartIndex, userStartIndex + itemsPerPage);

  const doctorTotalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const doctorStartIndex = (doctorPage - 1) * itemsPerPage;
  const paginatedDoctors = filteredDoctors.slice(doctorStartIndex, doctorStartIndex + itemsPerPage);

  // Calculate stats
  const stats = {
    total: users.length,
    doctors: doctors.length,
    active: users.filter((u) => u.is_active).length,
    patients: users.filter((u) => u.user_type === "patient" || u.user_type === "cliente_particular").length,
  };

  return (
    <div className="users-section">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Usuarios</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Médicos</h3>
          <p className="stat-value">{stats.doctors}</p>
        </div>
        <div className="stat-card">
          <h3>Activos</h3>
          <p className="stat-value">{stats.active}</p>
        </div>
        <div className="stat-card">
          <h3>Pacientes</h3>
          <p className="stat-value">{stats.patients}</p>
        </div>
      </div>

      {/* Search for specific user */}
      <div className="search-user-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar usuario por ID, nombre, email, tipo..."
          value={userSearchTermSpecific}
          onChange={(e) => setUserSearchTermSpecific(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchUser()}
        />
        <button className="btn-search" onClick={searchUser}>
          Buscar Usuario
        </button>
      </div>

      {selectedUser && (
        <div className="selected-user-card">
          <h3>Usuario Seleccionado</h3>
          <div className="user-details">
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Nombre:</strong> {selectedUser.name} {selectedUser.lastname}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Tipo:</strong> {selectedUser.user_type}</p>
            <p><strong>Activo:</strong> {selectedUser.is_active ? "Sí" : "No"}</p>
            <p><strong>Fecha Creación:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
          </div>
          <button className="btn-close" onClick={() => setSelectedUser(null)}>Cerrar</button>
        </div>
      )}

      {/* Users List */}
      <div className="users-list-section">
        <h2>Usuarios</h2>
        <div className="list-search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar usuarios..."
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
          />
        </div>

        <div className="users-list-container">
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name} {user.lastname}</td>
                      <td>{user.email}</td>
                      <td>{user.user_type}</td>
                      <td>
                        <span className={`status-badge ${user.is_active ? "status-active" : "status-inactive"}`}>
                          {user.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {userTotalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    disabled={userPage === 1}
                  >
                    Anterior
                  </button>
                  <span className="pagination-info">
                    Página {userPage} de {userTotalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                    disabled={userPage === userTotalPages}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Doctors List */}
      <div className="doctors-list-section">
        <h2>Usuarios Médicos</h2>
        <div className="list-search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar médicos..."
            value={doctorSearchTerm}
            onChange={(e) => setDoctorSearchTerm(e.target.value)}
          />
        </div>

        <div className="doctors-list-container">
          {loading ? (
            <p>Cargando médicos...</p>
          ) : (
            <>
              <table className="doctors-table">
                <thead>
                  <tr>
                    <th>ID Usuario</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Especialidad</th>
                    <th>Licencia</th>
                    <th>Verificado</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDoctors.map((doctor) => (
                    <tr key={doctor.user_id}>
                      <td>{doctor.user_id}</td>
                      <td>{doctor.user?.name} {doctor.user?.lastname}</td>
                      <td>{doctor.user?.email}</td>
                      <td>{doctor.speciality || "N/A"}</td>
                      <td>{doctor.license_number || "N/A"}</td>
                      <td>
                        <span className={`status-badge ${doctor.is_verified ? "status-verified" : "status-unverified"}`}>
                          {doctor.is_verified ? "Verificado" : "No Verificado"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {doctorTotalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setDoctorPage((p) => Math.max(1, p - 1))}
                    disabled={doctorPage === 1}
                  >
                    Anterior
                  </button>
                  <span className="pagination-info">
                    Página {doctorPage} de {doctorTotalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => setDoctorPage((p) => Math.min(doctorTotalPages, p + 1))}
                    disabled={doctorPage === doctorTotalPages}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersSection;

