import React from "react";
import "../styles/AboutUs.css";

// --- IMPORTACIÓN DE IMÁGENES ---
import heroImg from "../public/assets/3d-printer-lab-medical.jpg";
import womanImg from "../public/assets/professional-woman-portrait.jpg";
import manImg from "../public/assets/professional-man-portrait.jpg";

// --- ÍCONOS ---
const Icons = {
  Printer: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
  ),
  Shield: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
  ),
  Cpu: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
  ),
  Target: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
  ),
  Eye: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  ),
  Star: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
  ),
  Heart: () => (
    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M12 5 9.04 11l1.63 3 2.66-6 1.67 3" /></svg>
  ),
};

export default function AboutUs() {
  return (
    <div className="about-page">

      {/* 1. HERO (Fondo Blanco Full Width) */}
      <section className="hero-wrapper">
        <div className="container hero-grid">
          <div className="hero-text-content">
            <span className="badge-pill">Innovación en Salud</span>
            <h1>Laboratorio de Diseño y Fabricación Digital</h1>
            <p>
              Innovación tecnológica aplicada a la salud en la Provincia de La Rioja.
              Un puente entre la Universidad Nacional de La Rioja (UNLaR) y el Hospital Virgen de Fátima.
            </p>
            <div className="hero-actions">
              <button className="btn-primary">Contáctanos</button>
              <button className="btn-outline">Conocer Servicios</button>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img src={heroImg} alt="Laboratorio 3D" />
                

            <div className="floating-card">
              <div className="float-icon"><Icons.Printer /></div>

              {/* AGREGA className="float-text" AQUÍ 👇 */}
              <div className="float-text">
                <span className="float-label">Tecnología</span>
                <strong>Impresión 3D</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NUESTRA ESENCIA (Fondo Blanco Full Width) */}
      <section className="section">
        <div className="container">
          <h2 className="section-title-center">Nuestra Esencia</h2>
          <p className="section-subtitle">Los pilares que sostienen nuestro compromiso con la salud pública.</p>
          <div className="mvv-grid">
            <div className="mvv-card">
              <div className="mvv-icon-wrapper"><Icons.Target /></div>
              <h3>Misión</h3>
              <p>Brindar las herramientas y la infraestructura adecuada para generar nuevos avances en investigación, desarrollo e innovación.</p>
            </div>
            <div className="mvv-card">
              <div className="mvv-icon-wrapper"><Icons.Eye /></div>
              <h3>Visión</h3>
              <p>Conseguir un sistema sanitario provincial reconocido y fortalecido, fomentando su capacidad de trasladar los resultados a la salud.</p>
            </div>
            <div className="mvv-card">
              <div className="mvv-icon-wrapper"><Icons.Shield /></div>
              <h3>Valores</h3>
              <ul className="values-list">
                <li>Calidad</li>
                <li>Precisión</li>
                <li>Innovación</li>
                <li>Colaboración</li>
                <li>Ética</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IMPACTO (Fondo Oscuro Full Width) */}
      <section className="impact-section-dark">
        <div className="container impact-grid">
          <div className="impact-text-dark">
            <h2 className="impact-title-dark">Impacto en la Salud</h2>
            <p className="impact-desc">
              El laboratorio ofrece servicios de impresión 3D de prototipos bajo pedido, escaneo 3D de objetos y piezas anatómicas, diseño y segmentación de modelos digitales.
            </p>

            <div className="impact-features">
              <div className="feature-box">
                <h4>Servicios</h4>
                <p>Impresión 3D, Escaneo, Diseño y Segmentación digital.</p>
              </div>
              <div className="feature-box">
                <h4>Productos</h4>
                <p>Modelos anatómicos, cartelería médica, prototipos educativos.</p>
              </div>
              <div className="feature-box full-width">
                <h4>Futuro</h4>
                <p>Guías quirúrgicas certificadas, prótesis y órtesis a medida.</p>
              </div>
            </div>
          </div>

          <div className="impact-visual-card">
            <div className="heart-icon">
              <Icons.Heart />
            </div>
            <h3>Tecnología al servicio de la vida.</h3>
          </div>
        </div>
      </section>

      {/* 4. TECNOLOGÍA (Fondo GRIS Full Width) */}
      
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title-center">Nuestra Tecnología</h2>
          <p className="section-subtitle">Equipamiento de vanguardia para resultados precisos.</p>
          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-icon"><Icons.Printer /></div>
              <h3 className="tech-title">Impresoras de Alta Precisión</h3>
              <p>Utilizamos impresoras SLA y FDM para garantizar modelos con detalles finos y alta resistencia mecánica.</p>
            </div>
            <div className="tech-card">
              <div className="tech-icon"><Icons.Cpu /></div>
              <h3 className="tech-title">Biomateriales Certificados</h3>
              <p>Empleamos materiales biocompatibles y esterilizables, seguros para el contacto con el paciente y uso en quirófano.</p>
            </div>
            <div className="tech-card">
              <div className="tech-icon"><Icons.Star /></div>
              <h3 className="tech-title">Software Avanzado</h3>
              <p>Contamos con licencias de software especializado para la segmentación de imágenes médicas y el diseño de dispositivos a medida.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HISTORIA (Fondo BLANCO Full Width) */}
      <section className="section timeline-section">
        <div className="container">
          <h2 className="section-title-center">Nuestra Historia</h2>
          <div className="timeline-centered">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <span className="timeline-date">Julio 2022 </span>
              <div className="timeline-content">
                <h3>Formulación del Proyecto</h3>
                <p>Aprobación del proyecto en el marco de la convocatoria Proyectos Federales de Innovación 2022.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <span className="timeline-date">2022 </span>
              <div className="timeline-content">
                <h3>Inicio Operativo</h3>
                <p>El laboratorio inicia su funcionamiento en un espacio provisorio ubicado en las instalaciones del Centro de Investigación e Innovación Tecnológica (CENIIT).</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <span className="timeline-date">2022-2024 </span>
              <div className="timeline-content">
                <h3>Primera Etapa</h3>
                <p>Enfoque en actividades de baja complejidad clínica y académicas: producción de cartelería institucional, modelos anatómicos para docencia y prototipos experimentales.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <span className="timeline-date">2025</span>
              <div className="timeline-content">
                <h3>Transición Estratégica</h3>
                <p>Preparación para la instalación definitiva en el Hospital Virgen de Fátima, permitiendo la expansión hacia servicios de mayor complejidad médica como guías quirúrgicas certificadas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EQUIPO (Fondo GRIS Full Width) */}
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title-center">Nuestro Equipo</h2>
          <p className="section-subtitle">Profesionales dedicados a la innovación médica.</p>

          <div className="team-grid">
            <div className="team-card">
              <div className="team-image-container">
                <img src={womanImg} alt="Bioing. María Noel Oliva" className="team-image" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Bioing. María Noel Oliva</h3>
                <span className="team-role">Directora del Laboratorio</span>
                <p className="team-bio">Responsable de la gestión institucional, la planificación estratégica y la validación clínica de los pedidos. Asegura la vinculación con el hospital, la universidad y organismos externos, además de definir prioridades de producción según criterios de salud pública.</p>
              </div>
            </div>

            <div className="team-card">
              <div className="team-image-container">
                <img src={manImg} alt="Agustín Nicolás Álvarez" className="team-image" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Agustín Nicolás Álvarez</h3>
                <span className="team-role">Técnico - Operador Principal</span>
                <p className="team-bio">Operador principal y referente en impresión 3D, cuya experiencia autodidacta en mantenimiento, calibración y operación de equipos fue esencial para poner en marcha el laboratorio y garantizar su funcionamiento cotidiano.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA (Full Width implícito) */}
      <section className="section cta-section">
        <div className="container cta-box">
          <h2>¿Listo para innovar con nosotros?</h2>
          <p>Contáctanos para conocer más sobre nuestros servicios de impresión 3D y diseño médico personalizado.</p>
          <button className="btn-white">Solicitar Cotización →</button>
        </div>
      </section>

    </div>
  );
}