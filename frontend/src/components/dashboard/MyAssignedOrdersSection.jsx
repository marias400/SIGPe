import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import "../../styles/MyAssignedOrdersSection.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const MyAssignedOrdersSection = () => {
  const { authFetch, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [patients, setPatients] = useState([]);
  const [models3d, setModels3d] = useState({}); // { orderId: [models] }
  const [expandedOrder, setExpandedOrder] = useState(null);
  const argentinaOffset = 3 * 60 * 60 * 1000; // UTC−3

  useEffect(() => {
    loadAssignedOrders();
  }, []);

  const loadAssignedOrders = async () => {
    try {
      setLoading(true);
      // Cargar todas las órdenes y filtrar las asignadas al técnico actual
      const res = await authFetch("/orders/all?skip=0&limit=1000");
      if (res.ok) {
        const data = await res.json();
        // Filtrar órdenes asignadas al técnico actual
        const assignedOrders = data.filter(order => order.technician_id === user.id);
        // Ordenar por priority_level (mayor a menor, null al final)
        assignedOrders.sort((a, b) => {
          if (a.medical_order?.priority_level === null && b.medical_order?.priority_level === null) return 0;
          if (a.medical_order?.priority_level === null) return 1;
          if (b.medical_order?.priority_level === null) return -1;
          return (b.medical_order?.priority_level || 0) - (a.medical_order?.priority_level || 0);
        });
        setOrders(assignedOrders);

        // Cargar modelos 3D para órdenes con diseño
        assignedOrders.forEach(order => {
          if (order.has_design) {
            loadModels3d(order.id);
          }
        });
      }
    } catch (error) {
      console.error("Error loading assigned orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadModels3d = async (orderId) => {
    try {
      const res = await authFetch(`/models3d/order/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setModels3d(prev => ({ ...prev, [orderId]: data }));
      }
    } catch (error) {
      console.error(`Error loading models3d for order ${orderId}:`, error);
    }
  };

  const loadPatients = async () => {
    try {
      const res = await authFetch("/patients/all?skip=0&limit=1000");
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Error loading patients:", error);
    }
  };

  const handleEdit = async (order) => {
    // Cargar los detalles completos de la orden para asegurar que tenemos medical_order
    try {
      const res = await authFetch(`/orders/${order.id}`);
      if (res.ok) {
        const orderData = await res.json();
        setEditingOrder(orderData);
        if (orderData.is_medical) {
          loadPatients();
        }
      } else {
        // Si falla, usar la orden de la lista
        setEditingOrder({ ...order });
        if (order.is_medical) {
          loadPatients();
        }
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      // Si falla, usar la orden de la lista
      setEditingOrder({ ...order });
      if (order.is_medical) {
        loadPatients();
      }
    }
  };

  const handleSave = async () => {
    if (!editingOrder) return;

    try {
      // Preparar datos de actualización de la orden
      const updateData = {
        is_completed: editingOrder.is_completed,
        current_stage: editingOrder.current_stage || null,
        delivery_date: editingOrder.delivery_date || null,
      };

      // Actualizar la orden
      const res = await authFetch(`/orders/${editingOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        const updatedOrder = await res.json();

        // Si es orden médica, necesitamos actualizar la orden médica por separado
        // Por ahora, el backend no tiene un endpoint específico para actualizar órdenes médicas
        // Así que solo actualizamos la orden principal
        // TODO: Agregar endpoint para actualizar órdenes médicas o incluir en OrderUpdate

        // Actualizar la lista
        setOrders(orders.map(order =>
          order.id === updatedOrder.id ? { ...updatedOrder, medical_order: editingOrder.medical_order } : order
        ));
        setEditingOrder(null);
        alert("Pedido actualizado exitosamente");
        loadAssignedOrders(); // Recargar para obtener datos actualizados
      } else {
        const errorData = await res.json();
        alert(`Error al actualizar: ${errorData.detail || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error al actualizar el pedido");
    }
  };

  const handleCancel = () => {
    setEditingOrder(null);
  };

  const toggleExpand = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      // Cargar modelos 3D si no se han cargado aún
      const order = orders.find(o => o.id === orderId);
      if (order && order.has_design && !models3d[orderId]) {
        loadModels3d(orderId);
      }
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

  if (loading) {
    return <div className="my-assigned-orders-section">Cargando pedidos asignados...</div>;
  }

  return (
    <div className="my-assigned-orders-section">
      <h2>Mis Pedidos Asignados</h2>
      <p className="section-description">
        Pedidos asignados a ti, ordenados por nivel de prioridad
      </p>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No tienes pedidos asignados</p>
        </div>
      ) : (
        <div className="assigned-orders-list">
          {orders.map((order) => (
            <div key={order.id} className="assigned-order-card">
              <div className="order-card-header">
                <div className="order-header-info">
                  <h3>Pedido #{order.id}</h3>
                  <span className={`status-badge ${getStatusClass(order)}`}>
                    {getStatusLabel(order)}
                  </span>
                  {order.medical_order?.priority_level && (
                    <span className="priority-badge">
                      Prioridad: {order.medical_order.priority_level}
                    </span>
                  )}
                </div>
                <div className="order-header-actions">
                  <button
                    className="btn-expand"
                    onClick={() => toggleExpand(order.id)}
                  >
                    {expandedOrder === order.id ? "Ocultar" : "Ver Detalles"}
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(order)}
                  >
                    Editar
                  </button>
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-info-grid">
                  <div className="info-item">
                    <strong>Cliente:</strong> {order.user?.name} {order.user?.lastname}
                  </div>
                  <div className="info-item">
                    <strong>Email:</strong> {order.user?.email}
                  </div>
                  <div className="info-item">
                    <strong>Etapa:</strong> {order.current_stage || "N/A"}
                  </div>
                  <div className="info-item">
                    <strong>Precio:</strong> {order.full_price ? `$${order.full_price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "N/A"}
                  </div>
                  <div className="info-item">
                    <strong>Fecha Creación:</strong> {new Date(order.created_at).toLocaleDateString()}
                  </div>
                  {order.delivery_date && (
                    <div className="info-item">
                      <strong>Fecha Entrega:</strong> {new Date(order.delivery_date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {expandedOrder === order.id && (
                  <div className="order-expanded-details">
                    <div className="detail-section">
                      <h4>Especificaciones</h4>
                      <p>{order.specification || "N/A"}</p>
                    </div>

                    {order.is_medical && order.medical_order && (
                      <div className="detail-section">
                        <h4>Información Médica</h4>
                        <div className="medical-info-grid">
                          <div><strong>Nivel de Urgencia:</strong> {order.medical_order.urgency_level || "N/A"}</div>
                          <div><strong>Patología:</strong> {order.medical_order.pathology || "N/A"}</div>
                          <div><strong>Observaciones:</strong> {order.medical_order.medical_observations || "N/A"}</div>
                        </div>
                      </div>
                    )}

                    {order.has_design && models3d[order.id] && models3d[order.id].length > 0 && (
                      <div className="detail-section">
                        <h4>Modelos 3D</h4>
                        <div className="models3d-list">
                          {models3d[order.id].map((model) => (
                            <div key={model.id} className="model3d-item">
                              <div className="model3d-info">
                                <div><strong>Archivo:</strong> {model.file_name}</div>
                                <div><strong>Formato:</strong> {model.file_format}</div>
                                <div><strong>Tamaño:</strong> {model.file_size}</div>
                              </div>
                              {model.s3_url && (
                                <a
                                  href={model.s3_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-view-model"
                                >
                                  Ver Modelo 3D
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Edición */}
      {editingOrder && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content edit-order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Pedido #{editingOrder.id}</h2>
              <button className="modal-close" onClick={handleCancel}>×</button>
            </div>
            <div className="modal-body">
              <div className="edit-form">
                <div className="form-group">
                  <label>Estado:</label>
                  <select
                    value={editingOrder.is_completed ? "completed" : editingOrder.current_stage ? "in_progress" : "pending"}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditingOrder({
                        ...editingOrder,
                        is_completed: value === "completed",
                        current_stage: value === "in_progress" ? editingOrder.current_stage || "En proceso" : value === "completed" ? null : editingOrder.current_stage,
                      });
                    }}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En Proceso</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Etapa Actual:</label>
                  <input
                    type="text"
                    value={editingOrder.current_stage || ""}
                    onChange={(e) => setEditingOrder({ ...editingOrder, current_stage: e.target.value })}
                    placeholder="Ej: En diseño, En impresión, etc."
                  />
                </div>

                <div className="form-group">
                  <label>Precio (solo lectura):</label>
                  <input
                    type="text"
                    value={editingOrder.full_price ? `$${editingOrder.full_price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "N/A"}
                    disabled
                    style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                  />
                  <small>El precio se calcula automáticamente. Para modificarlo, contacte al administrador.</small>
                </div>

                <div className="form-group">
                  <label>Fecha de Entrega:</label>
                  <input
                    type="datetime-local"
                    value={editingOrder.delivery_date
                      ? editingOrder.delivery_date.slice(0, 16)
                      : ""}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        delivery_date: e.target.value // guardás el string tal cual, sin Date
                      })
                    }
                  />

                </div>

                {editingOrder.is_medical && editingOrder.medical_order && (
                  <>
                    <div className="form-group">
                      <label>Nivel de Urgencia:</label>
                      <select
                        value={editingOrder.medical_order.urgency_level || ""}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          medical_order: {
                            ...editingOrder.medical_order,
                            urgency_level: e.target.value,
                          },
                        })}
                      >
                        <option value="">Seleccione</option>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Patología:</label>
                      <input
                        type="text"
                        value={editingOrder.medical_order.pathology || ""}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          medical_order: {
                            ...editingOrder.medical_order,
                            pathology: e.target.value,
                          },
                        })}
                        placeholder="Ingrese la patología"
                      />
                    </div>

                    <div className="form-group">
                      <label>Nivel de Prioridad (priority_level):</label>
                      <input
                        type="number"
                        value={editingOrder.medical_order.priority_level || ""}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          medical_order: {
                            ...editingOrder.medical_order,
                            priority_level: e.target.value,
                          },
                        })}
                        placeholder="1-10 (mayor número = mayor prioridad)"
                        min="1"
                        max="10"
                      />
                    </div>

                    <div className="form-group">
                      <label>Paciente:</label>
                      <select
                        value={editingOrder.medical_order.patient_id || ""}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          medical_order: {
                            ...editingOrder.medical_order,
                            patient_id: e.target.value,
                          },
                        })}
                      >
                        <option value="">Seleccione un paciente</option>
                        {patients.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.name} {patient.lastname}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
              <button className="btn-save" onClick={handleSave}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAssignedOrdersSection;

