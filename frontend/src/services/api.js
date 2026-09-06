import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach JWT token to every request if user is logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);
export const getProfile = () => API.get('/auth/me');

// Student endpoints (CRUD)
export const getStudents = (search = '') =>
  API.get(search ? `/students?q=${encodeURIComponent(search)}` : '/students');
export const getStudentById = (id) => API.get(`/students/${id}`);
export const createStudent = (studentData) => API.post('/students', studentData);
export const updateStudent = (id, studentData) => API.put(`/students/${id}`, studentData);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

export default API;
