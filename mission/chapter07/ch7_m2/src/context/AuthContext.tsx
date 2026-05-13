import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextValue {
  accessToken: string;
  userId: number;
  userName: string;
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string, name: string, id: number) => void;
  logout: () => void;
  updateUserName: (name: string) => void;
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
  const [userId, setUserId] = useState(() => {
    try { return JSON.parse(localStorage.getItem('userId') ?? '0') as number; }
    catch { return 0; }
  });

  const login = (token: string, refresh: string, name: string, id: number) => {
    localStorage.setItem('accessToken', JSON.stringify(token));
    localStorage.setItem('refreshToken', JSON.stringify(refresh));
    localStorage.setItem('userName', JSON.stringify(name));
    localStorage.setItem('userId', JSON.stringify(id));
    setAccessToken(token);
    setUserName(name);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setAccessToken('');
    setUserName('');
    setUserId(0);
  };

  const updateUserName = (name: string) => {
    localStorage.setItem('userName', JSON.stringify(name));
    setUserName(name);
  };

  return (
    <AuthContext.Provider value={{ accessToken, userId, userName, isLoggedIn: !!accessToken, login, logout, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
