import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextValue {
  accessToken: string;
  userName: string;
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState(() => {
    try { return JSON.parse(localStorage.getItem('accessToken') ?? '""') as string; }
    catch { return ''; }
  });
  const [userName, setUserName] = useState(() => {
    try { return JSON.parse(localStorage.getItem('userName') ?? '""') as string; }
    catch { return ''; }
  });

  const login = (token: string, refresh: string, name: string) => {
    localStorage.setItem('accessToken', JSON.stringify(token));
    localStorage.setItem('refreshToken', JSON.stringify(refresh));
    localStorage.setItem('userName', JSON.stringify(name));
    setAccessToken(token);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    setAccessToken('');
    setUserName('');
  };

  return (
    <AuthContext.Provider value={{ accessToken, userName, isLoggedIn: !!accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
