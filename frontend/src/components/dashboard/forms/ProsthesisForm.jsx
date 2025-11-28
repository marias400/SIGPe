import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import "../../../styles/ProsthesisForm.css";
import { faPlus, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProsthesisForm = () => {
  const { authFetch } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Main Form Data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    speciality_id: "",
    size_ids: [], // Array of selected size IDs
    material_ids: [], // Array of selected material IDs
    image: null,
  });

  // Catalogs State
  const [specialities, setSpecialities] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [materials, setMaterials] = useState([]);

  // Inline Creation State
  const [showCreateSpeciality, setShowCreateSpeciality] = useState(false);
  const [newSpecialityName, setNewSpecialityName] = useState("");

  const [showCreateSize, setShowCreateSize] = useState(false);
  const [newSizeName, setNewSizeName] = useState("");

  const [showCreateMaterial, setShowCreateMaterial] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    cost: "",
    unit: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  // Load Catalogs
  useEffect(() => {
    const loadData = async () => {
      try {
        const [specRes, sizeRes, matRes] = await Promise.all([
          authFetch("/specialities/full_catalog"),
          authFetch("/sizes"), // Assuming endpoints exist
          authFetch("/materials"),
        ]);

        if (specRes.ok) setSpecialities(await specRes.json());
        if (sizeRes.ok) setSizes(await sizeRes.json());
        if (matRes.ok) setMaterials(await matRes.json());
      } catch (error) {
        console.error("Error loading catalogs", error);
      }
    };
    loadData();
  }, [authFetch]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toggleSelection = (id, field) => {
    setFormData((prev) => {
      const current = prev[field];
      const updated = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      return { ...prev, [field]: updated };
    });
  };

  // Inline Creation Handlers
  const handleCreateSpeciality = async () => {
    if (!newSpecialityName.trim()) return;
    // Mock API call
    const newSpec = { id: Date.now(), name: newSpecialityName };
    setSpecialities([...specialities, newSpec]);
    setFormData((prev) => ({ ...prev, speciality_id: newSpec.id }));
    setNewSpecialityName("");
    setShowCreateSpeciality(false);
  };

  const handleCreateSize = async () => {
    if (!newSizeName.trim()) return;
    const newSize = { id: Date.now(), name: newSizeName };
    setSizes([...sizes, newSize]);
    toggleSelection(newSize.id, "size_ids");
    setNewSizeName("");
    setShowCreateSize(false);
  };

  const handleCreateMaterial = async () => {
    if (!newMaterial.name.trim()) return;
    const newMat = { id: Date.now(), ...newMaterial };
    setMaterials([...materials, newMat]);
    toggleSelection(newMat.id, "material_ids");
    setNewMaterial({ name: "", cost: "", unit: "" });
    setShowCreateMaterial(false);
  };

  // Navigation
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Submitting Full Prosthesis Data:", formData);

      setMessage({ type: "success", text: "¡Prótesis creada exitosamente!" });
      setStep(1);
      setFormData({
        name: "",
        description: "",
        base_price: "",
        speciality_id: "",
        size_ids: [],
        material_ids: [],
        image: null,
      });
      setPreviewUrl(null);
    } catch (error) {
      setMessage({ type: "error", text: "Error al guardar." });
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <div className="prosthesis-wizard-container">
      {/* Progress Bar */}
      <div className="wizard-progress">
        {[
          { step: 1, label: "Básico" },
          { step: 2, label: "Clasificación" },
          { step: 3, label: "Variantes" },
          { step: 4, label: "Multimedia" },
          { step: 5, label: "Resumen" },
        ].map((s) => (
          <div key={s.step} className="progress-step-container">
            <div
              className={`progress-step ${step === s.step ? "active" : ""} ${
                step > s.step ? "completed" : ""
              }`}
            >
              {step > s.step ? <FontAwesomeIcon icon={faCheck} /> : s.step}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
        ))}
      </div>

      {message && (
        <div
          className={`alert ${
            message.type === "success" ? "alert-success" : "alert-error"
          }`}
          style={{ marginBottom: "20px" }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait" custom={step}>
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="wizard-step-content"
            >
              <h3 className="step-title">Información Básica</h3>
              <div className="form-group">
                <label>Nombre de la Prótesis</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ej: Corona Zirconio"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Precio Base ($)</label>
                <input
                  type="number"
                  name="base_price"
                  value={formData.base_price}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="0.00"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: CLASSIFICATION (Speciality) */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="wizard-step-content"
            >
              <h3 className="step-title">Clasificación</h3>
              <div className="form-group">
                <label>Seleccione Especialidad</label>
                <div className="inline-create-group">
                  <select
                    name="speciality_id"
                    value={formData.speciality_id}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">-- Seleccionar --</option>
                    {specialities.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() =>
                      setShowCreateSpeciality(!showCreateSpeciality)
                    }
                    title="Nueva Especialidad"
                  >
                    <FontAwesomeIcon
                      icon={showCreateSpeciality ? faTimes : faPlus}
                    />
                  </button>
                </div>

                {showCreateSpeciality && (
                  <div className="inline-form">
                    <h4>Nueva Especialidad</h4>
                    <div className="form-group">
                      <input
                        type="text"
                        value={newSpecialityName}
                        onChange={(e) => setNewSpecialityName(e.target.value)}
                        className="form-control"
                        placeholder="Nombre de la especialidad"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleCreateSpeciality}
                      style={{ padding: "8px 16px", fontSize: "0.9rem" }}
                    >
                      Crear
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: VARIANTS (Sizes & Materials) */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="wizard-step-content"
            >
              <h3 className="step-title">Variantes Disponibles</h3>

              {/* Sizes */}
              <div className="form-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <label>Talles Disponibles</label>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => setShowCreateSize(!showCreateSize)}
                    style={{ padding: "5px 10px" }}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Nuevo
                  </button>
                </div>

                {showCreateSize && (
                  <div className="inline-form" style={{ marginBottom: "15px" }}>
                    <input
                      type="text"
                      value={newSizeName}
                      onChange={(e) => setNewSizeName(e.target.value)}
                      className="form-control"
                      placeholder="Nombre del talle (Ej: XL)"
                    />
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleCreateSize}
                      style={{ marginTop: "10px", padding: "5px 15px" }}
                    >
                      Agregar
                    </button>
                  </div>
                )}

                <div className="selection-grid">
                  {sizes.map((size) => (
                    <div
                      key={size.id}
                      className={`selection-card ${
                        formData.size_ids.includes(size.id) ? "selected" : ""
                      }`}
                      onClick={() => toggleSelection(size.id, "size_ids")}
                    >
                      {size.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="form-group" style={{ marginTop: "30px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <label>Materiales Disponibles</label>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => setShowCreateMaterial(!showCreateMaterial)}
                    style={{ padding: "5px 10px" }}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Nuevo
                  </button>
                </div>

                {showCreateMaterial && (
                  <div className="inline-form" style={{ marginBottom: "15px" }}>
                    <input
                      type="text"
                      value={newMaterial.name}
                      onChange={(e) =>
                        setNewMaterial({ ...newMaterial, name: e.target.value })
                      }
                      className="form-control"
                      placeholder="Nombre Material"
                      style={{ marginBottom: "10px" }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="number"
                        value={newMaterial.cost}
                        onChange={(e) =>
                          setNewMaterial({
                            ...newMaterial,
                            cost: e.target.value,
                          })
                        }
                        className="form-control"
                        placeholder="Costo"
                      />
                      <input
                        type="text"
                        value={newMaterial.unit}
                        onChange={(e) =>
                          setNewMaterial({
                            ...newMaterial,
                            unit: e.target.value,
                          })
                        }
                        className="form-control"
                        placeholder="Unidad"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleCreateMaterial}
                      style={{ marginTop: "10px", padding: "5px 15px" }}
                    >
                      Agregar
                    </button>
                  </div>
                )}

                <div className="selection-grid">
                  {materials.map((mat) => (
                    <div
                      key={mat.id}
                      className={`selection-card ${
                        formData.material_ids.includes(mat.id) ? "selected" : ""
                      }`}
                      onClick={() => toggleSelection(mat.id, "material_ids")}
                    >
                      {mat.name}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: MULTIMEDIA */}
          {step === 4 && (
            <motion.div
              key="step4"
              custom={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="wizard-step-content"
            >
              <h3 className="step-title">Multimedia</h3>
              <div className="form-group">
                <label>Imagen de Referencia</label>
                <div
                  className="image-upload-area"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {previewUrl ? (
                    <div className="image-preview-container">
                      <img src={previewUrl} alt="Vista previa" />
                      <p style={{ marginTop: "10px", color: "#666" }}>
                        Clic para cambiar
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p
                        style={{
                          fontSize: "3rem",
                          marginBottom: "15px",
                          color: "#ccc",
                        }}
                      >
                        📷
                      </p>
                      <p>Haga clic para subir una imagen</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SUMMARY */}
          {step === 5 && (
            <motion.div
              key="step5"
              custom={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="wizard-step-content"
            >
              <h3 className="step-title">Resumen Final</h3>
              <div className="summary-card">
                <div className="summary-item">
                  <span className="summary-label">Nombre:</span>
                  <span className="summary-value">{formData.name}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Especialidad:</span>
                  <span className="summary-value">
                    {specialities.find((s) => s.id == formData.speciality_id)
                      ?.name || "N/A"}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Precio Base:</span>
                  <span className="summary-value">${formData.base_price}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Talles Seleccionados:</span>
                  <span className="summary-value">
                    {formData.size_ids.length}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">
                    Materiales Seleccionados:
                  </span>
                  <span className="summary-value">
                    {formData.material_ids.length}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Imagen:</span>
                  <span className="summary-value">
                    {formData.image ? "Sí" : "No"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="wizard-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={prevStep}
            disabled={step === 1 || loading}
            style={{ visibility: step === 1 ? "hidden" : "visible" }}
          >
            Atrás
          </button>

          {step < 5 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={nextStep}
              disabled={
                (step === 1 && (!formData.name || !formData.base_price)) ||
                (step === 2 && !formData.speciality_id)
              }
            >
              Siguiente
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Guardando..." : "Confirmar y Guardar"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProsthesisForm;
