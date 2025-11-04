import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import PageNotFound from './views/PageNotFound.jsx';
import Login from './views/Login.jsx';
import Orders from './views/Orders.jsx'

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/orders" element={<Orders/>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
