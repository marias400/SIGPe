import React, { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import OrdersSection from "../components/dashboard/OrdersSection";
import UsersSection from "../components/dashboard/UsersSection";
import ProsthesesSection from "../components/dashboard/ProsthesesSection";
import NotificationsSection from "../components/dashboard/NotificationsSection";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("orders");

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <OrdersSection />;
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
