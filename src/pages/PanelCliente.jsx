"use client"

import { useState } from "react"
import "../styles/panelCliente.css";


export default function PanelCliente() 
 {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [dateFilter, setDateFilter] = useState("todos")
  const [urgencyFilter, setUrgencyFilter] = useState("todos")
  const [currentPage, setCurrentPage] = useState(1)

  // Datos de ejemplo
  const orders = [
    {
      id: "#12345",
      date: "2023-10-26",
      status: "En Proceso",
      urgency: false,
      doctor: "Dr. García",
    },
    {
      id: "#12346",
      date: "2023-10-25",
      status: "Completado",
      urgency: false,
      doctor: "Dr. Martínez",
    },
    {
      id: "#12347",
      date: "2023-10-24",
      status: "Pendiente",
      urgency: false,
      doctor: "Dr. Rodríguez",
    },
    {
      id: "#12348",
      date: "2023-10-23",
      status: "Cancelado",
      urgency: false,
      doctor: "Dr. Sánchez",
    },
    {
      id: "#12349",
      date: "2023-10-22",
      status: "Urgente",
      urgency: true,
      doctor: "Dr. Torres",
    },
  ]

  const stats = [
    { label: "Pedidos en Proceso", value: 12 },
    { label: "Pedidos Pendientes", value: 5 },
    { label: "Total Completados (Mes)", value: 30 },
    { label: "Pedidos Urgentes Activos", value: 2 },
  ]

  const getStatusClass = (status) => {
    const statusMap = {
      "En Proceso": "status-in-process",
      Completado: "status-completed",
      Pendiente: "status-pending",
      Cancelado: "status-cancelled",
      Urgente: "status-urgent",
    }
    return statusMap[status] || ""
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || order.status === statusFilter
    const matchesUrgency =
      urgencyFilter === "todos" ||
      (urgencyFilter === "urgente" && order.urgency) ||
      (urgencyFilter === "normal" && !order.urgency)

    return matchesSearch && matchesStatus && matchesUrgency
  })

  return (
    <div className="dashboard">
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
              <div className="user-name">Dr. Elena Vasquez</div>
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

        {/* Search and Filters */}
        <div className="search-section">
          <div className="search-bar">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
              <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por ID de pedido, nombre de paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="todos">Estado</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Completado">Completado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Urgente">Urgente</option>
            </select>

            <select className="filter-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="todos">Fecha</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
            </select>

            <select className="filter-select" value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)}>
              <option value="todos">Urgencia</option>
              <option value="urgente">Urgente</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID PEDIDO</th>
                <th>FECHA SOLICITUD</th>
                <th>ESTADO</th>
                <th>URGENCIA</th>
                <th>DOCTOR</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.date}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                  </td>
                  <td>
                    {order.urgency && (
                      <svg className="urgency-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2L9.5 6.5H14L10.5 9.5L12 14L8 11L4 14L5.5 9.5L2 6.5H6.5L8 2Z" fill="currentColor" />
                      </svg>
                    )}
                  </td>
                  <td>{order.doctor}</td>
                  <td>
                    <button className="btn-link">Ver detalles</button>
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
            <button className="pagination-btn" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
              ‹
            </button>
            <button className={`pagination-btn ${currentPage === 1 ? "active" : ""}`} onClick={() => setCurrentPage(1)}>
              1
            </button>
            <button className={`pagination-btn ${currentPage === 2 ? "active" : ""}`} onClick={() => setCurrentPage(2)}>
              2
            </button>
            <button className={`pagination-btn ${currentPage === 3 ? "active" : ""}`} onClick={() => setCurrentPage(3)}>
              3
            </button>
            <button className="pagination-btn" onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}>
              ›
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
