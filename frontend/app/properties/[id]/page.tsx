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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4" />
            <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-xl mb-8" />
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Property Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-slate-500 dark:text-slate-400 hover:text-clover-600 dark:hover:text-clover-400">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/properties" className="text-slate-500 dark:text-slate-400 hover:text-clover-600 dark:hover:text-clover-400">
              Properties
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white">{property.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Placeholder */}
        <div className="relative h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl mb-8 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div className="absolute top-4 right-4">
            {property.available ? (
              <span className="px-3 py-1 text-sm font-medium bg-clover-500 text-white rounded-full">
                Available
              </span>
            ) : (
              <span className="px-3 py-1 text-sm font-medium bg-gray-500 text-white rounded-full">
                Leased
              </span>
            )}
          </div>
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 text-sm font-medium bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 rounded-full">
              {formatPropertyType(property.propertyType)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {property.name}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              {property.addressLine1}
              {property.addressLine2 && `, ${property.addressLine2}`}
              <br />
              {property.city}, {property.state} {property.zip}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center border border-slate-200 dark:border-slate-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {property.bedrooms === 0 ? 'Studio' : property.bedrooms}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {property.bedrooms === 0 ? '' : property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center border border-slate-200 dark:border-slate-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {property.bathrooms}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                </div>
              </div>
              {property.squareFeet && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {property.squareFeet.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Sq Ft</div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About This Property
                </h2>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-clover-50 dark:bg-clover-900/30 text-clover-700 dark:text-clover-300 rounded-full text-sm"
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
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sticky top-24 shadow-sm">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-clover-600 dark:text-clover-400">
                  {formatCurrency(property.monthlyRent)}
                </div>
                <div className="text-slate-500 dark:text-slate-400">per month</div>
              </div>

              {property.depositAmount && (
                <div className="flex justify-between py-3 border-t border-gray-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Deposit Amount</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(property.depositAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-3 border-t border-gray-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Status</span>
                <span className={`font-medium ${property.available ? 'text-clover-600 dark:text-clover-400' : 'text-gray-500'}`}>
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
                className="block w-full mt-3 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
            className="inline-flex items-center text-clover-600 dark:text-clover-400 hover:underline"
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
