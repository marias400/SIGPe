// src/pages/Home.jsx
import React from "react";
import "../styles/Home.css";

export default function Home() {
  const materiales = [
    {
      title: "PLA",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvQDBOl1muugZJpOrRyyDmGQbE3bkB-sZgX4g8iYKxsJxuAhkJVoozAVz1XO9-Vq_UBfdusdQMpYeAd36jTJsmkmpRoFU4SpPAHsYLe-rN2Lk_FgJR8Oo3b2MJtfsUl5iXWOwXE-Pwos0CE1aLhFMMHxvIzzUkx5_5nyEKcoToIe7-_cZrPl79ah2Ph1RRrPgshMfDtYeMobzquktRCyuSZfEzVnYnVlvT3x8WXvjyjc_CUscQkrhEUskR8PNNyC-2tAQfyXFkENw",
      desc: "Ideal para prototipos rápidos y modelos conceptuales por su facilidad de uso y bajo costo.",
    },
    {
      title: "ABS",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBItTCM10d1Bnt4PM8YnN-vEUppqYb-yTjzALNZP2S3PKrtalEWsfwyyvrL0JRbpo85oQTUvBccYBBabPEPBA14IRSIeBLJqiXmbCuKRoaaoxTtVb5q2BmEVGi3J-160CDsnbgNAynQe4MML7SnDMK0ZQxygJYTd0XKxrCkwStnkkafgfxculN8hi4pC8nMgeL8hXzm7bCo2sA4HBWrwZO4acp-L1WlsaEq__zw-zb4epFT1mKcxKdQEr41AB5QLU7SG-yfuQLoP_o",
      desc: "Conocido por su durabilidad y resistencia al impacto, perfecto para piezas funcionales y prototipos robustos.",
    },
    {
      title: "PETG",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPsOf23NQcnVi4moA-hJHkU7z7kXIQJs0J8xThEVHEsPAeKbGAESwDd-WBrHpcz1Pm7Mme2ZPmXB_EpXIubjjqJdp5dRudN1j2-lejG0SlVKurghG6wbI5CREPxruV5LfmYrYuqdZyuJQHOI9y5CRBd3eZIh31esu4UrI7Ea2uq0SV-xx-Qct-Az8ErJnlSw2vyF1bkVERk3KhCWVufYRW2ZgRzOe-vD0WzR5dhfEKBuqDy8LeOW5tN1Ho9ZD3QYBGiE1sV-pXIUw",
      desc: "Combina la facilidad del PLA con la resistencia del ABS. Apto para contacto con alimentos y aplicaciones médicas.",
    },
    {
      title: "Resina",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmnI-4DPoDSNGK0dPkarABcI6NPCukfupGi9Of7o0OiBNWfiq_J8WGJFu6ZcVdTPCHOjBHCT2Pa9lVWGbh6_lVlpNt7Ih4gktX356E57o3pOUr3TuThrDDwvUfU2ANP_Uf6_04pkt4xOCUSyodS56T9sNt31NVW-yaovWCkP9NMQlsS8QAj2BQ3MUELEihfzJVpoAkaJNEusnhUwv6vIfcKGGceaUkr-Bi8i8NpoVNSaxO_-ELqZQe_8FQynmlBMJLZEY8un6cVpM",
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
            <button className="btn-primary">Solicitar una cotización</button>
            <button className="btn-secondary">Ver nuestros proyectos</button>
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
            <button className="btn-primary">Saber más</button>
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
                  <button className="btn-material">Conoce Más</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}