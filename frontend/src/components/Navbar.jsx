import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useNotifications } from "../hooks/useNotifications";
import '../styles/Navbar.css'
/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import logo from "../public/assets/LogoSIGPe.png";
library.add(fas, far, fab)

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { notificationsAmount, getNotifications, unreadNotifications } = useNotifications(user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const toggleNotificationsDropdown = () => {
    getNotifications();
    setNotificationsDropdownOpen(prev => !prev);
  };

  const handleNotificationClick = (notification) => {
    setNotificationsDropdownOpen(false);
    navigate('/user-details', { state: { activeSection: 'notifications' } });
  };

  const handleUserDetailsClick = () => {
    navigate('/user-details');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsDropdownOpen && !event.target.closest('.notifications-dropdown-container')) {
        setNotificationsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsDropdownOpen]);

  return (
    <header className="navbar">
      {/* === IZQUIERDA: LOGO Y NOMBRE === */}
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/"><img src={logo} alt="SIGPe Logo" /> {/* feature: modificar para que use un svg */}</Link>
        </div>
      </div>

      {/* === CENTRO / DERECHO: LINKS DE NAVEGACIÓN y acciones === */}
      <nav className="navbar-links">
        <div className="navbar-actions">
          <button className="cta-button cotizar-button">
            <Link to="/cotizacion">Cotizar</Link>
          </button>

          <div className="burguer-menu" onClick={toggleMenu} aria-label="Abrir menú">
            <FontAwesomeIcon icon="fa-solid fa-bars" />
          </div>
        </div>

        <ul className={`nav-links-list ${menuOpen ? 'open' : ''}`}>
          <Link to="/login" className="btn-in-burguer">Iniciar Sesión</Link>
          <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/about-us" onClick={() => setMenuOpen(false)}>Quiénes Somos</Link>
          {user && (user.user_type === 'tecnico') && <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>} {/* feature: modificar para que solo los técnicos puedan verlo */}
        </ul>
      </nav>

      {/* === DERECHA: NOTIFICACIONES Y USUARIO === */}
      <div className="navbar-user">
        {user ? (
          <>
            <div className="notifications-dropdown-container">
              <button
                className="notif-button"
                title="Notificaciones"
                onClick={toggleNotificationsDropdown}
              >
                <FontAwesomeIcon icon="fa-solid fa-bell" />
                {notificationsAmount > 0 && (
                  <span className="notification-badge">{notificationsAmount}</span>
                )}
              </button>
              {notificationsDropdownOpen && (
                <div className="notifications-dropdown">
                  <div className="notifications-dropdown-header">
                    <h3>Notificaciones</h3>
                    <button
                      className="view-all-link"
                      onClick={() => {
                        setNotificationsDropdownOpen(false);
                        navigate('/user-details', { state: { activeSection: 'notifications' } });
                      }}
                    >
                      Ver todas
                    </button>
                  </div>
                  <div className="notifications-dropdown-list">
                    {notificationsAmount > 0 ? (
                      unreadNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-dropdown-item ${!notification.is_read ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="notification-dropdown-header-item">
                            <span className="notification-dropdown-type">{notification.type || "Aviso"}</span>
                            {!notification.is_read && <span className="unread-dot-small"></span>}
                          </div>
                          <p className="notification-dropdown-message">
                            {notification.message || "Sin mensaje"}
                          </p>
                          <p className="notification-dropdown-date">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        <p>No hay notificaciones</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="user-info">
              <div className="user-details" onClick={handleUserDetailsClick} style={{ cursor: 'pointer' }}>
                <p className="user-name">{user.name}</p>
              </div>
              <button onClick={handleLogout} className="cta-button">Cerrar Sesión</button>
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="cta-button btn-in-navbar">Iniciar Sesión</Link>
          </div>
        )}
      </div>
    </header>
  );
}