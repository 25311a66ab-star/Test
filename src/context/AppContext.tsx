import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { dataProvider } from '../lib/data/provider';
import type { DateRangeKey, UserProfile } from '../lib/data/types';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error';
}

interface AppContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  dateRange: DateRangeKey;
  setDateRange: (r: DateRangeKey) => void;
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, companyName: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  toasts: ToastMessage[];
  toast: (msg: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const AUTH_KEY = 'marketpulse_demo_auth_v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem(AUTH_KEY) !== 'logged_out';
  });
  const [dateRange, setDateRange] = useState<DateRangeKey>('30d');
  const [globalSearch, setGlobalSearch] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const refreshProfile = useCallback(async () => {
    const p = await dataProvider.getProfile();
    setUser(p);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshProfile();
    }
  }, [isAuthenticated, refreshProfile]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (msg: Omit<ToastMessage, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { ...msg, id }]);
      setTimeout(() => dismissToast(id), 4000);
    },
    [dismissToast]
  );

  const login = useCallback(
    async (email: string, _password: string) => {
      const profile = await dataProvider.updateProfile({ email });
      setUser(profile);
      setIsAuthenticated(true);
      window.localStorage.setItem(AUTH_KEY, 'logged_in');
      toast({ title: 'Welcome back', description: `Signed in as ${profile.fullName}`, variant: 'success' });
    },
    [toast]
  );

  const register = useCallback(
    async (fullName: string, email: string, companyName: string, _password: string) => {
      const profile = await dataProvider.updateProfile({ fullName, email, companyName });
      await dataProvider.updateWorkspace({ name: companyName || `${fullName}'s Workspace` });
      setUser(profile);
      setIsAuthenticated(true);
      window.localStorage.setItem(AUTH_KEY, 'logged_in');
      toast({ title: 'Account created', description: 'Your MarketPulse workspace is ready.', variant: 'success' });
    },
    [toast]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    window.localStorage.setItem(AUTH_KEY, 'logged_out');
    toast({ title: 'Signed out', description: 'You have been logged out safely.' });
  }, [toast]);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        dateRange,
        setDateRange,
        globalSearch,
        setGlobalSearch,
        login,
        register,
        logout,
        refreshProfile,
        toasts,
        toast,
        dismissToast,
      }}
    >
      {children}
      {/* Global Toast Viewport */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-xl bg-white border border-[#E1E5EB] p-4 shadow-[0_16px_32px_-8px_rgba(15,17,21,0.12)] flex items-start justify-between gap-3"
          >
            <div>
              <p
                className={`text-sm font-semibold ${
                  t.variant === 'error'
                    ? 'text-[#DC2626]'
                    : t.variant === 'success'
                    ? 'text-[#16A34A]'
                    : 'text-[#0F1115]'
                }`}
              >
                {t.title}
              </p>
              {t.description && <p className="text-xs text-[#4B5563] mt-0.5">{t.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="text-xs text-[#4B5563] hover:text-[#0F1115] px-1.5 py-0.5 rounded"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
