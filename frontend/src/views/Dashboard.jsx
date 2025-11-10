import React, { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import OrdersSection from "../components/dashboard/OrdersSection";
import MyAssignedOrdersSection from "../components/dashboard/MyAssignedOrdersSection";
import UsersSection from "../components/dashboard/UsersSection";
import ProsthesesSection from "../components/dashboard/ProsthesesSection";
import NotificationsSection from "../components/dashboard/NotificationsSection";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext.jsx";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("orders");
  const navigate = useNavigate();
  if (!user || (user.user_type !== 'tecnico')) {
    navigate('/');
  }
  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <OrdersSection />;
      case "my-assigned-orders":
        return <MyAssignedOrdersSection />;
      case "users":
        return <UsersSection />;
      case "prostheses":
        return <ProsthesesSection />;
      case "notifications":
        return <NotificationsSection />;
      default:
        return <OrdersSection />;
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="dashboard-main-content">
        {renderSection()}
      </main>
    </div>
  );
};

export default Dashboard;
