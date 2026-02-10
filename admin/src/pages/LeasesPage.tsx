import { useEffect, useState } from 'react';
import { getLeases, createLease, getProperties, getTenants } from '../lib/api';

interface Lease {
  id: number;
  property_name: string;
  tenant_name: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  status: string;
}

interface Property {
  id: number;
  name: string;
  city: string;
}

interface Tenant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const STATUSES = ['upcoming', 'active', 'ended', 'terminated'];

const emptyForm = {
  property_id: '',
  tenant_id: '',
  start_date: '',
  end_date: '',
  monthly_rent: '',
  security_deposit: '',
  status: 'upcoming',
};

function LeasesPage() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      const [l, p, t] = await Promise.all([getLeases(), getProperties(), getTenants()]);
      setLeases(l);
      setProperties(p);
      setTenants(t);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await createLease({
        property_id: Number(form.property_id),
        tenant_id: Number(form.tenant_id),
        start_date: form.start_date,
        end_date: form.end_date,
        monthly_rent: Number(form.monthly_rent),
        security_deposit: form.security_deposit ? Number(form.security_deposit) : null,
        status: form.status,
      });
      setForm(emptyForm);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="page-container">
      <h2>Leases</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="add-form" onSubmit={onSubmit}>
        <h3>Create Lease</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Property *</label>
            <select name="property_id" value={form.property_id} onChange={onChange} required>
              <option value="">Select property</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.city}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tenant *</label>
            <select name="tenant_id" value={form.tenant_id} onChange={onChange} required>
              <option value="">Select tenant</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>{t.first_name} {t.last_name} ({t.email})</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input name="start_date" type="date" value={form.start_date} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>End Date *</label>
            <input name="end_date" type="date" value={form.end_date} onChange={onChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Monthly Rent *</label>
            <input name="monthly_rent" type="number" step="0.01" value={form.monthly_rent} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Security Deposit</label>
            <input name="security_deposit" type="number" step="0.01" value={form.security_deposit} onChange={onChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Status *</label>
          <select name="status" value={form.status} onChange={onChange} required>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Create Lease</button>
      </form>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : leases.length === 0 ? (
        <div className="empty-state">No leases yet.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Tenant</th>
                <th>Start</th>
                <th>End</th>
                <th>Monthly Rent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leases.map((l) => (
                <tr key={l.id}>
                  <td>{l.property_name}</td>
                  <td>{l.tenant_name}</td>
                  <td>{l.start_date}</td>
                  <td>{l.end_date}</td>
                  <td>${Number(l.monthly_rent).toLocaleString()}</td>
                  <td>{l.status.charAt(0).toUpperCase() + l.status.slice(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LeasesPage;
