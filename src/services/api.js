import axios from 'axios';


const api = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});


export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data; 
  } catch (error) {
    console.error('Error al iniciar sesión:', error.response?.data || error.message);
    throw error;
  }
};

export const getTasks = async (token) => {
  try {
    const response = await api.get('/tasks', {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener tareas:', error.response?.data || error.message);
    throw error;
  }
};



export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await api.patch(`/users/${userId}`, { role: newRole });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar el rol del usuario:', error.response?.data || error.message);
    throw error;
  }
};

export default api;
