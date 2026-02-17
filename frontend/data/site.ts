import { SiteConfig } from './types'

export const siteConfig: SiteConfig = {
  name: 'Roses & Clovers Properties',
  tagline: 'Find your perfect home',
  description: 'Quality rental properties managed with care. From cozy studios to spacious family homes, we have the perfect place for you.',
  contact: {
    email: 'hello@rosesandclovers.com',
    phone: '(503) 555-0100',
    address: '123 Property Lane, Portland, OR 97201',
  },
}

export const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'studio', label: 'Studio' },
] as const

export const leaseStatuses = [
  { value: 'active', label: 'Active', color: 'clover' },
  { value: 'upcoming', label: 'Upcoming', color: 'blue' },
  { value: 'ended', label: 'Ended', color: 'gray' },
  { value: 'terminated', label: 'Terminated', color: 'rose' },
] as const
