import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserDetailsSidebar from "../components/UserDetailsSidebar";
import UserOrdersSection from "../components/user-details/UserOrdersSection";
import UserNotificationsSection from "../components/user-details/UserNotificationsSection";
import EditUserData from "../components/user-details/EditUserData";
import RequestRoleSection from "../components/user-details/RequestRoleSection";
import "../styles/Dashboard.css";

const UserDetails = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("orders");

  // Check if navigation state has activeSection
  useEffect(() => {
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location]);

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <UserOrdersSection />;
      case "notifications":
        return <UserNotificationsSection />;
      case "edit":
        return <EditUserData />;
      case "request-role":
        return <RequestRoleSection />;
      default:
        return <UserOrdersSection />;
    }
  };

  return (
    <div className="dashboard-container">
      <UserDetailsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="dashboard-main-content">
        {renderSection()}
      </main>
    </div>
  );
};

export default UserDetails;

