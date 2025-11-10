import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import PageNotFound from './views/PageNotFound.jsx';
import Login from './views/Login.jsx';
import Cotizacion from "./views/Cotizacion.jsx";
import Home from "./views/Home.jsx";
import AboutUs from "./views/AboutUs.jsx";
import Dashboard from "./views/Dashboard.jsx";
import UserDetails from "./views/UserDetails.jsx";
// Componentes fijos
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cotizacion" element={<Cotizacion />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-details" element={<UserDetails />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App
