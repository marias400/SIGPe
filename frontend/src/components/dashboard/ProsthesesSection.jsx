import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import "../../styles/ProsthesesSection.css";

const API_URL = "http://localhost:8000/api";

const ProsthesesSection = () => {
  const { authFetch } = useContext(AuthContext);
  const [specialities, setSpecialities] = useState([]);
  const [prostheses, setProstheses] = useState([]);
  const [filteredProstheses, setFilteredProstheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProsthesis, setSelectedProsthesis] = useState(null);
  const [prosthesisSearchTerm, setProsthesisSearchTerm] = useState("");

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    filterProstheses();
  }, [prostheses, searchTerm]);

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const res = await authFetch("/specialities/full_catalog");
      if (res.ok) {
        const data = await res.json();
        setSpecialities(data);
        
        // Flatten prostheses from all specialities
        const allProstheses = data.flatMap((spec) =>
          (spec.prostheses || []).map((pros) => ({
            ...pros,
            speciality_name: spec.name,
          }))
        );
        setProstheses(allProstheses);
        setFilteredProstheses(allProstheses);
      }
    } catch (error) {
      console.error("Error loading catalog:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProstheses = () => {
    let filtered = [...prostheses];
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((pros) => {
        return (
          pros.id.toString().includes(searchLower) ||
          (pros.name && pros.name.toLowerCase().includes(searchLower)) ||
          (pros.description && pros.description.toLowerCase().includes(searchLower)) ||
          (pros.speciality_name && pros.speciality_name.toLowerCase().includes(searchLower))
        );
      });
    }
    setFilteredProstheses(filtered);
  };

  const searchProsthesis = () => {
    if (!prosthesisSearchTerm.trim()) {
      setSelectedProsthesis(null);
      return;
    }

    const found = prostheses.find((pros) => {
      const searchLower = prosthesisSearchTerm.toLowerCase();
      return (
        pros.id.toString().includes(searchLower) ||
        (pros.name && pros.name.toLowerCase().includes(searchLower)) ||
        (pros.description && pros.description.toLowerCase().includes(searchLower)) ||
        (pros.speciality_name && pros.speciality_name.toLowerCase().includes(searchLower))
      );
    });

    if (found) {
      setSelectedProsthesis(found);
    } else {
      alert("Prótesis no encontrada");
    }
  };

  // Calculate stats
  const stats = {
    totalSpecialities: specialities.length,
    totalProstheses: prostheses.length,
    specialitiesWithProstheses: specialities.filter((spec) => spec.prostheses && spec.prostheses.length > 0).length,
  };

  return (
    <div className="prostheses-section">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Especialidades</h3>
          <p className="stat-value">{stats.totalSpecialities}</p>
        </div>
        <div className="stat-card">
          <h3>Total Prótesis</h3>
          <p className="stat-value">{stats.totalProstheses}</p>
        </div>
        <div className="stat-card">
          <h3>Especialidades con Prótesis</h3>
          <p className="stat-value">{stats.specialitiesWithProstheses}</p>
        </div>
      </div>

      {/* Specialities Cards */}
      <div className="specialities-grid">
        {specialities.map((speciality) => (
          <div key={speciality.id} className="speciality-card">
            <h3>{speciality.name}</h3>
            <p className="prosthesis-count">
              {speciality.prostheses?.length || 0} prótesis asignadas
            </p>
            {speciality.prostheses && speciality.prostheses.length > 0 && (
              <div className="prostheses-list">
                {speciality.prostheses.slice(0, 3).map((pros) => (
                  <div key={pros.id} className="prosthesis-item">
                    <span>{pros.name}</span>
                    <span className="price">${pros.base_price || 0}</span>
                  </div>
                ))}
                {speciality.prostheses.length > 3 && (
                  <p className="more-items">+{speciality.prostheses.length - 3} más</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Search for specific prosthesis */}
      <div className="search-prosthesis-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar prótesis por ID, nombre, descripción, especialidad..."
          value={prosthesisSearchTerm}
          onChange={(e) => setProsthesisSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchProsthesis()}
        />
        <button className="btn-search" onClick={searchProsthesis}>
          Buscar Prótesis
        </button>
      </div>

      {selectedProsthesis && (
        <div className="selected-prosthesis-card">
          <h3>Prótesis Seleccionada</h3>
          <div className="prosthesis-details">
            <p><strong>ID:</strong> {selectedProsthesis.id}</p>
            <p><strong>Nombre:</strong> {selectedProsthesis.name}</p>
            <p><strong>Especialidad:</strong> {selectedProsthesis.speciality_name}</p>
            <p><strong>Descripción:</strong> {selectedProsthesis.description || "N/A"}</p>
            <p><strong>Precio Base:</strong> ${selectedProsthesis.base_price || 0}</p>
            {selectedProsthesis.img_url && (
              <p><strong>Imagen:</strong> {selectedProsthesis.img_url}</p>
            )}
          </div>
          <button className="btn-close" onClick={() => setSelectedProsthesis(null)}>Cerrar</button>
        </div>
      )}

      {/* Prostheses List */}
      <div className="prostheses-list-section">
        <h2>Lista de Prótesis</h2>
        <div className="list-search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar prótesis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="prostheses-list-container">
          {loading ? (
            <p>Cargando prótesis...</p>
          ) : (
            <div className="prostheses-grid-list">
              {filteredProstheses.map((pros) => (
                <div key={pros.id} className="prosthesis-card-list">
                  <h4>{pros.name}</h4>
                  <p className="speciality-name">{pros.speciality_name}</p>
                  <p className="description">{pros.description || "Sin descripción"}</p>
                  <p className="price">${pros.base_price || 0}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProsthesesSection;

