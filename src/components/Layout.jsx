import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users as UsersIcon, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Layout({ children }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = () => { signOut(); navigate('/login'); };

  return (
    <div style={{ minHeight: '100vh', background: '#EEF1F6' }}>
      <header style={{
        padding: '10px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        position: 'sticky', top: 0, zIndex: 30,
        background: '#EEF1F6',
        boxShadow: '0 6px 14px rgba(163, 177, 198, 0.35)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          <div className="neu-card" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, flexShrink: 0 }}>
            <img src="/icons/icon-192.png" alt="XUsers" style={{ width: 22, height: 22, borderRadius: 5 }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>XUsers</div>
            <div className="muted" style={{ fontSize: 10 }}>Users console</div>
          </div>
        </div>
        <button onClick={handleSignOut} className="neu-btn" style={{ padding: 10, borderRadius: 10 }} title="Logout">
          <LogOut size={16} style={{ color: '#DC2626' }} />
        </button>
      </header>
      <main style={{ paddingBottom: 40 }}>{children}</main>
    </div>
  );
}
