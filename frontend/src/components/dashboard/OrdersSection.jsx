import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import "../../styles/OrdersSection.css";

const API_URL = "http://localhost:8000/api";

const OrdersSection = () => {
  const { authFetch } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  const [assigningTechnician, setAssigningTechnician] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);
  const [filters, setFilters] = useState({
    status: null,
    urgency: null,
    dateSort: null, // 'newest' or 'oldest'
  });
  const [openFilter, setOpenFilter] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, filters]);

  // Cargar técnicos cuando se selecciona una orden
  useEffect(() => {
    if (selectedOrder) {
      loadTechnicians();
      // Inicializar el técnico seleccionado con el técnico actual de la orden
      setSelectedTechnicianId(selectedOrder.technician_id || null);
    }
  }, [selectedOrder]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await authFetch("/orders/all?skip=0&limit=1000");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        setFilteredOrders(data);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTechnicians = async () => {
    try {
      setLoadingTechnicians(true);
      const res = await authFetch("/users/all");
      if (res.ok) {
        const data = await res.json();
        // Filtrar solo los técnicos
        const techs = data.filter(user => user.user_type === "tecnico");
        setTechnicians(techs);
      }
    } catch (error) {
      console.error("Error loading technicians:", error);
    } finally {
      setLoadingTechnicians(false);
    }
  };

  const handleRowClick = async (order) => {
    // Cargar los detalles completos de la orden
    try {
      const res = await authFetch(`/orders/${order.id}`);
      if (res.ok) {
        const orderData = await res.json();
        setSelectedOrder(orderData);
      } else {
        // Si falla, usar la orden de la lista
        setSelectedOrder(order);
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      // Si falla, usar la orden de la lista
      setSelectedOrder(order);
    }
  };

  const handleAssignTechnician = async () => {
    if (!selectedOrder || !selectedTechnicianId) {
      alert("Por favor seleccione un técnico");
      return;
    }

    try {
      setAssigningTechnician(true);
      const res = await authFetch(`/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          technician_id: parseInt(selectedTechnicianId),
        }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setSelectedOrder(updatedOrder);
        // Actualizar también en la lista
        const updatedOrders = orders.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        );
        setOrders(updatedOrders);
        // Actualizar también en la lista filtrada
        setFilteredOrders(filteredOrders.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        ));
        alert("Técnico asignado exitosamente");
      } else {
        const errorData = await res.json();
        alert(`Error al asignar técnico: ${errorData.detail || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error assigning technician:", error);
      alert("Error al asignar técnico");
    } finally {
      setAssigningTechnician(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Filter by search term (list search)
    if (searchTerm) {
      filtered = filtered.filter((order) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.id.toString().includes(searchLower) ||
          (order.user?.name && order.user.name.toLowerCase().includes(searchLower)) ||
          (order.user?.lastname && order.user.lastname.toLowerCase().includes(searchLower)) ||
          (order.user?.email && order.user.email.toLowerCase().includes(searchLower)) ||
          (order.current_stage && order.current_stage.toLowerCase().includes(searchLower)) ||
          (order.processing_level && order.processing_level.toLowerCase().includes(searchLower))
        );
      });
    }

    // Filter by status
    if (filters.status) {
      if (filters.status === "completed") {
        filtered = filtered.filter((order) => order.is_completed);
      } else if (filters.status === "pending") {
        filtered = filtered.filter((order) => !order.is_completed && !order.current_stage);
      } else if (filters.status === "in_progress") {
        filtered = filtered.filter((order) => !order.is_completed && order.current_stage);
      }
    }

    // Filter by urgency (if we have a field for it, otherwise skip)
    // Note: The order model doesn't have an urgency field, so this might need backend support

    // Sort by date
    if (filters.dateSort === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (filters.dateSort === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const searchOrder = async () => {
    if (!orderSearchTerm.trim()) {
      setSelectedOrder(null);
      return;
    }

    try {
      // Try to find by ID first
      const orderId = parseInt(orderSearchTerm);
      if (!isNaN(orderId)) {
        const res = await authFetch(`/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedOrder(data);
          return;
        }
      }

      // Otherwise search in the filtered list
      const found = filteredOrders.find((order) => {
        const searchLower = orderSearchTerm.toLowerCase();
        return (
          order.id.toString().includes(searchLower) ||
          (order.user?.name && order.user.name.toLowerCase().includes(searchLower)) ||
          (order.user?.lastname && order.user.lastname.toLowerCase().includes(searchLower)) ||
          (order.user?.email && order.user.email.toLowerCase().includes(searchLower)) ||
          (order.current_stage && order.current_stage.toLowerCase().includes(searchLower)) ||
          (order.processing_level && order.processing_level.toLowerCase().includes(searchLower)) ||
          (order.specification && order.specification.toLowerCase().includes(searchLower))
        );
      });

      if (found) {
        setSelectedOrder(found);
      } else {
        alert("Pedido no encontrado");
      }
    } catch (error) {
      console.error("Error searching order:", error);
      alert("Error al buscar el pedido");
    }
  };

  const getStatusLabel = (order) => {
    if (order.is_completed) return "Completado";
    if (order.current_stage) return "En Proceso";
    return "Pendiente";
  };

  const getStatusClass = (order) => {
    if (order.is_completed) return "status-completed";
    if (order.current_stage) return "status-process";
    return "status-pending";
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Calculate stats
  const stats = {
    total: orders.length,
    completed: orders.filter((o) => o.is_completed).length,
    inProgress: orders.filter((o) => !o.is_completed && o.current_stage).length,
    pending: orders.filter((o) => !o.is_completed && !o.current_stage).length,
  };

  return (
    <div className="orders-section">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Pedidos</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Completados</h3>
          <p className="stat-value">{stats.completed}</p>
        </div>
        <div className="stat-card">
          <h3>En Proceso</h3>
          <p className="stat-value">{stats.inProgress}</p>
        </div>
        <div className="stat-card">
          <h3>Pendientes</h3>
          <p className="stat-value">{stats.pending}</p>
        </div>
      </div>

      {/* Search for specific order */}
      <div className="search-order-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar pedido por ID, paciente, email, etapa..."
          value={orderSearchTerm}
          onChange={(e) => setOrderSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchOrder()}
        />
        <button className="btn-search" onClick={searchOrder}>
          Buscar Pedido
        </button>
      </div>

      {selectedOrder && (
        <div className="selected-order-card">
          <h3>Pedido Seleccionado</h3>
          <div className="order-details">
            <p><strong>ID:</strong> {selectedOrder.id}</p>
            <p><strong>Paciente:</strong> {selectedOrder.user?.name} {selectedOrder.user?.lastname}</p>
            <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
            <p><strong>Estado:</strong> <span className={getStatusClass(selectedOrder)}>{getStatusLabel(selectedOrder)}</span></p>
            <p><strong>Etapa:</strong> {selectedOrder.current_stage || "N/A"}</p>
            <p><strong>Nivel de Procesamiento:</strong> {selectedOrder.processing_level || "N/A"}</p>
            <p><strong>Fecha Creación:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
            {selectedOrder.delivery_date && (
              <p><strong>Fecha Entrega:</strong> {new Date(selectedOrder.delivery_date).toLocaleDateString()}</p>
            )}
            <p><strong>Especificación:</strong> {selectedOrder.specification || "N/A"}</p>
            <p><strong>Técnico Asignado:</strong> {
              selectedOrder.technician_id 
                ? (() => {
                    const tech = technicians.find(t => t.id === selectedOrder.technician_id);
                    return tech ? `${tech.name} ${tech.lastname}` : "Cargando...";
                  })()
                : "Sin asignar"
            }</p>
          </div>
          
          {/* Dropdown para asignar técnico */}
          <div className="technician-assignment">
            <label htmlFor="technician-select" className="technician-label">
              <strong>Asignar Técnico:</strong>
            </label>
            <div className="technician-assignment-controls">
              <select
                id="technician-select"
                className="technician-select"
                value={selectedTechnicianId || ""}
                onChange={(e) => setSelectedTechnicianId(e.target.value ? parseInt(e.target.value) : null)}
                disabled={assigningTechnician || loadingTechnicians}
              >
                <option value="">Seleccione un técnico</option>
                {loadingTechnicians ? (
                  <option disabled>Cargando técnicos...</option>
                ) : (
                  technicians.map((technician) => (
                    <option key={technician.id} value={technician.id}>
                      {technician.name} {technician.lastname} ({technician.email})
                    </option>
                  ))
                )}
              </select>
              <button
                className="btn-accept-technician"
                onClick={handleAssignTechnician}
                disabled={assigningTechnician || loadingTechnicians || !selectedTechnicianId || selectedTechnicianId === selectedOrder.technician_id}
              >
                {assigningTechnician ? "Asignando..." : "Aceptar"}
              </button>
            </div>
            {assigningTechnician && (
              <span className="assigning-indicator">Asignando técnico...</span>
            )}
          </div>

          <button className="btn-close-order" onClick={() => setSelectedOrder(null)}>
            <i className="fas fa-times"></i> Cerrar Pedido Seleccionado
          </button>
        </div>
      )}

      {/* Filters and List Search */}
      <div className="filters-container">
        <div className="list-search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar en la lista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <div className="filter-dropdown">
            <button
              className={`filter-btn ${openFilter === "status" ? "open" : ""}`}
              onClick={() => setOpenFilter(openFilter === "status" ? null : "status")}
            >
              <span>{filters.status ? filters.status : "Estado"}</span>
              <i className="fas fa-chevron-down"></i>
            </button>
            {openFilter === "status" && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { setFilters({ ...filters, status: null }); setOpenFilter(null); }}>
                  Todos
                </button>
                <button className="dropdown-item" onClick={() => { setFilters({ ...filters, status: "completed" }); setOpenFilter(null); }}>
                  Completado
                </button>
                <button className="dropdown-item" onClick={() => { setFilters({ ...filters, status: "in_progress" }); setOpenFilter(null); }}>
                  En Proceso
                </button>
                <button className="dropdown-item" onClick={() => { setFilters({ ...filters, status: "pending" }); setOpenFilter(null); }}>
                  Pendiente
                </button>
              </div>
            )}
          </div>

          <div className="filter-dropdown">
            <button
              className={`filter-btn ${openFilter === "dateSort" ? "open" : ""}`}
              onClick={() => setOpenFilter(openFilter === "dateSort" ? null : "dateSort")}
            >
              <span>{filters.dateSort === "newest" ? "Más Reciente" : filters.dateSort === "oldest" ? "Más Antiguo" : "Fecha"}</span>
              <i className="fas fa-chevron-down"></i>
            </button>
            {openFilter === "dateSort" && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { setFilters({ ...filters, dateSort: null }); setOpenFilter(null); }}>
                  Sin ordenar
                </button>
                <button className="dropdown-item" onClick={() => { setFilters({ ...filters, dateSort: "newest" }); setOpenFilter(null); }}>
                  Más Reciente
                </button>
                <button className="dropdown-item" onClick={() => { setFilters({ ...filters, dateSort: "oldest" }); setOpenFilter(null); }}>
                  Más Antiguo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list-container">
        {loading ? (
          <p>Cargando pedidos...</p>
        ) : (
          <>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Paciente</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Etapa</th>
                  <th>Precio</th>
                  <th>Fecha Creación</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr 
                    key={order.id}
                    onClick={() => handleRowClick(order)}
                    className={selectedOrder?.id === order.id ? "selected-row" : "clickable-row"}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{order.id}</td>
                    <td>{order.user?.name} {order.user?.lastname}</td>
                    <td>{order.user?.email}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order)}`}>
                        {getStatusLabel(order)}
                      </span>
                    </td>
                    <td>{order.current_stage || "N/A"}</td>
                    <td>{order.full_price ? `$${order.full_price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "N/A"}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span className="pagination-info">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersSection;

