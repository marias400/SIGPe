import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import "../../styles/ProsthesesSection.css";

const API_URL = "http://localhost:8000/api";

const ProsthesesSection = () => {
  const { authFetch, user } = useContext(AuthContext);
  const [specialities, setSpecialities] = useState([]);
  const [prostheses, setProstheses] = useState([]);
  const [filteredProstheses, setFilteredProstheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProsthesis, setSelectedProsthesis] = useState(null);
  const [prosthesisSearchTerm, setProsthesisSearchTerm] = useState("");
  const [currentSpecialityIndex, setCurrentSpecialityIndex] = useState(0);
  const [showAddProsthesisModal, setShowAddProsthesisModal] = useState(false);
  const [showEditProsthesisModal, setShowEditProsthesisModal] = useState(false);
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);
  const [editingProsthesis, setEditingProsthesis] = useState(null);
  const [newProsthesis, setNewProsthesis] = useState({
    speciality_id: null,
    name: "",
    description: "",
    base_price: "",
    img_url: "",
    material_ids: [],
    size_ids: [],
  });
  const [materials, setMaterials] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [prosthesisPage, setProsthesisPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadCatalog();
    loadMaterials();
    loadSizes();
  }, []);

  const loadMaterials = async () => {
    try {
      const res = await authFetch("/materials/");
      if (res.ok) {
        const data = await res.json();
        setMaterials(data);
      }
    } catch (error) {
      console.error("Error loading materials:", error);
    }
  };

  const loadSizes = async () => {
    try {
      const res = await authFetch("/sizes/");
      if (res.ok) {
        const data = await res.json();
        setSizes(data);
      }
    } catch (error) {
      console.error("Error loading sizes:", error);
    }
  };

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

  const handleSpecialityClick = (speciality) => {
    if (user?.user_type === "tecnico") {
      setSelectedSpeciality(speciality);
      setNewProsthesis({ 
        ...newProsthesis, 
        speciality_id: speciality.id,
        material_ids: [],
        size_ids: [],
      });
      setShowAddProsthesisModal(true);
    }
  };

  const handleProsthesisClick = async (prosthesis) => {
    try {
      const res = await authFetch(`/prostheses/${prosthesis.id}`);
      if (res.ok) {
        const data = await res.json();
        setEditingProsthesis({
          ...data,
          material_ids: data.materials?.map(m => m.id) || [],
          size_ids: data.sizes?.map(s => s.id) || [],
        });
        setShowEditProsthesisModal(true);
      } else {
        setEditingProsthesis({
          ...prosthesis,
          material_ids: prosthesis.materials?.map(m => m.id) || [],
          size_ids: prosthesis.sizes?.map(s => s.id) || [],
        });
        setShowEditProsthesisModal(true);
      }
    } catch (error) {
      console.error("Error loading prosthesis details:", error);
      setEditingProsthesis({
        ...prosthesis,
        material_ids: prosthesis.materials?.map(m => m.id) || [],
        size_ids: prosthesis.sizes?.map(s => s.id) || [],
      });
      setShowEditProsthesisModal(true);
    }
  };

  const handleCreateProsthesis = async () => {
    if (!newProsthesis.speciality_id || !newProsthesis.name) {
      alert("Por favor complete los campos requeridos (Especialidad y Nombre)");
      return;
    }

    try {
      const res = await authFetch("/prostheses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          speciality_id: parseInt(newProsthesis.speciality_id),
          name: newProsthesis.name,
          description: newProsthesis.description || null,
          base_price: newProsthesis.base_price ? parseInt(newProsthesis.base_price) : null,
          img_url: newProsthesis.img_url || null,
          material_ids: newProsthesis.material_ids || [],
          size_ids: newProsthesis.size_ids || [],
        }),
      });

      if (res.ok) {
        alert("Prótesis creada exitosamente");
        setShowAddProsthesisModal(false);
        setNewProsthesis({
          speciality_id: null,
          name: "",
          description: "",
          base_price: "",
          img_url: "",
          material_ids: [],
          size_ids: [],
        });
        loadCatalog();
      } else {
        const errorData = await res.json();
        alert(`Error al crear prótesis: ${errorData.detail || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error creating prosthesis:", error);
      alert("Error al crear la prótesis");
    }
  };

  const handleUpdateProsthesis = async () => {
    if (!editingProsthesis || !editingProsthesis.name) {
      alert("Por favor complete el nombre");
      return;
    }

    try {
      const res = await authFetch(`/prostheses/${editingProsthesis.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          speciality_id: editingProsthesis.speciality_id,
          name: editingProsthesis.name,
          description: editingProsthesis.description || null,
          base_price: editingProsthesis.base_price ? parseInt(editingProsthesis.base_price) : null,
          img_url: editingProsthesis.img_url || null,
          material_ids: editingProsthesis.material_ids || [],
          size_ids: editingProsthesis.size_ids || [],
        }),
      });

      if (res.ok) {
        alert("Prótesis actualizada exitosamente");
        setShowEditProsthesisModal(false);
        setEditingProsthesis(null);
        loadCatalog();
      } else {
        const errorData = await res.json();
        alert(`Error al actualizar prótesis: ${errorData.detail || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error updating prosthesis:", error);
      alert("Error al actualizar la prótesis");
    }
  };

  const nextSpeciality = () => {
    setCurrentSpecialityIndex((prev) => (prev + 1) % specialities.length);
    setProsthesisPage(1); // Resetear página al cambiar de especialidad
  };

  const prevSpeciality = () => {
    setCurrentSpecialityIndex((prev) => (prev - 1 + specialities.length) % specialities.length);
    setProsthesisPage(1); // Resetear página al cambiar de especialidad
  };

  // Calculate stats
  const stats = {
    totalSpecialities: specialities.length,
    totalProstheses: prostheses.length,
    specialitiesWithProstheses: specialities.filter((spec) => spec.prostheses && spec.prostheses.length > 0).length,
  };

  const currentSpeciality = specialities[currentSpecialityIndex];
  
  // Paginación para prótesis en speciality-card
  const prosthesisItemsPerPage = 5;
  const totalProsthesisPages = currentSpeciality?.prostheses 
    ? Math.ceil(currentSpeciality.prostheses.length / prosthesisItemsPerPage) 
    : 0;
  const startProsthesisIndex = (prosthesisPage - 1) * prosthesisItemsPerPage;
  const endProsthesisIndex = startProsthesisIndex + prosthesisItemsPerPage;
  const paginatedProstheses = currentSpeciality?.prostheses 
    ? currentSpeciality.prostheses.slice(startProsthesisIndex, endProsthesisIndex)
    : [];

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

      {/* Specialities Carousel - Solo muestra 1 card con navegación */}
      {specialities.length > 0 && (
        <div className="specialities-carousel-container">
          <button className="carousel-btn prev" onClick={prevSpeciality}>
            ‹
          </button>
          <div className="specialities-carousel">
            {currentSpeciality && (
              <div className="speciality-card fixed-size">
                <h3>{currentSpeciality.name}</h3>
                <p className="prosthesis-count">
                  {currentSpeciality.prostheses?.length || 0} prótesis asignadas
                </p>
                {user?.user_type === "tecnico" && (
                  <button className="btn-add-prosthesis" onClick={() => handleSpecialityClick(currentSpeciality)}>
                    + Agregar Prótesis
                  </button>
                )}
                {currentSpeciality.prostheses && currentSpeciality.prostheses.length > 0 && (
                  <>
                    <div className="prostheses-list">
                      {paginatedProstheses.map((pros) => (
                        <div
                          key={pros.id}
                          className="prosthesis-item clickable"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProsthesisClick(pros);
                          }}
                        >
                          <span>{pros.name}</span>
                          <span className="price">${pros.base_price || 0}</span>
                        </div>
                      ))}
                    </div>
                    {totalProsthesisPages > 1 && (
                      <div className="prosthesis-pagination">
                        <button
                          className="pagination-btn-small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProsthesisPage((p) => Math.max(1, p - 1));
                          }}
                          disabled={prosthesisPage === 1}
                        >
                          ‹
                        </button>
                        <span className="pagination-info-small">
                          {prosthesisPage} / {totalProsthesisPages}
                        </span>
                        <button
                          className="pagination-btn-small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProsthesisPage((p) => Math.min(totalProsthesisPages, p + 1));
                          }}
                          disabled={prosthesisPage === totalProsthesisPages}
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <button className="carousel-btn next" onClick={nextSpeciality}>
            ›
          </button>
          <div className="carousel-indicator">
            {currentSpecialityIndex + 1} / {specialities.length}
          </div>
        </div>
      )}

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
          {user?.user_type === "tecnico" && (
            <button
              className="btn-edit-prosthesis"
              onClick={() => handleProsthesisClick(selectedProsthesis)}
            >
              Modificar
            </button>
          )}
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
                <div
                  key={pros.id}
                  className="prosthesis-card-list clickable"
                  onClick={() => handleProsthesisClick(pros)}
                >
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

      {/* Modal para agregar prótesis */}
      {showAddProsthesisModal && (
        <div className="modal-overlay" onClick={() => setShowAddProsthesisModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agregar Prótesis a {selectedSpeciality?.name}</h2>
              <button className="modal-close" onClick={() => setShowAddProsthesisModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={newProsthesis.name}
                  onChange={(e) => setNewProsthesis({ ...newProsthesis, name: e.target.value })}
                  placeholder="Nombre de la prótesis"
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={newProsthesis.description}
                  onChange={(e) => setNewProsthesis({ ...newProsthesis, description: e.target.value })}
                  placeholder="Descripción de la prótesis"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Precio Base</label>
                <input
                  type="number"
                  value={newProsthesis.base_price}
                  onChange={(e) => setNewProsthesis({ ...newProsthesis, base_price: e.target.value })}
                  placeholder="Precio base"
                />
              </div>
              <div className="form-group">
                <label>URL de Imagen</label>
                <input
                  type="text"
                  value={newProsthesis.img_url}
                  onChange={(e) => setNewProsthesis({ ...newProsthesis, img_url: e.target.value })}
                  placeholder="URL de la imagen"
                />
              </div>
              <div className="form-group">
                <label>Materiales</label>
                <div className="checkbox-group">
                  {materials.map((material) => (
                    <label key={material.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newProsthesis.material_ids.includes(material.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewProsthesis({
                              ...newProsthesis,
                              material_ids: [...newProsthesis.material_ids, material.id],
                            });
                          } else {
                            setNewProsthesis({
                              ...newProsthesis,
                              material_ids: newProsthesis.material_ids.filter(id => id !== material.id),
                            });
                          }
                        }}
                      />
                      <span>{material.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Tamaños</label>
                <div className="checkbox-group">
                  {sizes.map((size) => (
                    <label key={size.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newProsthesis.size_ids.includes(size.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewProsthesis({
                              ...newProsthesis,
                              size_ids: [...newProsthesis.size_ids, size.id],
                            });
                          } else {
                            setNewProsthesis({
                              ...newProsthesis,
                              size_ids: newProsthesis.size_ids.filter(id => id !== size.id),
                            });
                          }
                        }}
                      />
                      <span>{size.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddProsthesisModal(false)}>Cancelar</button>
              <button className="btn-save" onClick={handleCreateProsthesis}>Crear Prótesis</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar prótesis */}
      {showEditProsthesisModal && editingProsthesis && (
        <div className="modal-overlay" onClick={() => setShowEditProsthesisModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Modificar Prótesis #{editingProsthesis.id}</h2>
              <button className="modal-close" onClick={() => setShowEditProsthesisModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="prosthesis-details">
                <p><strong>ID:</strong> {editingProsthesis.id}</p>
                <p><strong>Especialidad ID:</strong> {editingProsthesis.speciality_id}</p>
              </div>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={editingProsthesis.name || ""}
                  onChange={(e) => setEditingProsthesis({ ...editingProsthesis, name: e.target.value })}
                  placeholder="Nombre de la prótesis"
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={editingProsthesis.description || ""}
                  onChange={(e) => setEditingProsthesis({ ...editingProsthesis, description: e.target.value })}
                  placeholder="Descripción de la prótesis"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Precio Base</label>
                <input
                  type="number"
                  value={editingProsthesis.base_price || ""}
                  onChange={(e) => setEditingProsthesis({ ...editingProsthesis, base_price: e.target.value })}
                  placeholder="Precio base"
                />
              </div>
              <div className="form-group">
                <label>URL de Imagen</label>
                <input
                  type="text"
                  value={editingProsthesis.img_url || ""}
                  onChange={(e) => setEditingProsthesis({ ...editingProsthesis, img_url: e.target.value })}
                  placeholder="URL de la imagen"
                />
              </div>
              <div className="form-group">
                <label>Materiales</label>
                <div className="checkbox-group">
                  {materials.map((material) => (
                    <label key={material.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={(editingProsthesis.material_ids || []).includes(material.id)}
                        onChange={(e) => {
                          const currentIds = editingProsthesis.material_ids || [];
                          if (e.target.checked) {
                            setEditingProsthesis({
                              ...editingProsthesis,
                              material_ids: [...currentIds, material.id],
                            });
                          } else {
                            setEditingProsthesis({
                              ...editingProsthesis,
                              material_ids: currentIds.filter(id => id !== material.id),
                            });
                          }
                        }}
                      />
                      <span>{material.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Tamaños</label>
                <div className="checkbox-group">
                  {sizes.map((size) => (
                    <label key={size.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={(editingProsthesis.size_ids || []).includes(size.id)}
                        onChange={(e) => {
                          const currentIds = editingProsthesis.size_ids || [];
                          if (e.target.checked) {
                            setEditingProsthesis({
                              ...editingProsthesis,
                              size_ids: [...currentIds, size.id],
                            });
                          } else {
                            setEditingProsthesis({
                              ...editingProsthesis,
                              size_ids: currentIds.filter(id => id !== size.id),
                            });
                          }
                        }}
                      />
                      <span>{size.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowEditProsthesisModal(false)}>Cancelar</button>
              <button className="btn-save" onClick={handleUpdateProsthesis}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProsthesesSection;
