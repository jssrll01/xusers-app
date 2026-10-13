import React from 'react';
import CrudPage from '../components/CrudPage.jsx';
import { fetchUsers, userCrud } from '../lib/api.js';
import { peso, dateOnly, initials } from '../lib/format.js';

const STATUS_OPTS = ['active', 'frozen', 'banned'];

export default function Users() {
  return (
    <CrudPage
      title="Users"
      subtitle="All profiles"
      fetcher={fetchUsers}
      searchKeys={['email', 'username', 'first_name', 'last_name', 'phone']}
      columns={[
        { key: 'name', label: 'User', render: (r) => {
          const name = [r.first_name, r.last_name].filter(Boolean).join(' ') || r.username || r.email || '—';
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg,#7C3AED,#2563EB)',
                color: '#fff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0,
              }}>
                {initials(r.first_name, r.last_name, r.email || name)}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{name}</div>
                <div className="muted" style={{ fontSize: 11 }}>{(r.id || '').slice(0, 8)}</div>
              </div>
            </div>
          );
        } },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone', render: (r) => r.phone || '—' },
        { key: 'loyalty_tier', label: 'Tier', render: (r) => r.loyalty_tier || '—' },
        { key: 'xwallet_balance', label: 'Wallet', render: (r) => peso(r.xwallet_balance || 0) },
        { key: 'loyalty_points', label: 'Points', render: (r) => r.loyalty_points || 0 },
        { key: 'status', label: 'Status' },
        { key: 'created_at', label: 'Joined', render: (r) => dateOnly(r.created_at) },
      ]}
      formFields={[
        { key: 'email', label: 'Email' },
        { key: 'username', label: 'Username' },
        { key: 'first_name', label: 'First name' },
        { key: 'last_name', label: 'Last name' },
        { key: 'phone', label: 'Phone' },
        { key: 'nearest_landmark', label: 'Landmark', required: true },
        { key: 'barangay', label: 'Barangay', required: true },
        { key: 'province', label: 'Province' },
        { key: 'city', label: 'City' },
        { key: 'delivery_address', label: 'Address', type: 'textarea' },
        { key: 'loyalty_tier', label: 'Tier', type: 'select',
          options: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
        { key: 'xwallet_balance', label: 'Wallet balance', type: 'number', default: 0 },
        { key: 'loyalty_points', label: 'Loyalty points', type: 'number', default: 0 },
        { key: 'status', label: 'Status', type: 'select',
          options: STATUS_OPTS, default: 'active' },
      ]}
      onCreate={userCrud.create}
      onUpdate={userCrud.update}
      onDelete={userCrud.remove}
      extraRowActions={(row, { update }) => (
        <select className="neu-input"
          value={(row.status || 'active').toLowerCase()}
          onChange={(e) => update(row.id, { status: e.target.value })}
          style={{ width: 100, padding: 8, fontSize: 12 }}>
          <option value="active">Active</option>
          <option value="frozen">Frozen</option>
          <option value="banned">Banned</option>
        </select>
      )}
    />
  );
}
