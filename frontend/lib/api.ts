import {
  Property,
  PropertyCreate,
  Tenant,
  TenantCreate,
  Lease,
  LeaseCreate,
  DashboardStats,
  LoginResponse,
  ApiError,
} from '@/data/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// Token management
const TOKEN_KEY = 'admin_token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

function authHeaders(): HeadersInit {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({ error: 'An error occurred' }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// ============================================================================
// AUTH
// ============================================================================

export async function login(password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  const data = await handleResponse<LoginResponse>(res)
  setToken(data.token)
  return data
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${BASE_URL}/api/admin/logout`, {
      method: 'POST',
      headers: { ...authHeaders() },
    })
  } finally {
    clearToken()
  }
}

export async function checkAuth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/me`, {
      headers: { ...authHeaders() },
    })
    return res.ok
  } catch {
    return false
  }
}

// ============================================================================
// PROPERTIES (Public)
// ============================================================================

export interface PropertyFilters {
  available?: boolean
  beds?: number
  minRent?: number
  maxRent?: number
  search?: string
  type?: string
}

export async function fetchProperties(filters?: PropertyFilters): Promise<Property[]> {
  const params = new URLSearchParams()
  if (filters?.available !== undefined) params.set('available', String(filters.available))
  if (filters?.beds) params.set('beds', String(filters.beds))
  if (filters?.minRent) params.set('minRent', String(filters.minRent))
  if (filters?.maxRent) params.set('maxRent', String(filters.maxRent))
  if (filters?.search) params.set('search', filters.search)
  if (filters?.type) params.set('type', filters.type)

  const url = `${BASE_URL}/api/properties${params.toString() ? `?${params}` : ''}`
  const res = await fetch(url)
  return handleResponse<Property[]>(res)
}

export async function fetchProperty(id: number): Promise<Property> {
  const res = await fetch(`${BASE_URL}/api/properties/${id}`)
  return handleResponse<Property>(res)
}

// ============================================================================
// PROPERTIES (Admin)
// ============================================================================

export async function fetchAdminProperties(): Promise<Property[]> {
  const res = await fetch(`${BASE_URL}/api/admin/properties`, {
    headers: { ...authHeaders() },
  })
  return handleResponse<Property[]>(res)
}

export async function createProperty(data: PropertyCreate): Promise<Property> {
  const res = await fetch(`${BASE_URL}/api/admin/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  return handleResponse<Property>(res)
}

export async function updateProperty(id: number, data: Partial<PropertyCreate>): Promise<Property> {
  const res = await fetch(`${BASE_URL}/api/admin/properties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  return handleResponse<Property>(res)
}

export async function deleteProperty(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/properties/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  return handleResponse<void>(res)
}

// ============================================================================
// TENANTS (Admin)
// ============================================================================

export async function fetchTenants(): Promise<Tenant[]> {
  const res = await fetch(`${BASE_URL}/api/admin/tenants`, {
    headers: { ...authHeaders() },
  })
  return handleResponse<Tenant[]>(res)
}

export async function fetchTenant(id: number): Promise<Tenant> {
  const res = await fetch(`${BASE_URL}/api/admin/tenants/${id}`, {
    headers: { ...authHeaders() },
  })
  return handleResponse<Tenant>(res)
}

export async function createTenant(data: TenantCreate): Promise<Tenant> {
  const res = await fetch(`${BASE_URL}/api/admin/tenants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  return handleResponse<Tenant>(res)
}

export async function updateTenant(id: number, data: Partial<TenantCreate>): Promise<Tenant> {
  const res = await fetch(`${BASE_URL}/api/admin/tenants/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  return handleResponse<Tenant>(res)
}

export async function deleteTenant(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/tenants/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  return handleResponse<void>(res)
}

// ============================================================================
// LEASES (Admin)
// ============================================================================

export interface LeaseFilters {
  status?: string
  propertyId?: number
  tenantId?: number
}

export async function fetchLeases(filters?: LeaseFilters): Promise<Lease[]> {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.propertyId) params.set('propertyId', String(filters.propertyId))
  if (filters?.tenantId) params.set('tenantId', String(filters.tenantId))

  const url = `${BASE_URL}/api/admin/leases${params.toString() ? `?${params}` : ''}`
  const res = await fetch(url, {
    headers: { ...authHeaders() },
  })
  return handleResponse<Lease[]>(res)
}

export async function fetchLease(id: number): Promise<Lease> {
  const res = await fetch(`${BASE_URL}/api/admin/leases/${id}`, {
    headers: { ...authHeaders() },
  })
  return handleResponse<Lease>(res)
}

export async function createLease(data: LeaseCreate): Promise<Lease> {
  const res = await fetch(`${BASE_URL}/api/admin/leases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  return handleResponse<Lease>(res)
}

export async function updateLease(id: number, data: Partial<LeaseCreate>): Promise<Lease> {
  const res = await fetch(`${BASE_URL}/api/admin/leases/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  return handleResponse<Lease>(res)
}

export async function deleteLease(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/leases/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  return handleResponse<void>(res)
}

// ============================================================================
// DASHBOARD
// ============================================================================

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
    headers: { ...authHeaders() },
  })
  return handleResponse<DashboardStats>(res)
}
