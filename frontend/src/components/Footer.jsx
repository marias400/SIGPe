// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLinkedin,
  faXTwitter,
  faYoutube,
  faInstagram,
  faFacebook
} from '@fortawesome/free-brands-svg-icons';
import { 
  faEnvelope,
  faPhone,
  faLocationDot,
  faHospital,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Columna 1: Información */}
          <div className="footer-column">
            <div className="footer-logo">
              <h3>Laboratorio de Diseño y Fabricación Digital</h3>
            </div>
            <p className="footer-description">
              Sistema Integral de Gestión de Pedidos (SIGPe) para impresión 3D médica.
              Universidad Nacional de La Rioja (UNLaR)
            </p>
            <div className="footer-badge">
              <span>Proyecto Federal de Innovación 2022 (PFI 2022)</span>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="footer-column">
            <h4>Enlaces Rápidos</h4>
            <ul className="footer-links">
              <li><Link to="/"><FontAwesomeIcon icon={faArrowUp} style={{marginRight: '8px', transform: 'rotate(45deg)'}} />Inicio</Link></li>
              <li><Link to="/about-us">Quiénes Somos</Link></li>
              <li><Link to="/cotizacion">Cotizar</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
              <li><Link to="/faq">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div className="footer-column">
            <h4>Contacto</h4>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <FontAwesomeIcon icon={faLocationDot} />
                </div>
                <div>
                  <strong>Ubicación Actual:</strong>
                  <p>Centro de Investigación e Innovación Tecnológica (CENIIT)<br />
                  Universidad Nacional de La Rioja</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <FontAwesomeIcon icon={faHospital} />
                </div>
                <div>
                  <strong>Sede Definitiva:</strong>
                  <p>Hospital de Clínicas Virgen de Fátima<br />
                  Provincia de La Rioja, Argentina</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div>
                  <strong>Email:</strong>
                  <p>lab.digital@unlar.edu.ar</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div>
                  <strong>Teléfono:</strong>
                  <p>+54 3804-XXXXXX</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 4: Redes sociales y enlaces legales */}
          <div className="footer-column">
            <h4>Síguenos</h4>
            <div className="social-links">
              <a href="#" aria-label="LinkedIn" className="social-link">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="#" aria-label="X (Twitter)" className="social-link">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a href="#" aria-label="YouTube" className="social-link">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" aria-label="Facebook" className="social-link">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
            </div>
            
          </div>
        </div>

        {/* Línea separadora */}
        <div className="footer-divider"></div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© 2025 Laboratorio de Diseño y Fabricación Digital - UNLaR. Todos los derechos reservados.</p>
            <p>Proyecto Federal de Innovación 2022 (PFI 2022) - COFECyT</p>
          </div>
          <div className="legal-links">
            <Link to="/privacy">Política de Privacidad</Link>
            <Link to="/terms">Términos de Servicio</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
