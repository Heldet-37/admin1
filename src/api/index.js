import axios from 'axios';

const api = axios.create({
  baseURL: 'https://skyvendamz-production.up.railway.app',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials) => {
  const response = await api.post('/admin/token', credentials);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getPendingUsers = async () => {
  const response = await api.get('/admin/users/pending');
  return response.data;
};

export const getUnverifiedUsers = async () => {
  const response = await api.get('/admin/users/unverified');
  return response.data;
};

export const getVerifiedUsers = async () => {
  const response = await api.get('/admin/users/verified');
  return response.data;
};

export const toggleUserStatus = async (userId, action) => {
  const response = await api.post(`/admin/users/${userId}/${action}`);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export default api;