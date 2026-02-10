import Link from 'next/link'
import { Property } from '@/data/types'

interface PropertyCardProps {
  property: Property
  showStatus?: boolean
}

export function PropertyCard({ property, showStatus = true }: PropertyCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPropertyType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all hover:border-clover-300 dark:hover:border-clover-600"
    >
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        {showStatus && (
          <div className="absolute top-3 right-3">
            {property.available ? (
              <span className="px-2 py-1 text-xs font-medium bg-clover-500 text-white rounded-full">
                Available
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium bg-gray-500 text-white rounded-full">
                Leased
              </span>
            )}
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 text-xs font-medium bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 rounded-full">
            {formatPropertyType(property.propertyType)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-clover-600 dark:group-hover:text-clover-400 transition-colors">
          {property.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {property.addressLine1}, {property.city}
        </p>

        {/* Features */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            {property.bathrooms} bath
          </span>
          {property.squareFeet && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {property.squareFeet.toLocaleString()} sqft
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-bold text-clover-600 dark:text-clover-400">
            {formatCurrency(property.monthlyRent)}
          </span>
          <span className="text-gray-500 dark:text-gray-400">/month</span>
        </div>
      </div>
    </Link>
  )
}
