import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api";

export const useNotifications = (user) => {
  const [notificationsAmount, setNotificationsAmount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  const getNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/notifications/my-notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const userNotifications = await response.json();
        const unreadCount = userNotifications.filter((n) => !n.is_read).length;
        setUnreadNotifications(userNotifications.filter((n) => !n.is_read));
        setNotificationsAmount(unreadCount);
      }
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);

  return { notificationsAmount, getNotifications, unreadNotifications };
};
