import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import '../styles/Navbar.css'
/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import logo from "../public/assets/LogoSIGPe.png";
library.add(fas, far, fab)

const API_URL = "http://localhost:8000/api";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificacionsAmount, setNotificacionsAmount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/notifications/my-notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userNotifications = await response.json();
          // Sort by created_at descending (newest first) and limit to 5
          const sorted = userNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setNotifications(sorted.slice(0, 5));
          // Count only unread notifications
          const unreadCount = userNotifications.filter(n => !n.is_read).length;
          setNotificacionsAmount(unreadCount);
        }
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };

    if (user) {
      getNotifications();
    }
  }, [user]);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const toggleNotificationsDropdown = () => {
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
          {user && <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>} {/* feature: modificar para que solo los técnicos puedan verlo */}
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
                {notificacionsAmount > 0 && (
                  <span className="notification-badge">{notificacionsAmount}</span>
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
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
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