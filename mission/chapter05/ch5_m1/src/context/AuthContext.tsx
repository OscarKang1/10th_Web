import React, { createContext, useContext, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string | null>('accessToken', null);
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<string | null>('refreshToken', null);

  const login = useCallback((newAccessToken: string, newRefreshToken: string) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
  }, [setAccessToken, setRefreshToken]);

  const logout = useCallback(() => {
    removeAccessToken();
    removeRefreshToken();
  }, [removeAccessToken, removeRefreshToken]);

  const isAuthenticated = !!accessToken;

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      login,
      logout,
      isAuthenticated,
    }),
    [accessToken, refreshToken, login, logout, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
