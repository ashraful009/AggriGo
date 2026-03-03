import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // sends HttpOnly cookies automatically on every request
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ No request interceptor needed — the browser sends the HttpOnly cookie
// automatically because withCredentials: true. Reading the token from
// localStorage and injecting it as a Bearer header was the XSS vulnerability.

// Response interceptor — handle global 401 (session expired / cookie invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Notify AuthContext to clear the user state
      window.dispatchEvent(new Event('auth-token-removed'));
    }
    return Promise.reject(error);
  }
);

export default api;
