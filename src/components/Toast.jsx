import React, { createContext, useCallback, useContext, useState } from 'react';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [msgs, setMsgs] = useState([]);

  const show = useCallback((text, type = 'success') => {
    const id = Date.now() + Math.random();
    setMsgs((m) => [...m, { id, text, type }]);
    setTimeout(() => setMsgs((m) => m.filter((x) => x.id !== id)), 2600);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 100, left: 16, right: 16, zIndex: 1000,
        display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
      }}>
        {msgs.map((m) => (
          <div key={m.id} style={{
            padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700,
            background: m.type === 'error' ? '#FEE2E2' : '#D1FAE5',
            color: m.type === 'error' ? '#991B1B' : '#065F46',
            boxShadow: '4px 4px 12px rgba(163,177,198,0.4)',
          }}>{m.text}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
