import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import * as AuthService from '../services/auth.service';
import * as TokenStorage from '../utils/token.storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔑 AUTH RESTORE — runs once on app start
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const token = await TokenStorage.getAccessToken();
        setIsAuthenticated(!!token);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const data = await AuthService.login(username, password);

    if (!data?.access_token || !data?.refresh_token) {
      throw new Error('Invalid auth response');
    }

    await TokenStorage.saveTokens(data.access_token, data.refresh_token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await TokenStorage.clearTokens();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
