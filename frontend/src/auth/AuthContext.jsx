import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:8000/api";

  // Verificar si hay token al cargar la app
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Token inválido o expirado");
        const data = await res.json();
        setUser(data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Register: crea un nuevo usuario
  const register = async (name, lastname, email, password) => {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        lastname,
        email,
        password,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.detail };
    }

    const data = await res.json();
    return data;
  };


  // Login: obtiene el token y guarda usuario
  const login = async (username, password) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const res = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.detail };
    }

    const data = await res.json();
    localStorage.setItem("token", data.access_token);

    // Obtener los datos del usuario autenticado
    const meRes = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });

    if (!meRes.ok) {
      const errorData = await res.json();
      return { error: errorData.detail };
    }

    const me = await meRes.json();
    setUser(me);
    return me;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Petición autenticada con fetch
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };
    const res = await fetch(`${API_URL}${url}`, { ...options, headers });
    return res;
  };

  // Mostrar un loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem'
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, authFetch, register }}>
      {children}
    </AuthContext.Provider>
  );
};