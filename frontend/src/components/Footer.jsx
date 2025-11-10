// src/components/Footer.jsx
import { Link } from "react-router-dom"; // <-- Importa Link
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>Laboratorio de Diseño y Fabricación Digital</h3>
          <p>
            Sistema Integral de Gestión de Pedidos (SIGPe) para impresión 3D médica.
            <br />
            Universidad Nacional de La Rioja (UNLaR)
            <br />
            Proyecto Federal de Innovación 2022 (PFI 2022)
          </p>
        </div>
        <div>
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/about-us">Quiénes Somos</Link></li>
            <li><Link to="/cotizacion">Cotizar</Link></li> {/* Si tienes una ruta Cotizar */}
          </ul>
        </div>
        <div>
          <h3>Contacto</h3>
          <p>
            <strong>Ubicación Actual:</strong><br />
            Centro de Investigación e Innovación Tecnológica (CENIIT)<br />
            Universidad Nacional de La Rioja
          </p>
          <p>
            <strong>Sede Definitiva:</strong><br />
            Hospital de Clínicas Virgen de Fátima<br />
            Provincia de La Rioja, Argentina
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Laboratorio de Diseño y Fabricación Digital - UNLaR. Todos los derechos reservados.</p>
        <p>Proyecto Federal de Innovación 2022 (PFI 2022) - COFECyT</p>
      </div>
    </footer>
  );
}
