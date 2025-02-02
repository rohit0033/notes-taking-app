import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  });
  const navigate = useNavigate();

  const login = useCallback(async (credentials: LoginCredentials) => {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Email and password are required');
    }

    try {
      const response = await authApi.login({
        email: String(credentials.email).trim(),
        password: String(credentials.password)
      });
      
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        navigate('/');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [navigate]);

  const signup = useCallback(async (data: SignupData) => {
    if (!data?.name || !data?.email || !data?.password) {
      throw new Error('Name, email, and password are required');
    }

    try {
      const response = await authApi.signup({
        name: String(data.name).trim(),
        email: String(data.email).trim(),
        password: String(data.password)
      });
      
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        navigate('/');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
