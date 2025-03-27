'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextValue {
  token: string | null;
  name: string | null;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  name: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data || {};
      if (type === 'NUKE_CHAT_AUTH') {
        if (payload?.token) setToken(payload.token);
        if (payload?.name) setName(payload.name);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <AuthContext.Provider value={{ token, name }}>
      {children}
    </AuthContext.Provider>
  );
}