'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { fetchProperty } from '@/lib/api'
import { siteConfig } from '@/data/site'

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = use(params)
  const propertyId = parseInt(id, 10)

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => fetchProperty(propertyId),
    enabled: !isNaN(propertyId),
  })

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-200 rounded w-1/4 mb-4" />
            <div className="h-64 bg-stone-200 rounded-xl mb-8" />
            <div className="h-6 bg-stone-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-stone-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">
            Property Not Found
          </h1>
          <p className="text-stone-500 mb-6">
            The property you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/properties"
            className="px-6 py-3 bg-clover-600 hover:bg-clover-700 text-white font-medium rounded-lg transition-colors"
          >
            Browse All Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-stone-500 hover:text-clover-600 transition-colors">
              Home
            </Link>
            <span className="text-stone-400">/</span>
            <Link href="/properties" className="text-stone-500 hover:text-clover-600 transition-colors">
              Properties
            </Link>
            <span className="text-stone-400">/</span>
            <span className="text-stone-900">{property.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              {property.name}
            </h1>
            <p className="text-lg text-stone-600 mb-6">
              {property.addressLine1}
              {property.addressLine2 && `, ${property.addressLine2}`}
              <br />
              {property.city}, {property.state} {property.zip}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 text-center border border-stone-200">
                <div className="text-2xl font-bold text-stone-900">
                  {property.bedrooms === 0 ? 'Studio' : property.bedrooms}
                </div>
                <div className="text-sm text-stone-500">
                  {property.bedrooms === 0 ? '' : property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-stone-200">
                <div className="text-2xl font-bold text-stone-900">
                  {property.bathrooms}
                </div>
                <div className="text-sm text-stone-500">
                  {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                </div>
              </div>
              {property.squareFeet && (
                <div className="bg-white rounded-lg p-4 text-center border border-stone-200">
                  <div className="text-2xl font-bold text-stone-900">
                    {property.squareFeet.toLocaleString()}
                  </div>
                  <div className="text-sm text-stone-500">Sq Ft</div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-stone-900 mb-4">
                  About This Property
                </h2>
                <p className="text-stone-600 whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-stone-900 mb-4">
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-clover-50 text-clover-700 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-stone-200 p-6 sticky top-24 shadow-sm">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-clover-600">
                  {formatCurrency(property.monthlyRent)}
                </div>
                <div className="text-stone-500">per month</div>
              </div>

              {property.depositAmount && (
                <div className="flex justify-between py-3 border-t border-stone-100">
                  <span className="text-stone-600">Deposit Amount</span>
                  <span className="font-medium text-stone-900">
                    {formatCurrency(property.depositAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-3 border-t border-stone-100">
                <span className="text-stone-600">Status</span>
                <span className={`font-medium ${property.available ? 'text-clover-600' : 'text-stone-500'}`}>
                  {property.available ? 'Available' : 'Leased'}
                </span>
              </div>

              {property.available && (
                <Link
                  href="/contact"
                  className="block w-full mt-6 px-6 py-3 bg-clover-600 hover:bg-clover-700 text-white font-semibold rounded-lg text-center transition-colors"
                >
                  Contact Us
                </Link>
              )}

              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="block w-full mt-3 px-6 py-3 border border-stone-300 text-stone-700 font-semibold rounded-lg text-center hover:bg-stone-50 transition-colors"
              >
                Call {siteConfig.contact.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/properties"
            className="inline-flex items-center text-clover-600 hover:underline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Properties
          </Link>
        </div>
      </div>
    </div>
  )
}
