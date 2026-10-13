import React, { useEffect, useState, useCallback } from 'react';
import Modal from './Modal.jsx';
import { useToast } from './Toast.jsx';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export default function CrudPage({
  title, subtitle,
  fetcher, columns, formFields,
  onCreate, onUpdate, onDelete,
  searchKeys = [],
  primaryKey = 'id',
  extraRowActions,
  refreshMs = 3000,
}) {
  const { show } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetcher();
      setItems(Array.isArray(res?.items) ? res.items : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    load();
    const id = setInterval(load, refreshMs);
    return () => clearInterval(id);
  }, [load, refreshMs]);

  const openNew = () => {
    const blank = { __isNew: true };
    formFields.forEach((f) => {
      if (f.type === 'array') blank[f.key] = '';
      else if (f.type === 'boolean') blank[f.key] = !!f.default;
      else blank[f.key] = f.default ?? '';
    });
    setEditing(blank);
  };

  const openEdit = (row) => {
    const copy = { ...row };
    formFields.forEach((f) => {
      if (f.type === 'array') {
        copy[f.key] = Array.isArray(row[f.key]) ? row[f.key].join('\n') : (row[f.key] || '');
      }
    });
    setEditing(copy);
  };

  const save = async () => {
    if (!editing) return;
    for (const f of formFields) {
      if (f.required && (editing[f.key] === undefined || editing[f.key] === '' || editing[f.key] === null)) {
        show?.(`${f.label} is required`, 'error');
        return;
      }
    }
    setSaving(true);
    try {
      const isNew = !editing[primaryKey] || editing.__isNew;
      const payload = {};
      formFields.forEach((f) => {
        let v = editing[f.key];
        if (f.type === 'number') v = (v === '' || v == null) ? (f.default ?? 0) : Number(v);
        else if (f.type === 'boolean') v = !!v;
        else if (f.type === 'array') {
          v = typeof v === 'string'
            ? v.split('\n').map(s => s.trim()).filter(Boolean)
            : Array.isArray(v) ? v : [];
        }
        if ((v === '' || v == null) && !f.required) return;
        payload[f.key] = v;
      });
      const res = isNew ? await onCreate(payload) : await onUpdate(editing[primaryKey], payload);
      if (res?.error) throw res.error;
      show?.(isNew ? 'Created' : 'Updated', 'success');
      setEditing(null);
      load();
    } catch (e) {
      show?.(String(e.message || e), 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    const label = row.name || row.title || row.email || row.code || String(row[primaryKey]).slice(0, 8);
    if (!confirm(`Delete "${label}"?`)) return;
    try {
      const res = await onDelete(row[primaryKey]);
      if (res?.error) throw res.error;
      show?.('Deleted', 'success');
      load();
    } catch (e) {
      show?.(String(e.message || e), 'error');
    }
  };

  const quickUpdate = async (id, patch) => {
    try {
      const res = await onUpdate(id, patch);
      if (res?.error) throw res.error;
      show?.('Updated', 'success');
      load();
    } catch (e) {
      show?.(String(e.message || e), 'error');
    }
  };

  const filtered = !search ? items : items.filter((it) =>
    searchKeys.some((k) => String(it[k] ?? '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>{title}</h2>
          <p className="muted" style={{ fontSize: 13, marginTop: 2 }}>
            {subtitle || `${items.length} items`}
          </p>
        </div>
        <button className="neu-btn-primary" onClick={openNew}
          style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
          <Plus size={14} /> New
        </button>
      </div>

      {searchKeys.length > 0 && (
        <div style={{ position: 'relative', margin: '16px 0' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: 15, color: '#97A0B5' }} />
          <input className="neu-input" style={{ paddingLeft: 40 }} placeholder="Search…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="neu-card muted" style={{ padding: 30, textAlign: 'center' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="neu-card" style={{ padding: 30, textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
            {items.length === 0 ? 'No data yet' : 'No matches'}
          </div>
          <div className="muted" style={{ fontSize: 12 }}>
            {items.length === 0 ? 'Tap "New" to add the first entry.' : 'Try a different search.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((row, i) => (
            <div key={row[primaryKey] ?? i} className="neu-card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {columns[0]?.render ? columns[0].render(row) : (
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{String(row[columns[0]?.key] ?? '—')}</div>
                  )}
                </div>
                {row.status && (
                  <span className={`neu-badge badge-${(row.status || '').toLowerCase()}`}>
                    {row.status}
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px', marginBottom: 10 }}>
                {columns.slice(1).map((c) => (
                  <div key={c.key} style={{ minWidth: 0 }}>
                    <div className="muted" style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: .4, marginBottom: 2 }}>
                      {c.label.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 12.5, wordBreak: 'break-word' }}>
                      {c.render ? c.render(row) : String(row[c.key] ?? '—')}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {extraRowActions && extraRowActions(row, { update: quickUpdate })}
                <button onClick={() => openEdit(row)} className="neu-btn"
                  style={{ flex: 1, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12.5 }}>
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => remove(row)} className="neu-btn"
                  style={{ padding: '10px 14px', color: '#DC2626' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)}
        title={editing?.__isNew ? `New ${title}` : `Edit ${title}`}>
        {editing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {formFields.map((f) => (
              <div key={f.key}>
                <div className="muted" style={{ fontSize: 11, fontWeight: 800, marginBottom: 5, letterSpacing: .4 }}>
                  {f.label.toUpperCase()}{f.required ? ' *' : ''}
                </div>
                {f.type === 'textarea' ? (
                  <textarea className="neu-input" rows={3} value={editing[f.key] ?? ''}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} />
                ) : f.type === 'array' ? (
                  <textarea className="neu-input" rows={3} placeholder={f.placeholder || 'One per line'}
                    value={editing[f.key] ?? ''}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} />
                ) : f.type === 'select' ? (
                  <select className="neu-input" value={editing[f.key] ?? ''}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}>
                    <option value="">— select —</option>
                    {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === 'boolean' ? (
                  <label className="neu-btn" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!editing[f.key]}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })}
                      style={{ width: 18, height: 18 }} />
                    <span style={{ fontSize: 14 }}>{f.label}</span>
                  </label>
                ) : (
                  <input className="neu-input" type={f.type || 'text'} value={editing[f.key] ?? ''}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={save} disabled={saving} className="neu-btn-primary"
                style={{ flex: 1, padding: 12, fontSize: 13 }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setEditing(null)} className="neu-btn"
                style={{ flex: 1, padding: 12, fontSize: 13 }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
