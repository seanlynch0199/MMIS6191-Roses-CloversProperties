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
  monthlyRent: number
  depositAmount?: number | null
  available: boolean
  availableDate?: string | null
  description?: string | null
  amenities?: string[]
  imageUrl?: string | null
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
  monthlyRent: number
  depositAmount?: number | null
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
  depositAmount?: number | null
  status: LeaseStatus
  paymentDueDay?: number
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
  depositAmount?: number | null
  status?: LeaseStatus
}

// Maintenance request types
export type MaintenanceCategory = 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'pest_control' | 'landscaping' | 'other'
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent'
export type MaintenanceStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface MaintenanceRequest {
  id: number
  tenantId: number
  propertyId: number
  title: string
  description: string
  category: MaintenanceCategory
  priority: MaintenancePriority
  status: MaintenanceStatus
  adminNotes?: string | null
  createdAt?: string
  updatedAt?: string
  tenantName?: string
  propertyName?: string
}

// Payment types
export type PaymentType = 'rent' | 'deposit' | 'late_fee' | 'other'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Payment {
  id: number
  leaseId: number
  tenantId: number
  propertyId: number
  amount: number
  paymentDate: string
  paymentType: PaymentType
  status: PaymentStatus
  notes?: string | null
  createdAt?: string
  updatedAt?: string
  tenantName?: string
  propertyName?: string
}

// API Response types
export interface ApiError {
  error: string
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
