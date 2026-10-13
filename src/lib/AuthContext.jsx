import React, { createContext, useContext, useEffect, useState } from 'react';

const KEY  = 'xusers_access';
const CODE = (import.meta.env.VITE_USERS_ACCESS_CODE || '').trim();

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    setUser(saved === 'ok' ? { role: 'admin' } : null);
    setLoading(false);
  }, []);

  const signIn = (code) => {
    if (!CODE) return { ok: false, error: 'Server misconfigured — access code missing' };
    if (String(code).trim() === CODE) {
      localStorage.setItem(KEY, 'ok');
      setUser({ role: 'admin' });
      return { ok: true };
    }
    return { ok: false, error: 'Invalid access code' };
  };

  const signOut = () => { localStorage.removeItem(KEY); setUser(null); };

  return (
    <AuthCtx.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
