
import React, { useState } from "react";
import "../styles/Cotizacion.css";

const Cotizacion = () => {
  const [especialidad, setEspecialidad] = useState("");
  const [protesisSeleccionada, setProtesisSeleccionada] = useState(null);
  const [material, setMaterial] = useState("");
  const [talla, setTalla] = useState("");
  const [urgencia, setUrgencia] = useState("");
  const [mostrarCotizacion, setMostrarCotizacion] = useState(false);

  const protesis = [
    {
      id: 1,
      nombre: "Corona Dental",
      especialidad: "Odontología",
      imagen: "/img/corona-dental.jpg",
      materiales: ["Resina", "Porcelana", "Zirconio"],
      tallas: ["S", "M", "L"],
      precioBase: 15000
    },
    {
      id: 2,
      nombre: "Férula Oclusal",
      especialidad: "Odontología",
      imagen: "/img/ferula.jpg",
      materiales: ["Resina", "Acrílico"],
      tallas: ["Único"],
      precioBase: 8000
    },
    {
      id: 3,
      nombre: "Prótesis de Mano",
      especialidad: "Terapia Ocupacional",
      imagen: "/img/protesis-mano.jpg",
      materiales: ["Filamento PLA", "Filamento ABS"],
      tallas: ["S", "M", "L", "XL"],
      precioBase: 25000
    },
    {
      id: 4,
      nombre: "Órtesis de Muñeca",
      especialidad: "Terapia Ocupacional",
      imagen: "/img/ortesis-muneca.jpg",
      materiales: ["Filamento PLA", "TPU"],
      tallas: ["S", "M", "L"],
      precioBase: 12000
    }
  ];

  const protesisFiltradas = especialidad 
    ? protesis.filter(p => p.especialidad === especialidad)
    : [];

  const materialesDisponibles = protesisSeleccionada 
    ? protesisSeleccionada.materiales 
    : [];

  const tallasDisponibles = protesisSeleccionada 
    ? protesisSeleccionada.tallas 
    : [];

  const calcularPrecio = () => {
    if (!protesisSeleccionada) return 0;
    
    let precio = protesisSeleccionada.precioBase;
    
    // Ajuste por material
    if (material === "Porcelana" || material === "Zirconio") {
      precio *= 1.5;
    } else if (material === "Filamento ABS" || material === "TPU") {
      precio *= 1.2;
    }
    
    // Ajuste por talla
    if (talla === "L") precio *= 1.1;
    if (talla === "XL") precio *= 1.2;
    
    // Ajuste por urgencia
    if (urgencia === "Prioritario") precio *= 1.3;
    if (urgencia === "Urgente") precio *= 1.6;
    
    return Math.round(precio);
  };

  const obtenerTiempoEntrega = () => {
    if (urgencia === "Estándar") return "7-10 días hábiles";
    if (urgencia === "Prioritario") return "3-5 días hábiles";
    if (urgencia === "Urgente") return "24-48 horas";
    return "";
  };

  const handleCotizar = () => {
    if (protesisSeleccionada && material && talla && urgencia) {
      setMostrarCotizacion(true);
    } else {
      alert("Por favor complete todos los campos para obtener la cotización");
    }
  };

  const reiniciarCotizacion = () => {
    setEspecialidad("");
    setProtesisSeleccionada(null);
    setMaterial("");
    setTalla("");
    setUrgencia("");
    setMostrarCotizacion(false);
  };

  return (
    <div className="cotizacion-page">
      <main className="main-content">
        <section className="intro">
          <h1>Cotización de Prótesis Médicas</h1>
          <p>Selecciona la especialidad y el tipo de prótesis para obtener una cotización precisa.</p>
        </section>

        {!mostrarCotizacion ? (
          <section className="seleccion-protesis">
            {/* 1. Especialidad */}
            <div className="seccion-cotizacion">
              <h3>1. Seleccione la Especialidad</h3>
              <div className="especialidades">
                <button
                  type="button"
                  className={`btn ${especialidad === "Odontología" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => {
                    setEspecialidad("Odontología");
                    setProtesisSeleccionada(null);
                    setMaterial("");
                    setTalla("");
                  }}
                >
                  Odontología
                </button>
                <button
                  type="button"
                  className={`btn ${especialidad === "Terapia Ocupacional" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => {
                    setEspecialidad("Terapia Ocupacional");
                    setProtesisSeleccionada(null);
                    setMaterial("");
                    setTalla("");
                  }}
                >
                  Terapia Ocupacional
                </button>
              </div>
            </div>

            {/* 2. Prótesis */}
            {especialidad && (
              <div className="seccion-cotizacion">
                <h3>2. Elija una Prótesis</h3>
                <div className="protesis-grid">
                  {protesisFiltradas.map((protesis) => (
                    <div
                      key={protesis.id}
                      className={`protesis-card ${protesisSeleccionada?.id === protesis.id ? "selected" : ""}`}
                      onClick={() => {
                        setProtesisSeleccionada(protesis);
                        setMaterial("");
                        setTalla("");
                      }}
                    >
                      <div className="img-protesis">
                        <span>{protesis.nombre}</span>
                      </div>
                      <h4>{protesis.nombre}</h4>
                      <p className="precio-base">Desde ${protesis.precioBase.toLocaleString()}</p>
                      <div className="tags">
                        {protesis.materiales.slice(0, 2).map((mat, idx) => (
                          <span key={idx} className="tag material">{mat}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Material */}
            {protesisSeleccionada && (
              <div className="seccion-cotizacion">
                <label htmlFor="material-select">
                  <h3>3. Tipo de Material</h3>
                </label>
                <select 
                  id="material-select"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="select-custom"
                >
                  <option value="">Seleccione un material</option>
                  {materialesDisponibles.map((mat, idx) => (
                    <option key={idx} value={mat}>{mat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 4. Tallas */}
            {material && (
              <div className="seccion-cotizacion">
                <label htmlFor="talla-select">
                  <h3>4. Talla</h3>
                </label>
                <select 
                  id="talla-select"
                  value={talla}
                  onChange={(e) => setTalla(e.target.value)}
                  className="select-custom"
                >
                  <option value="">Seleccione una talla</option>
                  {tallasDisponibles.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 5. Urgencia */}
            {talla && (
              <div className="seccion-cotizacion">
                <h3>5. Nivel de Urgencia</h3>
                <div className="urgencia">
                  <button
                    type="button"
                    className={`btn ${urgencia === "Estándar" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setUrgencia("Estándar")}
                  >
                    Estándar (7-10 días)
                  </button>
                  <button
                    type="button"
                    className={`btn ${urgencia === "Prioritario" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setUrgencia("Prioritario")}
                  >
                    Prioritario (3-5 días)
                  </button>
                  <button
                    type="button"
                    className={`btn ${urgencia === "Urgente" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setUrgencia("Urgente")}
                  >
                    Urgente (24-48h)
                  </button>
                </div>
              </div>
            )}

            {/* Botón Cotizar */}
            {urgencia && (
              <div className="seccion-cotizacion">
                <button
                  type="button"
                  className="btn btn-cotizar"
                  onClick={handleCotizar}
                >
                  Obtener Cotización
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="resultado-cotizacion">
            <div className="cotizacion-card">
              <h2>Cotización Generada</h2>
              
              <div className="detalle-cotizacion">
                <div className="item-detalle">
                  <span className="label">Especialidad:</span>
                  <span className="valor">{especialidad}</span>
                </div>
                <div className="item-detalle">
                  <span className="label">Prótesis:</span>
                  <span className="valor">{protesisSeleccionada.nombre}</span>
                </div>
                <div className="item-detalle">
                  <span className="label">Material:</span>
                  <span className="valor">{material}</span>
                </div>
                <div className="item-detalle">
                  <span className="label">Talla:</span>
                  <span className="valor">{talla}</span>
                </div>
                <div className="item-detalle">
                  <span className="label">Urgencia:</span>
                  <span className="valor">{urgencia}</span>
                </div>
                <div className="item-detalle">
                  <span className="label">Tiempo de entrega:</span>
                  <span className="valor">{obtenerTiempoEntrega()}</span>
                </div>
              </div>

              <div className="precio-total">
                <span className="label-precio">Precio Total:</span>
                <span className="valor-precio">${calcularPrecio().toLocaleString()}</span>
              </div>

              <div className="acciones-cotizacion">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => alert("Funcionalidad de pedido en desarrollo")}
                >
                  Realizar Pedido
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={reiniciarCotizacion}
                >
                  Nueva Cotización
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Cotizacion;
