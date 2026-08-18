import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext.jsx";
import "../styles/Cotizacion.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function OrderForm() {
  const { user, authFetch } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados para el flujo paso a paso
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);
  const [selectedProsthesis, setSelectedProsthesis] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");

  // Estados para los datos del formulario
  const [orderData, setOrderData] = useState({
    prosthesis_id: "",
    material_id: "",
    size_id: "",
    has_design: false,
    processing_level: "",
    specification: "",
  });

  const [medicalOrderData, setMedicalOrderData] = useState({
    patient_id: "",
    urgency_level: "",
    pathology: "",
    medical_observations: "",
  });

  // Estados para los datos cargados
  const [specialities, setSpecialities] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Verificar si el usuario es doctor
  const [isDoctor, setIsDoctor] = useState(false);

  // Estado para el archivo 3D
  const [file3d, setFile3d] = useState(null);
  const [file3dMetadata, setFile3dMetadata] = useState(null); // Almacena s3_key y s3_url después de subir
  const [uploadingFile, setUploadingFile] = useState(false); // Estado para mostrar progreso de subida

  // Estado para el modal
  const [showModal, setShowModal] = useState(false);

  // Estado para el modal de confirmación de envío durante subida
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  useEffect(() => {
    const getIsDoctor = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/doctors/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const doctorData = await response.json();
          setIsDoctor(doctorData.is_verified);
        }
      } catch (error) {
        console.error("Error al verificar el tipo de usuario:", error);
      }
    };
    if (user) {
      getIsDoctor();
    }
  }, []);

  // Cargar catálogo completo (specialities con prostheses, materials, sizes)
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/specialities/full_catalog`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const catalog = await response.json();
          setSpecialities(catalog);
        } else {
          setMessage({ type: "error", text: "Error al cargar el catálogo de prótesis" });
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        setMessage({ type: "error", text: "Error al cargar el catálogo de prótesis" });
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  // Cargar pacientes solo si el usuario es doctor
  useEffect(() => {
    const loadPatients = async () => {
      if (!isDoctor) {
        setPatients([]);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/patients/my-patients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const patientsData = await response.json();
          setPatients(patientsData);
        } else {
          setMessage({ type: "error", text: "No se pudieron cargar los pacientes. Verifique sus permisos." });
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
        setMessage({ type: "error", text: "Error al cargar los pacientes" });
        setShowModal(true);
      }
    };

    if (user && isDoctor) {
      loadPatients();
    }
  }, [user, isDoctor]);

  // Handlers para el flujo paso a paso
  const handleSpecialitySelect = (speciality) => {
    setSelectedSpeciality(speciality);
    setSelectedProsthesis(null);
    setSelectedSize("");
    setSelectedMaterial("");
    setOrderData({
      ...orderData,
      prosthesis_id: "",
      material_id: "",
      size_id: "",
    });
  };

  const handleProsthesisSelect = (prosthesis) => {
    setSelectedProsthesis(prosthesis);
    setSelectedSize("");
    setSelectedMaterial("");
    setOrderData({
      ...orderData,
      prosthesis_id: prosthesis.id.toString(),
      material_id: "",
      size_id: "",
    });
  };

  const handleSizeChange = (e) => {
    const sizeId = e.target.value;
    setSelectedSize(sizeId);
    setOrderData({
      ...orderData,
      size_id: sizeId,
    });
  };

  const handleMaterialChange = (e) => {
    const materialId = e.target.value;
    setSelectedMaterial(materialId);
    setOrderData({
      ...orderData,
      material_id: materialId,
    });
  };

  const handleOrderChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderData({
      ...orderData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFile3d(null);
      setFile3dMetadata(null);
      setOrderData(prev => ({
        ...prev,
        has_design: false,
      }));
      return;
    }

    // Validar formato de archivo
    const allowedExtensions = ['.stl', '.obj', '.gltf', '.glb'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      setMessage({
        type: "error",
        text: `Formato de archivo no permitido. Formatos permitidos: ${allowedExtensions.join(', ')}`
      });
      setShowModal(true);
      e.target.value = ''; // Limpiar el input
      return;
    }

    setFile3d(file);
    setUploadingFile(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");

      // Paso 1: Solicitar URL prefirmada
      const presignedResponse = await fetch(`${API_URL}/models3d/presigned-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          file_name: file.name,
          file_type: file.type || 'application/octet-stream',
        }),
      });

      if (!presignedResponse.ok) {
        const errorData = await presignedResponse.json();
        throw new Error(errorData.detail || "Error al obtener URL prefirmada");
      }

      const presignedData = await presignedResponse.json();

      // Paso 2: Subir archivo a S3 usando la URL prefirmada
      const formData = new FormData();

      // Agregar los campos de la respuesta prefirmada (incluyendo Content-Type)
      Object.keys(presignedData.fields).forEach(key => {
        formData.append(key, presignedData.fields[key]);
      });

      // Agregar el archivo - debe ser el último campo en el FormData
      // El nombre del campo puede ser 'file' o cualquier otro, pero debe ser el último
      formData.append('file', file);

      const uploadResponse = await fetch(presignedData.upload_url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Error al subir el archivo a S3");
      }

      // Guardar metadata del archivo subido
      setFile3dMetadata({
        s3_key: presignedData.s3_key,
        s3_url: presignedData.s3_url,
        file_name: file.name,
        file_format: fileExtension.substring(1), // Sin el punto
        file_size: (file.size / 1024).toFixed(2) + " KB", // Tamaño en KB
      });

      // Si hay un archivo cargado, has_design debe ser true
      // Usar función de actualización para evitar re-render innecesario
      setOrderData(prev => ({
        ...prev,
        has_design: true,
      }));

      setMessage({ type: "success", text: "Archivo 3D subido exitosamente ✅" });
      setShowModal(true);
    } catch (error) {
      console.error("Error al subir archivo:", error);
      setMessage({
        type: "error",
        text: `Error al subir archivo: ${error.message} ❌`
      });
      setShowModal(true);
      setFile3d(null);
      setFile3dMetadata(null);
      e.target.value = ''; // Limpiar el input
    } finally {
      setUploadingFile(false);
    }
  };

  const handleMedicalOrderChange = (e) => {
    const { name, value } = e.target;
    setMedicalOrderData({
      ...medicalOrderData,
      [name]: value,
    });
  };

  // Obtener prótesis de la especialidad seleccionada
  const getProsthesesForSpeciality = () => {
    if (!selectedSpeciality || !selectedSpeciality.prostheses) {
      return [];
    }
    return selectedSpeciality.prostheses;
  };

  // Obtener sizes y materials de la prótesis seleccionada
  const getSizesForProsthesis = () => {
    if (!selectedProsthesis || !selectedProsthesis.sizes) {
      return [];
    }
    return selectedProsthesis.sizes;
  };

  const getMaterialsForProsthesis = () => {
    if (!selectedProsthesis || !selectedProsthesis.materials) {
      return [];
    }
    return selectedProsthesis.materials;
  };

  // Calcular precio aproximado usando la misma lógica que el stored procedure
  const calculateApproximatePrice = () => {
    // Si no hay prótesis seleccionada, no se puede calcular
    if (!selectedProsthesis || !selectedProsthesis.base_price) {
      return null;
    }

    const basePrice = selectedProsthesis.base_price;
    let sizeModifier = 0;
    let materialModifier = 0;

    // Obtener modificador de tamaño si hay uno seleccionado
    if (selectedSize) {
      const selectedSizeObj = getSizesForProsthesis().find(
        (size) => size.id.toString() === selectedSize.toString()
      );
      if (selectedSizeObj && selectedSizeObj.price_modifier !== null && selectedSizeObj.price_modifier !== undefined) {
        sizeModifier = selectedSizeObj.price_modifier;
      }
    }

    // Obtener modificador de material si hay uno seleccionado
    if (selectedMaterial) {
      const selectedMaterialObj = getMaterialsForProsthesis().find(
        (material) => material.id.toString() === selectedMaterial.toString()
      );
      if (selectedMaterialObj && selectedMaterialObj.price_modifier !== null && selectedMaterialObj.price_modifier !== undefined) {
        materialModifier = selectedMaterialObj.price_modifier;
      }
    }

    // Calcular precio total usando la misma fórmula que el stored procedure
    // precio_total = precio_base + (precio_base * modificador_tamaño) + (precio_base * modificador_material)
    const fullPrice = basePrice + (basePrice * sizeModifier) + (basePrice * materialModifier);

    return {
      basePrice,
      sizeModifier,
      materialModifier,
      fullPrice: Math.round(fullPrice * 100) / 100, // Redondear a 2 decimales
    };
  };

  // Obtener el precio calculado
  const priceCalculation = calculateApproximatePrice();

  // Verificar si se completaron todos los campos básicos
  const isBasicFormComplete = () => {
    return selectedProsthesis && selectedSize && selectedMaterial &&
      orderData.processing_level && orderData.specification;
  };

  // Verificar si se puede mostrar la orden médica
  const canShowMedicalOrder = () => {
    return isDoctor && isBasicFormComplete();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si se está subiendo un archivo, mostrar confirmación
    if (uploadingFile) {
      setShowConfirmModal(true);
      setPendingSubmit(true);
      return;
    }

    // Proceder con el envío normal
    await submitOrder();
  };

  const submitOrder = async () => {
    setSubmitting(true);
    setMessage({ type: "", text: "" });
    setShowConfirmModal(false);
    setPendingSubmit(false);

    try {
      const token = localStorage.getItem("token");

      // Validar campos requeridos básicos
      if (!orderData.prosthesis_id || !orderData.material_id ||
        !orderData.processing_level || !orderData.specification) {
        setMessage({ type: "error", text: "Por favor complete todos los campos de la orden" });
        setShowModal(true);
        setSubmitting(false);
        return;
      }

      // Validar que se haya seleccionado una talla (aunque no se envíe al backend)
      if (!selectedSize) {
        setMessage({ type: "error", text: "Por favor seleccione una talla" });
        setShowModal(true);
        setSubmitting(false);
        return;
      }

      // Si es doctor, validar campos de orden médica
      if (isDoctor) {
        if (!medicalOrderData.patient_id || !medicalOrderData.urgency_level || !medicalOrderData.pathology) {
          setMessage({ type: "error", text: "Por favor complete todos los campos de la orden médica" });
          setShowModal(true);
          setSubmitting(false);
          return;
        }
      }

      // Determinar si es orden médica (si el usuario es doctor)
      const isMedical = isDoctor;

      // Paso 1: Crear la orden normal
      // Nota: size_id no se envía porque el modelo Order no tiene ese campo
      const orderPayload = {
        user_id: user.id,
        prosthesis_id: parseInt(orderData.prosthesis_id),
        material_id: parseInt(orderData.material_id),
        is_medical: isMedical,
        has_design: orderData.has_design,
        processing_level: orderData.processing_level,
        specification: orderData.specification,
      };

      const orderResponse = await fetch(`${API_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.detail || "Error al crear la orden normal");
      }

      const orderResult = await orderResponse.json();
      const orderId = orderResult.id;

      // Paso 2: Guardar metadata del archivo 3D si existe
      if (file3dMetadata && file3d) {
        const model3dPayload = {
          order_id: orderId,
          file_name: file3dMetadata.file_name,
          file_format: file3dMetadata.file_format,
          file_size: file3dMetadata.file_size,
          s3_key: file3dMetadata.s3_key,
          s3_url: file3dMetadata.s3_url,
        };

        const model3dResponse = await fetch(`${API_URL}/models3d/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(model3dPayload),
        });

        if (!model3dResponse.ok) {
          const errorData = await model3dResponse.json();
          console.error("Error al guardar metadata del archivo 3D:", errorData);
          // No lanzamos error aquí para no interrumpir el flujo, solo lo registramos
        }
      }

      // Paso 3: Crear la orden médica solo si es doctor
      if (isDoctor) {
        const medicalOrderPayload = {
          order_id: orderId,
          patient_id: parseInt(medicalOrderData.patient_id),
          urgency_level: medicalOrderData.urgency_level,
          pathology: medicalOrderData.pathology,
          medical_observations: medicalOrderData.medical_observations || "",
          priority_level: null,
        };

        const medicalOrderResponse = await fetch(`${API_URL}/orders/create-medical`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(medicalOrderPayload),
        });

        if (!medicalOrderResponse.ok) {
          const errorData = await medicalOrderResponse.json();
          throw new Error(errorData.detail || "Error al crear la orden médica");
        }
      }

      // Éxito
      setMessage({ type: "success", text: "Orden creada exitosamente ✅" });
      setShowModal(true);

      // Limpiar el formulario
      setSelectedSpeciality(null);
      setSelectedProsthesis(null);
      setSelectedSize("");
      setSelectedMaterial("");
      setFile3d(null);
      setFile3dMetadata(null);
      setOrderData({
        prosthesis_id: "",
        material_id: "",
        size_id: "",
        has_design: false,
        processing_level: "",
        specification: "",
      });
      setMedicalOrderData({
        patient_id: "",
        urgency_level: "",
        pathology: "",
        medical_observations: "",
      });

    } catch (error) {
      console.error("Error al crear la orden:", error);
      setMessage({ type: "error", text: `Error: ${error.message} ❌` });
      setShowModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setMessage({ type: "", text: "" });
  };

  const handleConfirmSubmit = () => {
    // El usuario confirmó que quiere enviar sin esperar
    submitOrder();
  };

  const handleCancelSubmit = () => {
    // El usuario canceló el envío
    setShowConfirmModal(false);
    setPendingSubmit(false);
  };

  if (loading) {
    return <div className="cotizacion-page">Cargando...</div>;
  }

  return (
    <div className="cotizacion-page">
      <main className="main-content">
        <section className="intro">
          <h1>Crear Orden de Prótesis</h1>
          <p>Complete el formulario paso a paso para crear una nueva orden de prótesis médica.</p>
        </section>

        <section className="seleccion-protesis">
          <form onSubmit={handleSubmit}>
            {/* Paso 1: Selección de Especialidad */}
            <div className="seccion-cotizacion">
              <h3>1. Seleccione la Especialidad</h3>
              <div className="especialidades">
                {specialities.map((speciality) => (
                  <button
                    key={speciality.id}
                    type="button"
                    className={`btn ${selectedSpeciality?.id === speciality.id ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => handleSpecialitySelect(speciality)}
                  >
                    {speciality.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Paso 2: Selección de Prótesis */}
            {selectedSpeciality && (
              <div className="seccion-cotizacion">
                <h3>2. Elija una Prótesis</h3>
                <div className="protesis-grid">
                  {getProsthesesForSpeciality().map((prosthesis) => (
                    <div
                      key={prosthesis.id}
                      className={`protesis-card ${selectedProsthesis?.id === prosthesis.id ? "selected" : ""}`}
                      onClick={() => handleProsthesisSelect(prosthesis)}
                    >
                      <div className="img-protesis">
                        {prosthesis.img_url ? (
                          <img
                            src={prosthesis.img_url}
                            alt={prosthesis.name}
                          />
                        ) : (
                          <span>{prosthesis.name}</span>
                        )}
                      </div>
                      <h4>{prosthesis.name}</h4>
                      <p className="precio-base">
                        {prosthesis.base_price
                          ? `Desde $${prosthesis.base_price.toLocaleString()}`
                          : "Precio no disponible"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 3: Selección de Talla y Material */}
            {selectedProsthesis && (
              <div className="seccion-cotizacion">
                <h3>3. Complete los Detalles</h3>

                {/* Talla */}
                <div className="form-field">
                  <label htmlFor="size_id" className="form-label">
                    Talla *
                  </label>
                  <select
                    id="size_id"
                    name="size_id"
                    value={selectedSize}
                    onChange={handleSizeChange}
                    className="select-custom"
                    required
                  >
                    <option value="">Seleccione una talla</option>
                    {getSizesForProsthesis().map((size) => (
                      <option key={size.id} value={size.id}>
                        {size.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Material */}
                <div className="form-field">
                  <label htmlFor="material_id" className="form-label">
                    Material *
                  </label>
                  <select
                    id="material_id"
                    name="material_id"
                    value={selectedMaterial}
                    onChange={handleMaterialChange}
                    className="select-custom"
                    required
                  >
                    <option value="">Seleccione un material</option>
                    {getMaterialsForProsthesis().map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Archivo de modelo 3D */}
                <div className="form-field">
                  <label htmlFor="file3d" className="form-label">
                    Archivo de modelo 3D
                  </label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      accept=".stl,.obj,.gltf,.glb"
                      onChange={handleFileChange}
                      id="file3d"
                      className="file-input-hidden"
                    />
                    <label
                      htmlFor="file3d"
                      className="file-input-label"
                    >
                      {uploadingFile
                        ? "Subiendo archivo..."
                        : file3d
                          ? file3d.name
                          : "Seleccionar archivo 3D"}
                    </label>
                  </div>
                  <small className="file-upload-hint">
                    Formatos permitidos: .stl, .obj, .gltf, .glb
                    {file3dMetadata && (
                      <span className="file-upload-success">
                        ✓ Archivo subido exitosamente
                      </span>
                    )}
                  </small>
                </div>

                {/* Nivel de Procesamiento */}
                <div className="form-field">
                  <label htmlFor="processing_level" className="form-label">
                    Nivel de Procesamiento *
                  </label>
                  <input
                    type="text"
                    id="processing_level"
                    name="processing_level"
                    value={orderData.processing_level}
                    onChange={handleOrderChange}
                    className="select-custom"
                    placeholder="Ingrese el nivel de procesamiento"
                    required
                  />
                </div>

                {/* Especificación */}
                <div className="form-field">
                  <label htmlFor="specification" className="form-label">
                    Especificación *
                  </label>
                  <textarea
                    id="specification"
                    name="specification"
                    value={orderData.specification}
                    onChange={handleOrderChange}
                    className="select-custom"
                    placeholder="Ingrese las especificaciones"
                    rows="4"
                    required
                  />
                </div>
              </div>
            )}

            {/* Paso 4: Datos de Orden Médica (solo si es doctor y se completaron los campos básicos) */}
            {canShowMedicalOrder() && (
              <div className="seccion-cotizacion">
                <h3>4. Datos de la Orden Médica</h3>

                {/* Paciente */}
                <div className="form-field">
                  <label htmlFor="patient_id" className="form-label">
                    Paciente *
                  </label>
                  <select
                    id="patient_id"
                    name="patient_id"
                    value={medicalOrderData.patient_id}
                    onChange={handleMedicalOrderChange}
                    className="select-custom"
                    required
                  >
                    <option value="">Seleccione un paciente</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} {patient.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nivel de Urgencia */}
                <div className="form-field">
                  <label htmlFor="urgency_level" className="form-label">
                    Nivel de Urgencia *
                  </label>
                  <select
                    id="urgency_level"
                    name="urgency_level"
                    value={medicalOrderData.urgency_level}
                    onChange={handleMedicalOrderChange}
                    className="select-custom"
                    required
                  >
                    <option value="">Seleccione el nivel de urgencia</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>

                {/* Patología */}
                <div className="form-field">
                  <label htmlFor="pathology" className="form-label">
                    Patología *
                  </label>
                  <input
                    type="text"
                    id="pathology"
                    name="pathology"
                    value={medicalOrderData.pathology}
                    onChange={handleMedicalOrderChange}
                    className="select-custom"
                    placeholder="Ingrese la patología"
                    required
                  />
                </div>

                {/* Observaciones Médicas */}
                <div className="form-field">
                  <label htmlFor="medical_observations" className="form-label">
                    Observaciones Médicas
                  </label>
                  <textarea
                    id="medical_observations"
                    name="medical_observations"
                    value={medicalOrderData.medical_observations}
                    onChange={handleMedicalOrderChange}
                    className="select-custom"
                    placeholder="Ingrese las observaciones médicas (opcional)"
                    rows="4"
                  />
                </div>
              </div>
            )}

            {/* Resumen de Precio Aproximado */}
            {priceCalculation && selectedProsthesis && selectedSize && selectedMaterial && (
              <div className="seccion-cotizacion">
                <div className="price-summary">
                  <h3>Resumen de Precio Aproximado</h3>
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span className="price-label">Precio Base:</span>
                      <span className="price-value">${priceCalculation.basePrice.toLocaleString('es-AR')}</span>
                    </div>
                    {priceCalculation.sizeModifier > 0 && (
                      <div className="price-row">
                        <span className="price-label">Modificador de Tamaño ({priceCalculation.sizeModifier * 100}%):</span>
                        <span className="price-value">+${(priceCalculation.basePrice * priceCalculation.sizeModifier).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {priceCalculation.materialModifier > 0 && (
                      <div className="price-row">
                        <span className="price-label">Modificador de Material ({priceCalculation.materialModifier * 100}%):</span>
                        <span className="price-value">+${(priceCalculation.basePrice * priceCalculation.materialModifier).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="price-row price-total">
                      <span className="price-label">Precio Total Aproximado:</span>
                      <span className="price-value">${priceCalculation.fullPrice.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  <p className="price-note">* Este es un precio aproximado. El precio final puede variar según especificaciones adicionales.</p>
                </div>
              </div>
            )}

            {/* Botón de envío - solo mostrar si se completaron los campos básicos y hay usuario logueado */}
            {(!isDoctor || (isDoctor && medicalOrderData.patient_id && medicalOrderData.urgency_level && medicalOrderData.pathology)) && (
              <div className="seccion-cotizacion">
                {user ? (
                  <button
                    type="submit"
                    className="btn btn-cotizar"
                    disabled={submitting}
                  >
                    {submitting ? isBasicFormComplete() ? "Creando orden..." : "Completar formulario" : "Crear Orden"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-cotizar"
                    onClick={() => navigate("/login")}

                  >
                    Iniciar Sesión para Crear Orden
                  </button>
                )}
              </div>
            )}
          </form>
        </section>
      </main>

      {/* Modal de mensajes */}
      {showModal && message.text && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className={`modal-content ${message.type === "success" ? "modal-success" : "modal-error"}`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {message.type === "success" ? "✓ Éxito" : "✗ Error"}
              </h2>
              <button className="modal-close" onClick={closeModal} aria-label="Cerrar">
                ×
              </button>
            </div>
            <div className="modal-body">
              {message.text}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={closeModal}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para envío durante subida */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleCancelSubmit}>
          <div className="modal-content modal-warning" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                ⚠️ Archivo en proceso de subida
              </h2>
              <button className="modal-close" onClick={handleCancelSubmit} aria-label="Cerrar">
                x
              </button>
            </div>
            <div className="modal-body">
              <p>Actualmente se está subiendo un archivo 3D. Si envía la orden ahora, el archivo no se incluirá en la orden.</p>
              <p className="modal-confirm-question">¿Desea continuar con el envío sin esperar a que termine la subida del archivo?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCancelSubmit}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleConfirmSubmit}>
                Enviar sin esperar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
