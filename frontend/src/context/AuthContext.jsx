import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status on mount using the HttpOnly cookie
  useEffect(() => {
    checkAuth();

    // Listen for 401 events dispatched by the Axios response interceptor
    const handleAuthChange = () => {
      // Cookie is gone / invalid — clear React state
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth-token-removed', handleAuthChange);

    return () => {
      window.removeEventListener('auth-token-removed', handleAuthChange);
    };
  }, []);

  // Verify session via the HttpOnly cookie — no localStorage needed
  const checkAuth = async () => {
    try {
      // The browser automatically sends the HttpOnly cookie because
      // withCredentials: true is set in api.js. No manual token required.
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // 401 = cookie absent or expired — user is not logged in
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        // ✅ No localStorage.setItem — the server already set the HttpOnly cookie
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Notify FormContext to reload data for this user
        window.dispatchEvent(new Event('form-data-reload'));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data.success) {
        // Don't set token or user — OTP verification required first
        return {
          success: true,
          email: response.data.email,
          message: response.data.message
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout'); // server clears the HttpOnly cookie
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // ✅ No localStorage.removeItem — the cookie was cleared server-side
      setUser(null);
      setIsAuthenticated(false);
      window.dispatchEvent(new Event('auth-token-removed'));
      window.dispatchEvent(new Event('form-data-reset'));
    }
  };

  // Merge partial updates into the user object (e.g., after profile picture upload)
  const updateUser = (partialUser) => {
    setUser((prev) => prev ? { ...prev, ...partialUser } : prev);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
