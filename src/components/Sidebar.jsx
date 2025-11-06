import React from "react";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Dental Lab</h1>
      </div>
      <nav>
        <a className="active" href="#">Panel</a>
        <a href="#">Pedidos</a>
        <a href="#">Inventario</a>
        <a href="#">Clientes</a>
        <a href="#">Ajustes</a>
      </nav>
    </aside>
  );
};

export default Sidebar;