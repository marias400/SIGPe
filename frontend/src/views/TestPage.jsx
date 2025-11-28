import React from "react";
import StatisticsSection from "../components/dashboard/StatisticsSection";
import ProsthesisManagementSection from "../components/dashboard/ProsthesisManagementSection";
import { AuthContext } from "../auth/AuthContext";

const TestPage = () => {
  // Mock Data
  const mockOrders = [
    {
      id: 1,
      created_at: "2023-10-01T10:00:00Z",
      is_completed: true,
      current_stage: null,
      full_price: 15000,
      user: { name: "Juan", lastname: "Perez" },
    },
    {
      id: 2,
      created_at: "2023-10-15T14:30:00Z",
      is_completed: true,
      current_stage: null,
      full_price: 22000,
      user: { name: "Maria", lastname: "Gomez" },
    },
    {
      id: 3,
      created_at: "2023-11-05T09:15:00Z",
      is_completed: false,
      current_stage: "Diseño",
      full_price: 18000,
      user: { name: "Carlos", lastname: "Lopez" },
    },
    {
      id: 4,
      created_at: "2023-11-20T16:45:00Z",
      is_completed: false,
      current_stage: "Impresión",
      full_price: 12500,
      user: { name: "Ana", lastname: "Martinez" },
    },
    {
      id: 5,
      created_at: "2023-12-01T11:00:00Z",
      is_completed: false,
      current_stage: null, // Pendiente (sin etapa iniciada)
      full_price: 30000,
      user: { name: "Luis", lastname: "Rodriguez" },
    },
    {
      id: 6,
      created_at: "2023-12-05T08:30:00Z",
      is_completed: false,
      current_stage: null,
      full_price: 25000,
      user: { name: "Sofia", lastname: "Fernandez" },
    },
  ];

  const mockSpecialities = [
    { id: 1, name: "Prótesis Fija" },
    { id: 2, name: "Prótesis Removible" },
    { id: 3, name: "Ortodoncia" },
  ];

  const mockSizes = [
    { id: 1, name: "Chico" },
    { id: 2, name: "Mediano" },
    { id: 3, name: "Grande" },
  ];

  const mockMaterials = [
    { id: 1, name: "Acrílico", cost: 100, unit: "g" },
    { id: 2, name: "Metal", cost: 500, unit: "g" },
    { id: 3, name: "Cerámica", cost: 1200, unit: "g" },
  ];

  // Mock Auth Context
  const mockAuthContext = {
    user: { name: "Test User", user_type: "tecnico" },
    authFetch: async (url) => {
      console.log(`Mock fetch to: ${url}`);
      if (url.includes("/orders/all")) {
        return {
          ok: true,
          json: async () => mockOrders,
        };
      }
      if (url.includes("/specialities/full_catalog")) {
        return {
          ok: true,
          json: async () => mockSpecialities,
        };
      }
      if (url.includes("/sizes")) {
        return {
          ok: true,
          json: async () => mockSizes,
        };
      }
      if (url.includes("/materials")) {
        return {
          ok: true,
          json: async () => mockMaterials,
        };
      }
      return { ok: false };
    },
  };

  return (
    <AuthContext.Provider value={mockAuthContext}>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f4f6f8",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ marginBottom: "20px", color: "#333" }}>
          Página de Prueba de Componentes
        </h1>

        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "10px" }}>Sección de Estadísticas</h2>
          <div
            style={{
              border: "1px dashed #ccc",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <StatisticsSection />
          </div>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "10px" }}>Gestión de Prótesis</h2>
          <div
            style={{
              border: "1px dashed #ccc",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <ProsthesisManagementSection />
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default TestPage;
