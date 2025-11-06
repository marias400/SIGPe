// src/pages/Dashboard.jsx
import React, { useState } from "react";
import "../styles/Dashboard.css";
import flechaIcon from "../assets/flecha.png";
import flechaDerecha from "../assets/flecha-derecha.png";
import flechaIzquierda from "../assets/flecha-izquierda.png";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({
    status: null,
    date: null,
    urgency: null
  });

  // Opciones para los filtros
  const filterOptions = {
    status: ["Todos", "En Proceso", "Completado", "Pendiente", "Cancelado", "Urgente"],
    date: ["Hoy", "Última semana", "Último mes", "Último año"],
    urgency: ["Todos", "Urgente", "Normal"]
  };

  const toggleFilter = (filterName) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const selectFilter = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
    setOpenFilter(null);
  };
  const orders = [
    {
      id: "#12345",
      patient: "Juan Pérez",
      date: "2023-10-26",
      status: "En Proceso",
      statusColor: "process",
      urgent: false,
    },
    {
      id: "#12346",
      patient: "Ana Gómez",
      date: "2023-10-25",
      status: "Completado",
      statusColor: "completed",
      urgent: false,
    },
    {
      id: "#12347",
      patient: "Luis Fernández",
      date: "2023-10-24",
      status: "Pendiente",
      statusColor: "pending",
      urgent: true,
    },
    {
      id: "#12348",
      patient: "María López",
      date: "2023-10-23",
      status: "Cancelado",
      statusColor: "cancelled",
      urgent: false,
    },
    {
      id: "#12349",
      patient: "Carlos Ruiz",
      date: "2023-10-22",
      status: "Urgente",
      statusColor: "urgent",
      urgent: true,
    }
  ];


  // Filtrar pedidos basándose en los filtros seleccionados y búsqueda
  const filteredOrders = orders.filter((order) => {
    // Filtro de búsqueda
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de estado
    const matchesStatus = !filters.status || order.status === filters.status;

    // Filtro de urgencia
    const matchesUrgency = !filters.urgency ||
      (filters.urgency === 'Urgente' && order.urgent) ||
      (filters.urgency === 'Normal' && !order.urgent);

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  return (
    <div className="dashboard-container">

      {/* Main Content */}
      <main className="dashboard-main">

        {/* KPIs Section */}
        <section className="kpis-section">
          <div className="kpi-card">
            <p className="kpi-label">Pedidos en Proceso</p>
            <p className="kpi-value">12</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Pedidos Pendientes</p>
            <p className="kpi-value">5</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Total Completados (Mes)</p>
            <p className="kpi-value">30</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Pedidos Urgentes Activos</p>
            <p className="kpi-value">2</p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <div className="filters-top-row">
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por ID de pedido, nombre de paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="btn-search"
                onClick={() => console.log("Buscar:", searchTerm)}
              >
                Buscar
              </button>
            </div>



            <button className="btn-new-order">Nuevo Pedido</button>
          </div>

          <div className="filter-buttons">
            <div className="filter-dropdown">
              <button
                className={`filter-btn ${openFilter === 'status' ? 'open' : ''}`}
                onClick={() => toggleFilter('status')}
              >
                <span>{filters.status || "Estado"}</span>
                <img
                  src={flechaIcon}
                  alt="flecha"
                  className="arrow-icon"
                />
              </button>
              {openFilter === 'status' && (
                <div className="dropdown-menu">
                  {filterOptions.status.map((option) => (
                    <button
                      key={option}
                      className="dropdown-item"
                      onClick={() => selectFilter('status', option === 'Todos' ? null : option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-dropdown">
              <button
                className={`filter-btn ${openFilter === 'date' ? 'open' : ''}`}
                onClick={() => toggleFilter('date')}
              >
                <span>{filters.date || "Fecha"}</span>
                <img
                  src={flechaIcon}
                  alt="flecha"
                  className="arrow-icon"
                />
              </button>
              {openFilter === 'date' && (
                <div className="dropdown-menu">
                  {filterOptions.date.map((option) => (
                    <button
                      key={option}
                      className="dropdown-item"
                      onClick={() => selectFilter('date', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-dropdown">
              <button
                className={`filter-btn ${openFilter === 'urgency' ? 'open' : ''}`}
                onClick={() => toggleFilter('urgency')}
              >
                <span>{filters.urgency || "Urgencia"}</span>
                <img
                  src={flechaIcon}
                  alt="flecha"
                  className="arrow-icon"
                />
              </button>
              {openFilter === 'urgency' && (
                <div className="dropdown-menu">
                  {filterOptions.urgency.map((option) => (
                    <button
                      key={option}
                      className="dropdown-item"
                      onClick={() => selectFilter('urgency', option === 'Todos' ? null : option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>


        {/* Table Section */}
        <section className="table-section">
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Paciente</th>
                  <th>Fecha Solicitud</th>
                  <th>Estado</th>
                  <th>Urgencia</th>
                  <th>Acciones</th> {/* Quitamos Doctor */}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium">{order.id}</td>
                    <td>{order.patient}</td>
                    <td>{order.date}</td>
                    <td>
                      <span className={`status-badge status-${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`urgency-badge ${order.urgent ? "urgency-urgent" : "urgency-normal"}`}>
                        {order.urgent ? "Urgente" : "Normal"}
                      </span>
                    </td>
                    <td>
                      <a href="#" className="link-details">Ver detalles</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <div className="pagination-info">
              <p>
                Mostrando <span className="font-medium">1</span> a{" "}
                <span className="font-medium">5</span> de{" "}
                <span className="font-medium">25</span> resultados
              </p>
            </div>
            <nav className="pagination-nav">
              <button className="pagination-btn">
                <img src={flechaIzquierda} alt="Anterior" className="pagination-arrow" />
              </button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">
                <img src={flechaDerecha} alt="Anterior" className="pagination-arrow" />
              </button>
            </nav>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;