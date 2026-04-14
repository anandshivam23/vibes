import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import api, { onAuthFailure } from '../api/axios';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutCalled = useRef(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/current-user');
        setCurrentUser(response.data?.data || null);
      } catch {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const handleAuthFailure = () => {
      if (logoutCalled.current) return; 
      logoutCalled.current = true;
      setCurrentUser(null);
      setTimeout(() => { logoutCalled.current = false; }, 2000);
    };
    onAuthFailure(handleAuthFailure);
  }, []);
  const login = async (emailOrUsername, password) => {
    const isEmail = emailOrUsername.includes('@');
    const payload = isEmail
      ? { email: emailOrUsername, password }
      : { username: emailOrUsername, password };
    const response = await api.post('/users/login', payload);
    const user = response.data?.data?.user;
    if (!user) throw new Error('Unexpected response from server');
    setCurrentUser(user);
    return response.data;
  };
  const register = async (formData) => {
    const response = await api.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  };
  const logout = async () => {
    try {
      await api.post('/users/logout');
    } catch {
    } finally {
      setCurrentUser(null);
    }
  };
  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading, setCurrentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);