import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Simulación de login de prueba
    if (userData.email === "test@test.com" && userData.password === "password") {
      setUser({ name: "Usuario de Prueba", role: "Admin" });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto
export const useAuth = () => useContext(AuthContext);
