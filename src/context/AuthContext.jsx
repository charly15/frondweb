import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Este efecto solo se ejecutará al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = token ? JSON.parse(localStorage.getItem("user")) : null;

    if (userData) {
      // Si hay datos de usuario, actualiza el estado
      setUser(userData);
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  // Función para hacer login
  const login = (token, userData) => {
    // Asegúrate de que solo el userId y la información relevante se almacene en localStorage
    const { userId, email, role } = userData;
    
    // Guarda solo el userId y la información relevante dentro del objeto 'user'
    const userToSave = { userId, email, role };

    // Almacena el token y los datos del usuario en el localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userToSave)); // Aquí guardamos solo el objeto 'user'

    // Actualiza el estado del usuario en el componente
    setUser(userToSave);

    // Redirige al dashboard
    navigate("/dashboard");
  };

  // Función para hacer logout
  const logout = () => {
    // Elimina el token y los datos del usuario del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Limpia el estado del usuario
    setUser(null);

    // Redirige a la página de login
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
