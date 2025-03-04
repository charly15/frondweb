import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const getUsersFromAPI = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/users");
    if (!response.ok) throw new Error("Error al obtener los usuarios");
    const usersData = await response.json();
    return usersData;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const AdminPanelPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    } else {
      const fetchUsers = async () => {
        const usersData = await getUsersFromAPI();
        setUsers(usersData);
      };
      fetchUsers();
    }
  }, [user, navigate]);

  const handleRoleChange = async (userId, newRole) => {
    if (newRole === "user" && user.role === "admin") {
      return; 
    }

    if (newRole === "admin" && user.role !== "admin") {
      return;
    }

    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Error al cambiar el rol del usuario");
      }
    } catch (error) {
      console.error("Error al cambiar el rol:", error);
    }
  };

  return (
    <div>
      <h1>Panel de Administración</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5">No hay usuarios disponibles.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role !== "admin" && (
                    <button onClick={() => handleRoleChange(user.id, "admin")}>
                      Convertir a Admin
                    </button>
                  )}
                  {user.role !== "user" && user.id !== user.id && (
                    <button onClick={() => handleRoleChange(user.id, "user")}>
                      Convertir a Usuario
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanelPage;
