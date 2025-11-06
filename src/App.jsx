import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";   
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Cotizacion from "./pages/Cotizacion.jsx";
import QuienesSomos from "./pages/QuienesSomos.jsx";
import PanelControl from "./pages/PanelControl.jsx";
import PanelCliente from "./pages/PanelCliente.jsx";
import PanelAdmin from "./pages/PanelAdmin.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas principales */}
       <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />  
        <Route path="/forgot" element={<ForgotPasswordPage />} />

        {/* Otras secciones */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cotizacion" element={<Cotizacion />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/panel-control" element={<PanelControl />} />
         <Route path="/panelCliente" element={<PanelCliente />} />
         <Route path="/panelAdmin" element={<PanelAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
