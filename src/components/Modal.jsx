import React from 'react';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto',
        background: '#EEF1F6',
        borderRadius: '20px 20px 0 0',
        padding: 20,
        boxShadow: '0 -8px 30px rgba(163,177,198,0.5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{title}</div>
          <button onClick={onClose} className="neu-btn" style={{ padding: 8, borderRadius: 10 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
