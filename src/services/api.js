import axios from "axios";
import { message } from "antd";
import dayjs from "dayjs";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      message.error("No autorizado. Por favor, inicia sesión.");
    } else {
      message.error("Hubo un error con la solicitud.");
    }
    return Promise.reject(error);
  }
);

exports.registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar usuario:", error.response?.data || error.message);
    throw error;
  }
};

exports.loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data; 
  } catch (error) {
    console.error("Error al iniciar sesión:", error.response?.data || error.message);
    throw error;
  }
};

exports.getTasks = async (token) => {
  try {
    const response = await api.get("/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener tareas:", error.response?.data || error.message);
    throw error;
  }
};

exports.getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error.response?.data || error.message);
    throw error;
  }
};

exports.updateUserRole = async (userId, newRole) => {
  try {
    const response = await api.patch(`/users/${userId}`, { role: newRole });
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el rol del usuario:", error.response?.data || error.message);
    throw error;
  }
};

exports.fetchTasks = async (userId, setTasks) => {
  if (!userId) {
    message.error("Usuario no autenticado");
    return;
  }
  try {
    const response = await api.get(`/tasks/${userId}`);
    setTasks(response.data.tasks);
  } catch (error) {
    message.error("Error al obtener tareas");
  }
};

exports.saveTask = async (values, userId, form, setVisible, setEditingTask, fetchTasks) => {
  if (!userId) {
    message.error("Usuario no autenticado");
    return;
  }
  try {
    if (values.id) {
      await api.put(`/tasks/${userId}/${values.id}`, {
        userId,
        ...values,
        timeUntilFinish: values.timeUntilFinish.format("YYYY-MM-DD"),
      });
      message.success("Tarea actualizada");
    } else {
      await api.post(`/tasks`, {
        userId,
        ...values,
        timeUntilFinish: values.timeUntilFinish.format("YYYY-MM-DD"),
      });
      message.success("Tarea guardada");
    }
    form.resetFields();
    setVisible(false);
    setEditingTask(null);
    fetchTasks();
  } catch (error) {
    message.error("Error al guardar la tarea");
  }
};

exports.deleteTask = async (taskId, userId, fetchTasks) => {
  if (!userId) {
    message.error("Usuario no autenticado");
    return;
  }
  try {
    await api.delete(`/tasks/${userId}/${taskId}`);
    fetchTasks();
  } catch (error) {
    message.error("Error al eliminar la tarea");
  }
};

exports.prepareEditTask = (task, setEditingTask, form, setVisible) => {
  setEditingTask(task);
  form.setFieldsValue({
    ...task,
    timeUntilFinish: dayjs(task.timeUntilFinish),
  });
  setVisible(true);
};

exports.fetchGroups = async () => {
  try {
    const response = await api.get("/groups");
    return response.data;
  } catch (error) {
    message.error("Error al obtener los grupos");
    return [];
  }
};

exports.fetchUsers = async () => {
  try {
    const response = await api.get("/groups/users");
    return response.data;
  } catch (error) {
    message.error("Error al obtener usuarios");
    return [];
  }
};

exports.createGroup = async (groupData) => {
  try {
    const response = await api.post("/groups", groupData);
    message.success("Grupo creado");
    return true;
  } catch (error) {
    message.error("Error al crear el grupo");
    return false;
  }
};
