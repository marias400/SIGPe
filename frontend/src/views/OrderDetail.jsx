import React from "react";
import "../../styles/PanelControl.css";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import NotificationCard from "../../components/NotificationCard";
import SummaryCard from "../../components/SummaryCard";
import "../../styles/PanelControl.css";


const PanelControl = () => {
  return (
    <div className="panel-container">
      <Sidebar />

      <main className="main-content">
        <Header title="Panel de Laboratorio" />

        {/* NOTIFICACIONES */}
        <section className="section">
          <h3>Notificaciones</h3>
          <div className="grid">
            <NotificationCard
              color="blue"
              icon="add_shopping_cart"
              title="Nuevo pedido recibido"
              description="Pedido #12350 de Clínica Dental Sonrisas."
            />
            <NotificationCard
              color="green"
              icon="published_with_changes"
              title="Estado del pedido actualizado"
              description="Pedido #12346 ahora está 'Completado'."
            />
            <NotificationCard
              color="yellow"
              icon="inventory_2"
              title="Bajo nivel de inventario"
              description="Quedan pocas unidades de 'Cerámica'."
            />
          </div>
        </section>

        {/* RESUMEN */}
        <section className="section">
          <h3>Resumen de Actividades</h3>
          <div className="grid">
            <SummaryCard title="Pedidos Pendientes" value="15" />
            <SummaryCard title="Materiales en Inventario" value="230" />
            <SummaryCard title="Clientes Activos" value="45" />
          </div>
        </section>

        {/* TABLA */}
        <section className="section">
          <h3>Pedidos Pendientes y en Curso</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID del Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha de Recepción</th>
                  <th>Fecha de Entrega Estimada</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#12345</td>
                  <td>Clínica Dental Sonrisas</td>
                  <td>15/07/2024</td>
                  <td>22/07/2024</td>
                  <td><span className="estado pendiente">Pendiente</span></td>
                </tr>
                <tr>
                  <td>#12346</td>
                  <td>Clínica Dental Brillo</td>
                  <td>16/07/2024</td>
                  <td>23/07/2024</td>
                  <td><span className="estado curso">En Curso</span></td>
                </tr>
                <tr>
                  <td>#12347</td>
                  <td>Clínica Dental Armonía</td>
                  <td>17/07/2024</td>
                  <td>24/07/2024</td>
                  <td><span className="estado pendiente">Pendiente</span></td>
                </tr>
                <tr>
                  <td>#12348</td>
                  <td>Clínica Dental Vital</td>
                  <td>18/07/2024</td>
                  <td>25/07/2024</td>
                  <td><span className="estado curso">En Curso</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PanelControl;
