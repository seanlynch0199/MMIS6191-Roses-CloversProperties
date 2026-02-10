import { useEffect, useState } from 'react';
import { getProperties, createProperty } from '../lib/api';

interface Property {
  id: number;
  name: string;
  address_line1: string;
  city: string;
  state: string;
  zip: string;
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  monthly_rent: number;
  available: boolean;
  description: string | null;
}

const PROPERTY_TYPES = ['apartment', 'house', 'duplex', 'condo', 'townhouse', 'studio'];

const emptyForm = {
  name: '',
  address_line1: '',
  city: '',
  state: '',
  zip: '',
  property_type: '',
  monthly_rent: '',
  bedrooms: '',
  bathrooms: '',
  available: true,
  description: '',
};

function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setProperties(await getProperties());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, type, value } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await createProperty({
        name: form.name,
        address_line1: form.address_line1,
        city: form.city,
        state: form.state,
        zip: form.zip,
        property_type: form.property_type,
        monthly_rent: Number(form.monthly_rent),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        available: form.available,
        description: form.description || null,
      });
      setForm(emptyForm);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="page-container">
      <h2>Properties</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="add-form" onSubmit={onSubmit}>
        <h3>Add Property</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Name *</label>
            <input name="name" value={form.name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Property Type *</label>
            <select name="property_type" value={form.property_type} onChange={onChange} required>
              <option value="">Select type</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Address *</label>
          <input name="address_line1" value={form.address_line1} onChange={onChange} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>City *</label>
            <input name="city" value={form.city} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>State *</label>
            <input name="state" value={form.state} onChange={onChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Zip *</label>
            <input name="zip" value={form.zip} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Monthly Rent *</label>
            <input name="monthly_rent" type="number" step="0.01" value={form.monthly_rent} onChange={onChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Bedrooms</label>
            <input name="bedrooms" type="number" value={form.bedrooms} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Bathrooms</label>
            <input name="bathrooms" type="number" value={form.bathrooms} onChange={onChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={onChange} rows={3} />
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input name="available" type="checkbox" checked={form.available} onChange={onChange} />
            Available
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Add Property</button>
      </form>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : properties.length === 0 ? (
        <div className="empty-state">No properties yet.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>State</th>
                <th>Type</th>
                <th>Beds</th>
                <th>Baths</th>
                <th>Monthly Rent</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.city}</td>
                  <td>{p.state}</td>
                  <td>{p.property_type}</td>
                  <td>{p.bedrooms ?? '—'}</td>
                  <td>{p.bathrooms ?? '—'}</td>
                  <td>${Number(p.monthly_rent).toLocaleString()}</td>
                  <td>{p.available ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PropertiesPage;
