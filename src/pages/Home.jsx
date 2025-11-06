// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const materiales = [
    {
      title: "PLA",
      img: "https://...",
      desc: "Ideal para prototipos rápidos y modelos conceptuales por su facilidad de uso y bajo costo.",
    },
    {
      title: "ABS",
      img: "https://...",
      desc: "Conocido por su durabilidad y resistencia al impacto, perfecto para piezas funcionales y prototipos robustos.",
    },
    {
      title: "PETG",
      img: "https://...",
      desc: "Combina la facilidad del PLA con la resistencia del ABS. Apto para contacto con alimentos y aplicaciones médicas.",
    },
    {
      title: "Resina",
      img: "https://...",
      desc: "Ofrece un nivel de detalle excepcional, ideal para modelos dentales, joyería y figuras de alta resolución.",
    },
  ];

  return (
    <main className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-content">
            <h1>Innovación 3D para la medicina del futuro</h1>
            <h2>Precisión y calidad en cada impresión</h2>
          </div>
          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/cotizacion")}
            >
              Solicitar una cotización
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Ver nuestros proyectos
            </button>
            {/* 🔗 Botón de acceso al login */}
            <button
              className="btn-login"
              onClick={() => navigate("/login")}
            >
              Ingresar
            </button>
          </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section id="quienes-somos" className="section">
        <div className="section-content">
          <h2>Nuestro Compromiso con la Innovación Médica</h2>
          <p>
            En SIGPe, nos dedicamos a impulsar la vanguardia de la tecnología médica a través de la impresión 3D.
            Nuestra misión es proporcionar a investigadores, clínicos y estudiantes las herramientas más avanzadas
            para materializar sus proyectos, desde modelos anatómicos de alta precisión hasta prototipos de
            dispositivos médicos innovadores.
          </p>
          <div className="section-btn">
            <button
              className="btn-primary"
              onClick={() => navigate("/quienes-somos")}
            >
              Saber más
            </button>
          </div>
        </div>
      </section>

      {/* Materiales */}
      <section id="materiales" className="section materiales-section">
        <div className="section-content">
          <h2>Materiales de Alta Calidad</h2>
          <div className="materiales-grid">
            {materiales.map((item) => (
              <div key={item.title} className="material-card">
                <img src={item.img} alt={item.title} />
                <div className="material-info">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <button
                    className="btn-material"
                    onClick={() => navigate("/materiales")}
                  >
                    Conoce Más
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
