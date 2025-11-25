import axios from 'axios';

const API_BASE = 'http://localhost:6000';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Auth API
export const authAPI = {
  register: (data: {
    firstName: string;
    lastName: string;
    username: string;
    emailAddress: string;
    password: string;
  }) => axios.post(`${API_BASE}/auth/register`, data),

  login: (data: { identifier: string; password: string }) =>
    axios.post(`${API_BASE}/auth/login`, data),

  logout: () => axios.post(`${API_BASE}/auth/logout`, {}),

  updatePassword: (data: { previousPassword: string; password: string }) =>
    axios.patch(`${API_BASE}/auth/updatePassword`, data),
};

export const blogAPI = {
  create: (formData: FormData) =>
    axios.post(`${API_BASE}/blogs`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getAll: () => axios.get(`${API_BASE}/blogs`),

  getOne: (id: string) => axios.get(`${API_BASE}/blogs/${id}`),

  update: (id: string, formData: FormData) =>
    axios.patch(`${API_BASE}/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  softDelete: (id: string) => axios.patch(`${API_BASE}/blogs/trash/${id}`, {}),

  permanentDelete: (id: string) => axios.delete(`${API_BASE}/blogs/${id}`),

  recover: (id: string) => axios.patch(`${API_BASE}/blogs/recover/${id}`, {}),
};

export const userAPI = {
  getProfile: () => axios.get(`${API_BASE}/users`),

  getMyBlogs: () => axios.get(`${API_BASE}/users/blogs`),

  getTrash: () => axios.get(`${API_BASE}/users/trash`),

  updateProfile: (
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      username?: string;
      emailAddress?: string;
    }
  ) => axios.patch(`${API_BASE}/users/${id}`, data),
};