// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import campanitaIcon from "../assets/campanita.png";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      {/* === IZQUIERDA: LOGO Y NOMBRE === */}
      <div className="navbar-brand">
        <div className="navbar-logo">
          <svg
            fill="white"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_6_319)">
              <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
            </g>
            <defs>
              <clipPath id="clip0_6_319">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <h2>SIGPe</h2>
      </div>

      {/* === CENTRO: LINKS DE NAVEGACIÓN (solo desktop) === */}
      <nav className="navbar-links">
        <div className="links">
          <Link to="/">Inicio</Link>
          <Link to="/quienes-somos">Quiénes Somos</Link>
          <Link to="/materiales">Materiales</Link>
          {user && <Link to="/dashboard">Dashboard</Link>}
        </div>
        <button className="cta-button">
          <Link to="/cotizacion">Cotizar</Link></button>
      </nav>

      {/* === DERECHA: NOTIFICACIONES Y USUARIO === */}
      <div className="navbar-user">
        {user ? (
          <>
            <button className="notif-button" title="Notificaciones">
              <img
                src={campanitaIcon}
                alt="Notificaciones"
                className="notif-icon"
              />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-info">
              <div className="user-details">
                <p className="user-name">{user.name}</p>
              </div>
              <button onClick={handleLogout} className="cta-button">Cerrar Sesión</button>
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="cta-button">Iniciar Sesión</Link>
            <Link to="/register" className="cta-button">Registrarse</Link>
          </div>
        )}
      </div>

      {/* === BOTÓN MENÚ (mobile) === */}
      <button className="menu-button">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  );
}