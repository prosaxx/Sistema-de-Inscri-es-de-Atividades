import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Admin } from '../types';
import { adminService } from '../services/api';

interface AuthContextData {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um admin logado no localStorage
    const storedAdmin = localStorage.getItem('currentAdmin');
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error('Erro ao carregar admin do localStorage:', error);
        localStorage.removeItem('currentAdmin');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await adminService.login(email, senha);
      
      if (response.admin) {
        setAdmin(response.admin);
        localStorage.setItem('currentAdmin', JSON.stringify(response.admin));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('currentAdmin');
    localStorage.removeItem('authToken');
  };

  const value: AuthContextData = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};