import "../styles/AboutUs.css";
import bg from "../public/assets/About_us_image.avif";

const timelineData = [
  {
    year: "Julio 2022 - Formulación del Proyecto",
    text: "Aprobación del proyecto en el marco de la convocatoria Proyectos Federales de Innovación 2022 (PFI 2022) del Consejo Federal de Ciencia y Tecnología (COFECyT).",
  },
  {
    year: "2022 - Inicio Operativo",
    text: "El laboratorio inicia su funcionamiento en un espacio provisorio ubicado en las instalaciones del Centro de Investigación e Innovación Tecnológica (CENIIT).",
  },
  {
    year: "2022-2024 - Primera Etapa",
    text: "Enfoque en actividades de baja complejidad clínica y académicas: producción de cartelería institucional, modelos anatómicos para docencia y prototipos experimentales.",
  },
  {
    year: "2025 - Transición Estratégica",
    text: "Preparación para la instalación definitiva en el Hospital Virgen de Fátima, permitiendo la expansión hacia servicios de mayor complejidad médica como guías quirúrgicas certificadas.",
  },
];

const teamData = [
  {
    name: "Bioing. María Noel Oliva",
    role: "Directora del Laboratorio",
    description:
      "Responsable de la gestión institucional, la planificación estratégica y la validación clínica de los pedidos. Asegura la vinculación con el hospital, la universidad y organismos externos, además de definir prioridades de producción según criterios de salud pública.",
    img: "https://avatar.iran.liara.run/public/girl",
  },
  {
    name: "Agustín Nicolás Álvarez",
    role: "Técnico - Operador Principal",
    description:
      "Operador principal y referente en impresión 3D, cuya experiencia autodidacta en mantenimiento, calibración y operación de equipos fue esencial para poner en marcha el laboratorio y garantizar su funcionamiento cotidiano.",
    img: "https://avatar.iran.liara.run/public/boy",
  },
];

const technologyData = [
  {
    title: "Impresoras de Alta Precisión",
    description:
      "Utilizamos impresoras SLA y FDM para garantizar modelos con detalles finos y alta resistencia mecánica.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="tech-icon"
      >
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
    ),
  },
  {
    title: "Biomateriales Certificados",
    description:
      "Empleamos materiales biocompatibles y esterilizables, seguros para el contacto con el paciente y uso en quirófano.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="tech-icon"
      >
        <path d="M14.5 2.5L16 4l4.5-4.5"></path>
        <path d="M10.5 4L2 12.5l2.5 2.5L12 6.5l-1.5-2.5z"></path>
        <path d="M17.5 11l-3 3"></path>
        <path d="M8 2v10c0 4.42 3.58 8 8 8s8-3.58 8-8V2z"></path>
      </svg>
    ),
  },
  {
    title: "Software Avanzado",
    description:
      "Contamos con licencias de software especializado para la segmentación de imágenes médicas y el diseño de dispositivos a medida.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="tech-icon"
      >
        <polyline points="14.5 17.5 12 15 9.5 17.5"></polyline>
        <line x1="12" y1="15" x2="12" y2="22"></line>
        <line x1="12" y1="2" x2="12" y2="15"></line>
        <line x1="10" y1="4" x2="14" y2="4"></line>
        <path d="M12 2v20"></path>
        <path d="M2 12h20"></path>
        <path d="M3 3l18 18"></path>
        <path d="M3 21l18-18"></path>
      </svg>
    ),
  },
];

const QuienesSomos = () => {
  return (
    //  PASO 1: Envolver todo en un Fragmento de React (<> ... </>)
    <>
      {/* PASO 2: Mover el Hero Section FUERA y ANTES del <main> */}
      <div
        className="hero-section"
        style={{
          backgroundImage:
            `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${bg})`,
        }}
      >
        <h1>Laboratorio de Diseño y Fabricación Digital</h1>
        <p>
          Innovación tecnológica aplicada a la salud en la Provincia de La Rioja
          <br />
          Universidad Nacional de La Rioja (UNLaR) - Hospital Virgen de Fátima
        </p>
        <button>Contáctanos</button>
      </div>

      
      <main className="main-container">
        {/* Misión, Visión y Valores */}
        <section>
          <h2>Misión, Visión y Valores</h2>
          <div className="mv-values">
            <div className="mv-card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 15.64c2-.87 4.28-.76 6.18.33 1.37.78 2.89 1.18 4.42 1.18 1.12 0 2.24-.21 3.32-.64l1.45-.58A1 1 0 0 0 21 15V4a1 1 0 0 0-1.37-.93l-1.45.58c-1.97.79-4.16.63-6-.42A8.9 8.9 0 0 0 3.77 3l-.21.1a1 1 0 0 0-.55.89v18h2v-6.36ZM5 4.63c2-.87 4.28-.75 6.18.34 2.37 1.36 5.19 1.55 7.74.54l.08-.03v8.85l-.82.33a6.85 6.85 0 0 1-6-.42 8.95 8.95 0 0 0-4.42-1.18c-.93 0-1.86.15-2.75.44V4.63Z"></path>
              </svg>
              <h3>Misión</h3>
              <p>
                Brindar las herramientas y la infraestructura adecuada, para generar nuevos avances en investigación,
                desarrollo e innovación (I+D+i) mediante el diseño y la fabricación digital, con la finalidad primordial
                de mejorar la calidad y los servicios en el sistema sanitario público de la provincia de La Rioja.
              </p>
            </div>
            <div className="mv-card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6"></path>
                <path d="M12 19c7.63 0 9.93-6.62 9.95-6.68.07-.21.07-.43 0-.63-.02-.07-2.32-6.68-9.95-6.68s-9.93 6.61-9.95 6.67c-.07.21-.07.43 0 .63.02.07 2.32 6.68 9.95 6.68Zm0-12c5.35 0 7.42 3.85 7.93 5-.5 1.16-2.58 5-7.93 5s-7.42-3.84-7.93-5c.5-1.16 2.58-5 7.93-5"></path>
              </svg>
              <h3>Visión</h3>
              <p>
                Conseguir un sistema sanitario provincial reconocido y fortalecido por sus actividades de investigación,
                desarrollo e innovación, fomentando su capacidad de trasladar los resultados a la mejora de la salud,
                y convirtiéndose en uno de los motores del desarrollo de la provincia.
              </p>
            </div>
            <div className="mv-card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 2H6c-1.1 0-2 .9-2 2v17c0 .36.19.69.5.87s.69.18 1 0l6.5-3.72 6.5 3.72c.15.09.32.13.5.13s.35-.04.5-.13c.31-.18.5-.51.5-.87V4c0-1.1-.9-2-2-2m0 8v9.28l-5.5-3.14a.98.98 0 0 0-.99 0l-5.5 3.14V4h12v6Z"></path>
                <path d="M13.08 8.4 12 6l-1.08 2.4-2.52.2 2 1.8-.8 2.8 2.4-1.6 2.4 1.6-.8-2.8 2-1.8z"></path>
              </svg>
              <h3>Valores</h3>
              <p>Calidad, Precisión, Innovación, Colaboración, Ética.</p>
            </div>
          </div>
        </section>

        {/* Historia */}
        <section>
          <h2>Nuestra Historia</h2>
          <div className="timeline">
            {timelineData.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker"></div>
                <h4>{item.year}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipo */}
        <section className="team-section">
          <h2>Nuestro Equipo</h2>
          <div className="team-grid">
            {teamData.map((member, index) => (
              <div key={index} className="mv-card team-member-card">
                <img src={member.img} alt={member.name} />
                <h4>{member.name}</h4>
                <p className="role">{member.role}</p>
                <p>{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nuestra Tecnología */}
        <section className="technology-section">
          <h2>Nuestra Tecnología</h2>
          <div className="tech-grid">
            {technologyData.map((tech, index) => (
              <div key={index} className="mv-card tech-item">
                {tech.icon}
                <h4>{tech.title}</h4>
                <p>{tech.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Impacto en la Salud */}
        <section className="impact-section">
          <div className="case-study-card">
            <div className="case-image-container">
              <i className="fas fa-heartbeat" style={{ fontSize: "4rem", color: "#e63946" }}></i>
            </div>
            <div className="case-content">
              <h2>Impacto en la Salud</h2>
              <h3 className="case-title">
                Servicios y Productos del Laboratorio
              </h3>
              <p className="case-quote">
                El laboratorio ofrece servicios de impresión 3D de prototipos bajo pedido, escaneo 3D de objetos y piezas
                anatómicas, diseño y segmentación de modelos digitales, capacitación y asesoría técnica. Entre nuestros
                productos se encuentran modelos anatómicos impresos en 3D para docencia, cartelería personalizada para
                hospitales y universidad, y prototipos médicos y educativos. En el futuro, proyectamos la fabricación de
                guías quirúrgicas certificadas, prótesis y órtesis a medida, con filamentos flexibles o resinas certificadas.
              </p>
              <p className="case-author">
                - Laboratorio de Diseño y Fabricación Digital, UNLaR
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default QuienesSomos;