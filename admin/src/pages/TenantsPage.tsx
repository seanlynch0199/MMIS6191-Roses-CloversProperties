import { useEffect, useState } from 'react';
import { getTenants, createTenant } from '../lib/api';

interface Tenant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

const emptyForm = { first_name: '', last_name: '', email: '', phone: '' };

function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setTenants(await getTenants());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await createTenant(form);
      setForm(emptyForm);
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) {
        setError('A tenant with this email address already exists.');
      } else {
        setError(msg);
      }
    }
  }

  return (
    <div className="page-container">
      <h2>Tenants</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="add-form" onSubmit={onSubmit}>
        <h3>Add Tenant</h3>
        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input name="first_name" value={form.first_name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input name="last_name" value={form.last_name} onChange={onChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" type="tel" value={form.phone} onChange={onChange} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Add Tenant</button>
      </form>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : tenants.length === 0 ? (
        <div className="empty-state">No tenants yet.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id}>
                  <td>{t.first_name}</td>
                  <td>{t.last_name}</td>
                  <td>{t.email}</td>
                  <td>{t.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TenantsPage;
