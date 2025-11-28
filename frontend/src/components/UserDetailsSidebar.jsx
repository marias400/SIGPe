import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faBell, faUserEdit, faUserMd } from '@fortawesome/free-solid-svg-icons';
import "../styles/DashboardSidebar.css";

const UserDetailsSidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'orders', label: 'Pedidos', icon: faClipboardList },
    { id: 'notifications', label: 'Notificaciones', icon: faBell },
    { id: 'edit', label: 'Editar Datos', icon: faUserEdit },
    { id: 'request-role', label: 'Solicitar Rol', icon: faUserMd },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <h2>Mi Cuenta</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default UserDetailsSidebar;

