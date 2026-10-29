import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cheggout_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((token, userData) => {
    localStorage.setItem('cheggout_token', token);
    localStorage.setItem('cheggout_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cheggout_token');
    localStorage.removeItem('cheggout_user');
    localStorage.removeItem('chegPwaToken');
    localStorage.removeItem('chegCustomerId');
    localStorage.removeItem('bName');
    localStorage.removeItem('name');
    setUser(null);
    window.dispatchEvent(new CustomEvent('app:logout'));
  }, []);

  const isAuthenticated = Boolean(user && localStorage.getItem('cheggout_token'));

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
