import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../../styles/OrdersSection.css";

/**

  [
    {
      "id": 1,
      "created_at": "2023-10-01T10:00:00Z", 
      "is_completed": true, 
      "current_stage": "Stage Name" | null
      "full_price": 15000.00, 
      "user": {
        "name": "John",
        "lastname": "Doe"
     }
    },
    ...
  ]
 **/
const StatisticsSection = () => {
  const { authFetch } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await authFetch("/orders/all?skip=0&limit=1000");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // --- Data Processing for Charts ---

  // 1. Status Distribution (Pie Chart)
  const statusData = [
    { name: "Completados", value: orders.filter((o) => o.is_completed).length },
    {
      name: "En Proceso",
      value: orders.filter((o) => !o.is_completed && o.current_stage).length,
    },
    {
      name: "Pendientes",
      value: orders.filter((o) => !o.is_completed && !o.current_stage).length,
    },
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  // 2. Orders by Month (Bar Chart)
  const ordersByMonth = orders.reduce((acc, order) => {
    const date = new Date(order.created_at);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    if (!acc[monthYear]) {
      acc[monthYear] = 0;
    }
    acc[monthYear]++;
    return acc;
  }, {});

  const barChartData = Object.keys(ordersByMonth).map((key) => ({
    name: key,
    pedidos: ordersByMonth[key],
  }));

  // Sort by date roughly (naive sort for MM/YYYY)
  barChartData.sort((a, b) => {
    const [ma, ya] = a.name.split("/").map(Number);
    const [mb, yb] = b.name.split("/").map(Number);
    return ya - yb || ma - mb;
  });

  // 3. Revenue (Total Price)
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.full_price || 0),
    0
  );

  return (
    <div className="orders-section" style={{ padding: "20px" }}>
      <h2>Estadísticas del Laboratorio</h2>

      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {/* KPI Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Pedidos</h3>
              <p className="stat-value">{orders.length}</p>
            </div>
            <div className="stat-card">
              <h3>Ingresos Totales</h3>
              <p className="stat-value">
                $
                {totalRevenue.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="stat-card">
              <h3>Completados</h3>
              <p className="stat-value">{statusData[0].value}</p>
            </div>
            <div className="stat-card">
              <h3>En Proceso</h3>
              <p className="stat-value">{statusData[1].value}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "space-around",
            }}
          >
            {/* Pie Chart Container */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                minWidth: "300px",
                flex: "1",
              }}
            >
              <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
                Estado de Pedidos
              </h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart Container */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                minWidth: "400px",
                flex: "1",
              }}
            >
              <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
                Pedidos por Mes
              </h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="pedidos"
                      fill="#8884d8"
                      name="Cantidad de Pedidos"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Orders Table (Planilla Resumen) */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Últimos Pedidos Ingresados</h3>
            <div
              className="orders-list-container"
              style={{ boxShadow: "none", padding: 0 }}
            >
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Paciente</th>
                    <th>Estado</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )
                    .slice(0, 5)
                    .map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          {order.user?.name} {order.user?.lastname}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              order.is_completed
                                ? "status-completed"
                                : order.current_stage
                                ? "status-process"
                                : "status-pending"
                            }`}
                          >
                            {order.is_completed
                              ? "Completado"
                              : order.current_stage
                              ? "En Proceso"
                              : "Pendiente"}
                          </span>
                        </td>
                        <td>
                          $
                          {(order.full_price || 0).toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsSection;
