import axios from 'axios';

// Get API URL from environment or use default localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Ensure it ends with /api
const baseURL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401 unauthorized - don't redirect if already on login page
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Extract error message from response
    const errorData = error.response?.data || {};
    const errorMessage = errorData.message || errorData.error || error.message || 'An error occurred';
    
    // Create a proper Error object with the message
    const apiError = new Error(errorMessage);
    apiError.response = error.response;
    apiError.data = errorData;
    
    return Promise.reject(apiError);
  }
);

export default api;
