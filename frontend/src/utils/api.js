import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // On 401 errors, just remove the token
    // Let React Router and PrivateRoute handle the redirect to avoid refresh loops
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Dispatch event to notify AuthContext
      window.dispatchEvent(new Event('auth-token-removed'));
    }
    return Promise.reject(error);
  }
);

export default api;
