
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await axios.get('https://ecommerce.routemisr.com/api/v1/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };
      fetchUser();
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signin', { email, password });
      if (response.data.message === 'success') {
        const token = response.data.token;
        localStorage.setItem('authToken', token);

        const userResponse = await axios.get('https://ecommerce.routemisr.com/api/v1/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(userResponse.data);

        navigate('/home');
      } else {
        console.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const register = async (username, password, email, phone) => {
    try {
      const response = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', { username, password, email, phone });
      setUser(response.data.user);
      localStorage.setItem('authToken', response.data.token);
      navigate('/home');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put('https://ecommerce.routemisr.com/api/v1/users', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(profileData); 
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
