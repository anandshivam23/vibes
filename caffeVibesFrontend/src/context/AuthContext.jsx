import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const response = await api.get('/users/current-user');
        setCurrentUser(response.data.data);
      } catch (error) {

        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (emailOrUsername, password) => {
    const payload = emailOrUsername.includes('@')
      ? { email: emailOrUsername, password }
      : { username: emailOrUsername, password };

    const response = await api.post('/users/login', payload);
    setCurrentUser(response.data.data.user);
    return response.data;
  };

  const register = async (formData) => {
    const response = await api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });


    return response.data;
  };

  const logout = async () => {
    await api.post('/users/logout');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
