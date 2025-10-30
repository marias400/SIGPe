// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Importamos las páginas
import Home from "./pages/Home";
import QuienesSomos from "./pages/QuienesSomos";
import Dashboard from "./pages/Dashboard";

// Componentes fijos (por ejemplo, barra de navegación)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar visible en todas las páginas */}
      <Navbar />

        {/* Contenido principal */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Ruta no encontrada */}
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </main>

      {/* Footer visible en todas las páginas */}
      <Footer />
    </div>
  );
}
