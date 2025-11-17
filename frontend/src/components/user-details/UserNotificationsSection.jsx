import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import "../../styles/NotificationsSection.css";

const API_URL = "http://localhost:8000/api";

const UserNotificationsSection = () => {
  const { authFetch } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    setFilteredNotifications(notifications);
  }, [notifications]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await authFetch("/notifications/my-notifications");
      if (res.ok) {
        const data = await res.json();
        // Sort by created_at descending (newest first)
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNotifications(sorted);
        setFilteredNotifications(sorted);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    
    // Mark as read if not already read
    if (!notification.is_read) {
      try {
        const res = await authFetch(`/notifications/${notification.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_read: true }),
        });
        
        if (res.ok) {
          // Update local state
          setNotifications((prev) =>
            prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
          );
          setFilteredNotifications((prev) =>
            prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
          );
          setSelectedNotification({ ...notification, is_read: true });
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  const handleDeleteNotification = async () => {
    if (!selectedNotification) return;
    
    try {
      const res = await authFetch(`/notifications/${selectedNotification.id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        // Remove from local state
        setNotifications((prev) => prev.filter((n) => n.id !== selectedNotification.id));
        setFilteredNotifications((prev) => prev.filter((n) => n.id !== selectedNotification.id));
        setSelectedNotification(null);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("Error al eliminar la notificación");
    }
  };

  // Mostrar todas las notificaciones (sin paginación, con scroll)
  const paginatedNotifications = filteredNotifications;

  // Calculate stats
  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.is_read).length,
    read: notifications.filter((n) => n.is_read).length,
  };

  return (
    <div className="notifications-section">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Notificaciones</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card unread">
          <h3>Sin Leer</h3>
          <p className="stat-value">{stats.unread}</p>
        </div>
        <div className="stat-card read">
          <h3>Leídas</h3>
          <p className="stat-value">{stats.read}</p>
        </div>
      </div>

      <div className="notifications-layout">
        {/* Notifications List (Right Side) */}
        <div className="notifications-list-container">
          <h2>Notificaciones</h2>
          {loading ? (
            <p>Cargando notificaciones...</p>
          ) : (
            <>
              <div className="notifications-list">
                {paginatedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      selectedNotification?.id === notification.id ? "selected" : ""
                    } ${!notification.is_read ? "unread" : ""}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-header">
                      <span className="notification-type">{notification.type || "Aviso"}</span>
                      {!notification.is_read && <span className="unread-dot"></span>}
                    </div>
                    <p className="notification-message-preview">
                      {notification.message || "Sin mensaje"}
                    </p>
                    <p className="notification-date">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>

            </>
          )}
        </div>

        {/* Selected Notification (Middle) */}
        <div className="selected-notification-container">
          {selectedNotification ? (
            <>
              <div className="notification-detail">
                <div className="notification-detail-header">
                  <h3>Detalle de Notificación</h3>
                  <span className={`notification-status ${selectedNotification.is_read ? "read" : "unread"}`}>
                    {selectedNotification.is_read ? "Leída" : "Sin leer"}
                  </span>
                </div>
                <div className="notification-detail-content">
                  <p className="notification-type-detail">
                    <strong>Tipo:</strong> {selectedNotification.type || "Aviso"}
                  </p>
                  <p className="notification-message-detail">
                    <strong>Mensaje:</strong>
                  </p>
                  <p className="notification-message-text">
                    {selectedNotification.message || "Sin mensaje"}
                  </p>
                  <p className="notification-stage">
                    <strong>Etapa:</strong> {selectedNotification.current_stage || "N/A"}
                  </p>
                  <p className="notification-order-id">
                    <strong>ID de Pedido:</strong> {selectedNotification.order_id}
                  </p>
                  <p className="notification-date-detail">
                    <strong>Fecha:</strong> {new Date(selectedNotification.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <button className="btn-delete" onClick={handleDeleteNotification}>
                Borrar Notificación
              </button>
            </>
          ) : (
            <div className="no-selection">
              <p>Selecciona una notificación para ver su contenido</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNotificationsSection;

