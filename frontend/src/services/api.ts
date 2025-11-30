import axios from "axios";
import axiosInstance from "./axiosInstance";

const API_BASE = "http://localhost:5000";

// Configure axios defaults
axios.defaults.withCredentials = true;

/* -----------------------------------------
 * AUTH API
 * ----------------------------------------- */
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

/* -----------------------------------------
 * BLOG API
 * ----------------------------------------- */
export const blogAPI = {
  create: (formData: FormData) =>
    axiosInstance.post(`/blogs`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAll: () => axiosInstance.get("/blogs"),
  getOne: (id: string) => axiosInstance.get(`/blogs/${id}`),

  update: (id: string, formData: FormData) =>
    axiosInstance.patch(`/blogs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Soft delete, restore, permanent delete
  softDelete: (id: string) => {
    if (!id) throw new Error("Blog ID is required for soft delete.");
    return axiosInstance.patch(`/blogs/trash/${id}`);
  },
  recover: (id: string) => axiosInstance.patch(`/blogs/recover/${id}`),
  permanentDelete: (id: string) => axiosInstance.delete(`/blogs/${id}`),
};


export const getMyBlogs = async () => {
  return axiosInstance.get("/get-user-blogs");
};

export const deleteBlog = async (id: string) => {
  return axiosInstance.delete(`/delete-blog/${id}`);
};

/* -----------------------------------------
 * USER API
 * ----------------------------------------- */
export const userAPI = {
  getProfile: () => axios.get(`${API_BASE}/users`),
  getMyBlogs: () => axiosInstance.get("/blogs/me"),
  getTrash: () => axiosInstance.get("/users/trash"),

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

/* -----------------------------------------
 * SAMPLE BLOG API
 * ----------------------------------------- */
// export const sampleBlogAPI = {
//   getSample: () => axiosInstance.get(`${API_BASE}/ai/sample-blog`), // your lightweight backend route
// };



/* -----------------------------------------
 * REACT QUERY FRIENDLY HELPERS
 * ----------------------------------------- */

// For fetching blogs list
export const getBlogs = () => blogAPI.getAll();

// Soft delete
export const softDeleteBlog = (id: string) => blogAPI.softDelete(id);

// Restore
export const restoreBlog = (id: string) => blogAPI.recover(id);

// Permanent delete
export const permanentDeleteBlog = (id: string) =>
  blogAPI.permanentDelete(id);
