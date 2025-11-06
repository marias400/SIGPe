import "../styles/panelAdmin.css";
import { useAuth } from "../context/AuthContext";

export default function PanelAdmin() {
  useAuth();

  const stats = [
    { label: "Pedidos en Proceso", value: "12" },
    { label: "Pedidos Pendientes", value: "5" },
    { label: "Total Completados (Mes)", value: "30" },
    { label: "Pedidos Urgentes Activos", value: "2" },
  ];

  const orders = [
    {
      id: "#12345",
      paciente: "Juan Pérez",
      medico: "Dr. García",
      fecha: "2023-10-26",
      estado: "En Proceso",
      urgencia: false,
      doctor: "Dr. García",
    },
    {
      id: "#12346",
      paciente: "Ana Gómez",
      medico: "Dr. Martínez",
      fecha: "2023-10-25",
      estado: "Completado",
      urgencia: false,
      doctor: "Dr. Martínez",
    },
    {
      id: "#12347",
      paciente: "Luis Fernández",
      medico: "Dr. Rodríguez",
      fecha: "2023-10-24",
      estado: "Pendiente",
      urgencia: false,
      doctor: "Dr. Rodríguez",
    },
    {
      id: "#12348",
      paciente: "María López",
      medico: "Dr. Sánchez",
      fecha: "2023-10-23",
      estado: "Cancelado",
      urgencia: false,
      doctor: "Dr. Sánchez",
    },
    {
      id: "#12349",
      paciente: "Carlos Ruiz",
      medico: "Dr. Torres",
      fecha: "2023-10-22",
      estado: "Urgente",
      urgencia: true,
      doctor: "Dr. Torres",
    },
  ];

  const getStatusClass = (estado) => {
    switch (estado) {
      case "En Proceso":
        return "status-en-proceso";
      case "Completado":
        return "status-completado";
      case "Pendiente":
        return "status-pendiente";
      case "Cancelado":
        return "status-cancelado";
      case "Urgente":
        return "status-urgente";
      default:
        return "status-pendiente";
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="logo-text">Lab3d</span>
          </div>
        </div>

        <div className="header-right">
          <button className="btn-primary">Nuevo Pedido</button>

          <div className="notification-badge">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2C6.68629 2 4 4.68629 4 8V11L2 13V14H18V13L16 11V8C16 4.68629 13.3137 2 10 2Z"
                fill="currentColor"
              />
              <path
                d="M9 17C9 17.5523 9.44772 18 10 18C10.5523 18 11 17.5523 11 17"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span className="badge">3</span>
          </div>

          <div className="user-profile">
            <div className="avatar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3" fill="currentColor" />
                <path
                  d="M4 18C4 14.6863 6.68629 12 10 12C13.3137 12 16 14.6863 16 18"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="user-info">
              <div className="user-name">Administrador</div>
              <div className="user-role">Admin</div>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="main-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID PEDIDO</th>
                  <th>PACIENTE</th>
                  <th>MÉDICO</th>
                  <th>FECHA SOLICITUD</th>
                  <th>ESTADO</th>
                  <th>URGENCIA</th>
                  <th>DOCTOR</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium">{order.id}</td>
                    <td>{order.paciente}</td>
                    <td>{order.medico}</td>
                    <td className="text-gray">{order.fecha}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.estado)}`}>{order.estado}</span>
                    </td>
                    <td className="text-center">
                      {order.urgencia && (
                        <svg className="urgency-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                        </svg>
                      )}
                    </td>
                    <td>{order.doctor}</td>
                    <td>
                      <button className="link-btn">Ver detalles</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-info">Mostrando 1 a 5 de 25 resultados</div>
            <div className="pagination-controls">
              <button className="pagination-btn" disabled>
                ‹
              </button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">›</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
