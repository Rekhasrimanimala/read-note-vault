import axios from 'axios';
import { getToken, removeToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API Types
export interface PDF {
  id: string;
  title: string;
  filename: string;
  uploadDate: string;
  userId: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  pdfId: string;
  userId: string;
}

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
};

// PDF API
export const pdfAPI = {
  getAll: () => api.get<PDF[]>('/pdf'),
  getById: (id: string) => api.get<PDF>(`/pdf/${id}`),
  upload: (formData: FormData) => 
    api.post('/pdf/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  delete: (id: string) => api.delete(`/pdf/${id}`),
};

// Notes API
export const notesAPI = {
  getByPdfId: (pdfId: string) => api.get<Note[]>(`/notes/${pdfId}`),
  create: (pdfId: string, content: string) =>
    api.post(`/notes/${pdfId}`, { content }),
  update: (id: string, content: string) =>
    api.put(`/notes/${id}`, { content }),
  delete: (id: string) => api.delete(`/notes/${id}`),
};