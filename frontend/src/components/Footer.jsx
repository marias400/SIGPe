// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom"; // <-- Importa Link
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>SIGPe</h3>
          <p>
            Sistema Integral de Gestión de Pedidos para impresión 3D médica.
          </p>
        </div>
        <div>
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
            <li><Link to="/materiales">Materiales</Link></li>
            <li><Link to="/cotizar">Cotizar</Link></li> {/* Si tienes una ruta Cotizar */}
          </ul>
        </div>
        <div>
          <h3>Contacto</h3>
          <p>
            Laboratorio Universitario<br />
            Av. Siempre Viva 742<br />
            Springfield, USA
          </p>
          <p>contacto@sigpe.edu</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 SIGPe. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
