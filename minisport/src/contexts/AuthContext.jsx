import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const axiosInstance = axios.create({
    baseURL: 'https://mis.minisports.gov.rw/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (token) {
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
      console.log('User data from localStorage:', JSON.parse(storedUser));
     console.log('Token from localStorage:', storedToken); 
    } else {
      console.log('No user or token found in localStorage');
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting to log in with email:', email);
      const response = await axios.post('https://mis.minisports.gov.rw/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        setUser(data.user);
        setToken(data.token);
        setIsAuthenticated(true);

        console.log('Login successful. User data:', data.user);  // Log user data after login
        console.log('Login successful. Token:', data.token);  // Log token after login
      }
    } catch (error) {
      console.error('Login error:', error.message); // Log login errors
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    console.log('User has been logged out');    };

 useEffect(() => {
    console.log('Authentication state changed:');
    console.log('User:', user);
    console.log('Token:', token);
    console.log('IsAuthenticated:', isAuthenticated);
  }, [user, token, isAuthenticated]); 
  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, axiosInstance }}>
      {children}
    </AuthContext.Provider>
  );
};
