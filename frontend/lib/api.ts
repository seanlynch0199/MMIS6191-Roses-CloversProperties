import {
  Property,
  PropertyCreate,
  Tenant,
  TenantCreate,
  Lease,
  LeaseCreate,
  ApiError,
} from '@/data/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({ error: 'An error occurred' }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// ============================================================================
// PROPERTIES
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

export async function fetchAdminProperties(): Promise<Property[]> {
  const res = await fetch(`${BASE_URL}/api/properties`)
  return handleResponse<Property[]>(res)
}

export async function createProperty(data: PropertyCreate): Promise<Property> {
  const res = await fetch(`${BASE_URL}/api/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<Property>(res)
}

export async function updateProperty(id: number, data: Partial<PropertyCreate>): Promise<Property> {
  const res = await fetch(`${BASE_URL}/api/properties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<Property>(res)
}

export async function deleteProperty(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/properties/${id}`, {
    method: 'DELETE',
  })
  return handleResponse<void>(res)
}

// ============================================================================
// TENANTS
// ============================================================================

export async function fetchTenants(): Promise<Tenant[]> {
  const res = await fetch(`${BASE_URL}/api/tenants`)
  return handleResponse<Tenant[]>(res)
}

export async function fetchTenant(id: number): Promise<Tenant> {
  const res = await fetch(`${BASE_URL}/api/tenants/${id}`)
  return handleResponse<Tenant>(res)
}

export async function createTenant(data: TenantCreate): Promise<Tenant> {
  const res = await fetch(`${BASE_URL}/api/tenants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<Tenant>(res)
}

export async function updateTenant(id: number, data: Partial<TenantCreate>): Promise<Tenant> {
  const res = await fetch(`${BASE_URL}/api/tenants/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<Tenant>(res)
}

export async function deleteTenant(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/tenants/${id}`, {
    method: 'DELETE',
  })
  return handleResponse<void>(res)
}

// ============================================================================
// LEASES
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

  const url = `${BASE_URL}/api/leases${params.toString() ? `?${params}` : ''}`
  const res = await fetch(url)
  return handleResponse<Lease[]>(res)
}

export async function fetchLease(id: number): Promise<Lease> {
  const res = await fetch(`${BASE_URL}/api/leases/${id}`)
  return handleResponse<Lease>(res)
}

export async function createLease(data: LeaseCreate): Promise<Lease> {
  const res = await fetch(`${BASE_URL}/api/leases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<Lease>(res)
}

export async function updateLease(id: number, data: Partial<LeaseCreate>): Promise<Lease> {
  const res = await fetch(`${BASE_URL}/api/leases/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<Lease>(res)
}

export async function deleteLease(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/leases/${id}`, {
    method: 'DELETE',
  })
  return handleResponse<void>(res)
}
