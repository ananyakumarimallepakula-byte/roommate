import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, userApi, notificationApi } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('roommate_token') || null);
  const [loading, setLoading] = useState(true);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const { showSuccess, showError } = useToast();

  const fetchUnreadCount = useCallback(async () => {
    if (!localStorage.getItem('roommate_token')) return;
    try {
      const res = await notificationApi.getUnreadCount();
      if (res.data?.unreadCount !== undefined) {
        setUnreadNotifCount(res.data.unreadCount);
      }
    } catch {
      // Silently ignore if not authorized
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem('roommate_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await userApi.getMe();
      if (res.data) {
        setUser(res.data);
        fetchUnreadCount();
      }
    } catch {
      localStorage.removeItem('roommate_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [fetchUnreadCount]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      const { token: jwt, user: userData } = res.data;
      localStorage.setItem('roommate_token', jwt);
      setToken(jwt);
      setUser(userData);
      showSuccess(`Welcome back, ${userData.fullName}!`);
      fetchUnreadCount();
      return userData;
    } catch (err) {
      showError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  const register = async (data) => {
    try {
      const res = await authApi.register(data);
      const { token: jwt, user: userData } = res.data;
      localStorage.setItem('roommate_token', jwt);
      setToken(jwt);
      setUser(userData);
      showSuccess('Registration successful! Welcome to ROOMMATE.');
      fetchUnreadCount();
      return userData;
    } catch (err) {
      showError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('roommate_token');
    setToken(null);
    setUser(null);
    setUnreadNotifCount(0);
    showSuccess('You have been logged out.');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    role: user?.role || null,
    loading,
    unreadNotifCount,
    login,
    register,
    logout,
    refreshUser,
    fetchUnreadCount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
