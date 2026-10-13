import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    const res = signIn(code.trim());
    if (!res.ok) return setErr(res.error);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20, background: '#EEF1F6' }}>
      <form onSubmit={submit} className="neu-card" style={{ padding: 28, width: '100%', maxWidth: 360 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div className="neu-card" style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14 }}>
            <img src="/icons/icon-192.png" alt="XUsers" style={{ width: 30, height: 30, borderRadius: 7 }} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>XUsers</div>
            <div className="muted" style={{ fontSize: 12 }}>Admin access only</div>
          </div>
        </div>
        <label className="muted" style={{ fontSize: 12, fontWeight: 700 }}>Access code</label>
        <div style={{ position: 'relative', marginTop: 6, marginBottom: 14 }}>
          <KeyRound size={16} style={{ position: 'absolute', left: 14, top: 15, color: '#97A0B5' }} />
          <input type="password" inputMode="numeric" autoComplete="off"
            value={code} onChange={(e) => setCode(e.target.value)}
            placeholder="••••" autoFocus required className="neu-input"
            style={{ paddingLeft: 38, letterSpacing: 6, fontSize: 16, textAlign: 'center' }} />
        </div>
        {err && (
          <div style={{ background: '#FFE4E6', color: '#B91C1C', padding: 10, borderRadius: 10, fontSize: 12.5, marginBottom: 12, fontWeight: 700 }}>
            {err}
          </div>
        )}
        <button type="submit" className="neu-btn-primary"
          style={{ width: '100%', padding: 14, borderRadius: 14, fontSize: 14 }}>
          Enter
        </button>
        <div className="muted" style={{ fontSize: 11, textAlign: 'center', marginTop: 16 }}>
          Only authorized staff may access this console.
        </div>
      </form>
    </div>
  );
}
