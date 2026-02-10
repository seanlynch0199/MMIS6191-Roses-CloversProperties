// Property types
export type PropertyType = 'apartment' | 'house' | 'duplex' | 'condo' | 'townhouse' | 'studio'

export interface Property {
  id: number
  name: string
  addressLine1: string
  addressLine2?: string | null
  city: string
  state: string
  zip: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  squareFeet?: number | null
  yearBuilt?: number | null
  monthlyRent: number
  securityDeposit?: number | null
  available: boolean
  description?: string | null
  amenities?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface PropertyCreate {
  name: string
  addressLine1: string
  addressLine2?: string | null
  city: string
  state: string
  zip: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  squareFeet?: number | null
  yearBuilt?: number | null
  monthlyRent: number
  securityDeposit?: number | null
  available: boolean
  description?: string | null
  amenities?: string[]
}

// Tenant types
export interface Tenant {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface TenantCreate {
  firstName: string
  lastName: string
  email: string
  phone?: string | null
}

// Lease types
export type LeaseStatus = 'upcoming' | 'active' | 'ended' | 'terminated'

export interface Lease {
  id: number
  propertyId: number
  tenantId: number
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit?: number | null
  status: LeaseStatus
  createdAt?: string
  updatedAt?: string
  // Joined fields for display
  propertyName?: string
  tenantName?: string
}

export interface LeaseCreate {
  propertyId: number
  tenantId: number
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit?: number | null
  status?: LeaseStatus
}

// Dashboard stats
export interface DashboardStats {
  totalProperties: number
  availableProperties: number
  totalTenants: number
  activeLeases: number
  upcomingLeases?: number
  monthlyRevenue?: number
}

// API Response types
export interface ApiError {
  error: string
}

export interface LoginResponse {
  token: string
}

// Site configuration
export interface SiteConfig {
  name: string
  tagline: string
  description: string
  contact: {
    email: string
    phone: string
    address: string
  }
}
