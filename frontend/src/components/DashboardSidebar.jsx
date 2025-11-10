import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faUsers, faStethoscope, faBell, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import "../styles/DashboardSidebar.css";

const DashboardSidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'orders', label: 'Pedidos', icon: faClipboardList },
    { id: 'my-assigned-orders', label: 'Mis Pedidos Asignados', icon: faUserCheck },
    { id: 'users', label: 'Usuarios', icon: faUsers },
    { id: 'prostheses', label: 'Prótesis', icon: faStethoscope },
    { id: 'notifications', label: 'Notificaciones', icon: faBell },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
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

export default DashboardSidebar;

