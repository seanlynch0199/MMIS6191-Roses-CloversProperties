const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export function getProperties() {
  return request('/properties');
}

export function createProperty(data: Record<string, unknown>) {
  return request('/properties', { method: 'POST', body: JSON.stringify(data) });
}

export function getTenants() {
  return request('/tenants');
}

export function createTenant(data: Record<string, unknown>) {
  return request('/tenants', { method: 'POST', body: JSON.stringify(data) });
}

export function getLeases() {
  return request('/leases');
}

export function createLease(data: Record<string, unknown>) {
  return request('/leases', { method: 'POST', body: JSON.stringify(data) });
}
