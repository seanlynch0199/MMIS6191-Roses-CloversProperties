import {
  Property,
  PropertyCreate,
  Tenant,
  TenantCreate,
  Lease,
  LeaseCreate,
  MaintenanceRequest,
  Payment,
  ApiError,
} from '@/data/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

// ============================================================================
// AUTH TOKEN HELPERS
// ============================================================================

const TOKEN_KEY = 'rc_token'
const TENANT_TOKEN_KEY = 'rc_tenant_token'

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

export function isLoggedIn(): boolean {
  return !!getToken()
}

export function getTenantToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TENANT_TOKEN_KEY)
}

export function setTenantToken(token: string): void {
  localStorage.setItem(TENANT_TOKEN_KEY, token)
}

export function clearTenantToken(): void {
  localStorage.removeItem(TENANT_TOKEN_KEY)
}

export function isTenantLoggedIn(): boolean {
  return !!getTenantToken()
}

// ============================================================================
// FETCH WRAPPERS
// ============================================================================

/**
 * authFetch — single fetch wrapper for all /api/admin/* requests.
 * - Injects Authorization: Bearer <token> if a token exists.
 * - On 401, clears the token and redirects to /admin/login.
 * - On other errors, throws with the server's error message.
 */
export async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
  })

  if (res.status === 401) {
    clearToken()
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
    throw new Error('Session expired. Please log in again.')
  }

  if (!res.ok) {
    const body: ApiError = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(body.error || `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

/** Plain fetch for public endpoints (no auth header, no 401 redirect). */
async function publicFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    const body: ApiError = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

export async function adminLogin(password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({ error: 'Login failed' }))
    throw new Error(error.error || 'Login failed')
  }
  const data = await res.json()
  setToken(data.token)
  return data.token
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch(`${BASE_URL}/api/admin/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken() || ''}` },
    })
  } finally {
    clearToken()
  }
}

// ============================================================================
// PUBLIC PROPERTIES (no auth required)
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

  const qs = params.toString()
  return publicFetch<Property[]>(`/api/properties${qs ? `?${qs}` : ''}`)
}

export async function fetchProperty(id: number): Promise<Property> {
  return publicFetch<Property>(`/api/properties/${id}`)
}

// ============================================================================
// ADMIN PROPERTIES (auth required — all go through authFetch)
// ============================================================================

export async function fetchAdminProperties(): Promise<Property[]> {
  return authFetch<Property[]>('/api/admin/properties')
}

export async function createProperty(data: PropertyCreate): Promise<Property> {
  return authFetch<Property>('/api/admin/properties', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateProperty(id: number, data: Partial<PropertyCreate>): Promise<Property> {
  return authFetch<Property>(`/api/admin/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteProperty(id: number): Promise<void> {
  return authFetch<void>(`/api/admin/properties/${id}`, { method: 'DELETE' })
}

// ============================================================================
// ADMIN TENANTS (auth required)
// ============================================================================

export async function fetchTenants(): Promise<Tenant[]> {
  return authFetch<Tenant[]>('/api/admin/tenants')
}

export async function fetchTenant(id: number): Promise<Tenant> {
  return authFetch<Tenant>(`/api/admin/tenants/${id}`)
}

export async function createTenant(data: TenantCreate): Promise<Tenant> {
  return authFetch<Tenant>('/api/admin/tenants', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateTenant(id: number, data: Partial<TenantCreate>): Promise<Tenant> {
  return authFetch<Tenant>(`/api/admin/tenants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteTenant(id: number): Promise<void> {
  return authFetch<void>(`/api/admin/tenants/${id}`, { method: 'DELETE' })
}

// ============================================================================
// ADMIN DASHBOARD STATS (auth required)
// ============================================================================

export interface DashboardStats {
  totalProperties: number
  availableProperties: number
  totalTenants: number
  activeLeases: number
  upcomingLeases: number
  /** Total lease count across all statuses */
  totalLeases: number
  /** Sum of monthly_rent for all active leases */
  monthlyRevenue: number
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return authFetch<DashboardStats>('/api/admin/dashboard/stats')
}

// ============================================================================
// ADMIN LEASES (auth required)
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

  const qs = params.toString()
  return authFetch<Lease[]>(`/api/admin/leases${qs ? `?${qs}` : ''}`)
}

export async function fetchLease(id: number): Promise<Lease> {
  return authFetch<Lease>(`/api/admin/leases/${id}`)
}

export async function createLease(data: LeaseCreate): Promise<Lease> {
  return authFetch<Lease>('/api/admin/leases', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateLease(id: number, data: Partial<LeaseCreate>): Promise<Lease> {
  return authFetch<Lease>(`/api/admin/leases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteLease(id: number): Promise<void> {
  return authFetch<void>(`/api/admin/leases/${id}`, { method: 'DELETE' })
}

// ============================================================================
// TENANT FETCH WRAPPER
// ============================================================================

export async function tenantFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getTenantToken()
  const headers: Record<string, string> = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
  })

  if (res.status === 401) {
    clearTenantToken()
    if (typeof window !== 'undefined') {
      window.location.href = '/tenant/login'
    }
    throw new Error('Session expired. Please log in again.')
  }

  if (!res.ok) {
    const body: ApiError = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(body.error || `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

// ============================================================================
// TENANT AUTH
// ============================================================================

export async function tenantLogin(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/tenant/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({ error: 'Login failed' }))
    throw new Error(error.error || 'Login failed')
  }
  const data = await res.json()
  setTenantToken(data.token)
  return data.token
}

export async function tenantLogout(): Promise<void> {
  try {
    await fetch(`${BASE_URL}/api/tenant/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getTenantToken() || ''}` },
    })
  } finally {
    clearTenantToken()
  }
}

// ============================================================================
// TENANT PORTAL ENDPOINTS
// ============================================================================

export async function fetchMyLease(): Promise<Lease | null> {
  return tenantFetch<Lease | null>('/api/tenant/lease')
}

export async function fetchMyRequests(): Promise<MaintenanceRequest[]> {
  return tenantFetch<MaintenanceRequest[]>('/api/tenant/requests')
}

export async function submitRequest(data: {
  title: string
  description: string
  category: string
  priority: string
}): Promise<MaintenanceRequest> {
  return tenantFetch<MaintenanceRequest>('/api/tenant/requests', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function fetchMyPayments(): Promise<Payment[]> {
  return tenantFetch<Payment[]>('/api/tenant/payments')
}

// ============================================================================
// ADMIN MAINTENANCE REQUESTS
// ============================================================================

export interface RequestFilters {
  status?: string
  propertyId?: number
  tenantId?: number
}

export async function fetchAdminRequests(filters?: RequestFilters): Promise<MaintenanceRequest[]> {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.propertyId) params.set('propertyId', String(filters.propertyId))
  if (filters?.tenantId) params.set('tenantId', String(filters.tenantId))
  const qs = params.toString()
  return authFetch<MaintenanceRequest[]>(`/api/admin/requests${qs ? `?${qs}` : ''}`)
}

export async function updateAdminRequest(
  id: number,
  data: { status: string; adminNotes?: string | null }
): Promise<MaintenanceRequest> {
  return authFetch<MaintenanceRequest>(`/api/admin/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ============================================================================
// ADMIN PAYMENTS
// ============================================================================

export interface PaymentFilters {
  tenantId?: number
  leaseId?: number
  status?: string
  type?: string
}

export async function fetchAdminPayments(filters?: PaymentFilters): Promise<Payment[]> {
  const params = new URLSearchParams()
  if (filters?.tenantId) params.set('tenantId', String(filters.tenantId))
  if (filters?.leaseId) params.set('leaseId', String(filters.leaseId))
  if (filters?.status) params.set('status', filters.status)
  if (filters?.type) params.set('type', filters.type)
  const qs = params.toString()
  return authFetch<Payment[]>(`/api/admin/payments${qs ? `?${qs}` : ''}`)
}

export async function createPayment(data: {
  leaseId: number
  amount: number
  paymentDate: string
  paymentType?: string
  status?: string
  notes?: string
}): Promise<Payment> {
  return authFetch<Payment>('/api/admin/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updatePayment(id: number, data: Partial<Payment>): Promise<Payment> {
  return authFetch<Payment>(`/api/admin/payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deletePayment(id: number): Promise<void> {
  return authFetch<void>(`/api/admin/payments/${id}`, { method: 'DELETE' })
}
