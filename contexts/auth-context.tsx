'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import {
  performCookieCleanup,
  startCookieMonitoring,
} from '@/lib/cookie-utils';

interface User {
  id?: string;
  name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderContent({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name || undefined,
        email: session.user.email || undefined,
      });
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  }, [session, status]);

  // Comment out cookie monitoring
  // useEffect(() => {
  //   startCookieMonitoring();
  // }, []);

  // For OAuth callbacks or other external auth state changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        // Only use localStorage if no NextAuth session exists
        if (!session?.user) {
          const token = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');

          if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        }
      }
    };

    // Add SSR guard
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [session]);

  const login = (token: string, userData: User) => {
    // If NextAuth session doesn't exist, use localStorage
    if (!session?.user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    // Clean up auth cookies on logout
    performCookieCleanup();
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
