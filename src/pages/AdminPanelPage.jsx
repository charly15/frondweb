import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUsers, updateUserRole } from "../services/api"; 

const AdminPanelPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    } else {
      const fetchUsers = async () => {
        const usersData = await getUsers();
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
      await updateUserRole(userId, newRole);
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
