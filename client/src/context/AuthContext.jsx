import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUser = (nextUser) => {
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      
      // Check if response has the expected structure
      if (!data || !data.token || !data.user) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('token', data.token);
      syncUser(data.user);
      return data;
    } catch (error) {
      // Re-throw with a more user-friendly message
      const message = error.message || 'Failed to login. Please check your credentials.';
      throw new Error(message);
    }
  };

  const signup = async (userData) => {
    return api.post('/auth/signup', userData);
  };

  const verifySignupOtp = async (payload) => {
    const data = await api.post('/auth/verify-otp', payload);
    localStorage.setItem('token', data.token);
    syncUser(data.user);
    return data;
  };

  const resendSignupOtp = async (email) => {
    return api.post('/auth/resend-otp', { email });
  };

  const forgotPassword = async (email) => {
    return api.post('/auth/forgot-password', { email });
  };

  const resetPassword = async (payload) => {
    return api.post('/auth/reset-password', payload);
  };

  const refreshProfile = async () => {
    const data = await api.get('/users/profile');
    syncUser(data.user);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const data = await api.put('/users/profile', payload);
    syncUser({
      ...user,
      ...data.user,
    });
    return data;
  };

  const verifyProfilePhone = async (payload) => {
    const data = await api.post('/users/profile/verify-phone', payload);
    syncUser({
      ...user,
      ...data.user,
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, signup, verifySignupOtp, resendSignupOtp, forgotPassword, resetPassword,
      refreshProfile, updateProfile, verifyProfilePhone, logout,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false
    }}>
      {children}
    </AuthContext.Provider>
  );
};
