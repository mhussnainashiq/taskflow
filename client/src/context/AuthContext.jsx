import { createContext, useContext, useState, useEffect } from 'react';
import { localAuth, seedIfEmpty } from '../services/localStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedIfEmpty();
    const current = localAuth.getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = localAuth.login(email, password);
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = localAuth.register(name, email, password);
    setUser(data);
    return data;
  };

  const logout = () => {
    localAuth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};