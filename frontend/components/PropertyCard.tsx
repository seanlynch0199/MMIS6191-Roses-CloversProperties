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
      className="group block bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all hover:border-clover-300"
    >
      {/* Content */}
      <div className="p-5">
        {/* Top row: name + status badge */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-stone-900 group-hover:text-clover-600 transition-colors">
            {property.name}
          </h3>
          {showStatus && (
            property.available ? (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-clover-100 text-clover-700 rounded-full">
                Available
              </span>
            ) : (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-stone-100 text-stone-600 rounded-full">
                Leased
              </span>
            )
          )}
        </div>
        <p className="text-xs font-medium text-wood-600 mb-1 uppercase tracking-wide">
          {formatPropertyType(property.propertyType)}
        </p>
        <p className="text-sm text-stone-500 mt-1">
          {property.addressLine1}, {property.city}
        </p>

        {/* Features */}
        <div className="flex items-center gap-4 mt-3 text-sm text-stone-600">
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
        <div className="mt-4 pt-4 border-t border-stone-100">
          <span className="text-2xl font-bold text-clover-600">
            {formatCurrency(property.monthlyRent)}
          </span>
          <span className="text-stone-500">/month</span>
        </div>
      </div>
    </Link>
  )
}
