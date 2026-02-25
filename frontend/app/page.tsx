'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { siteConfig } from '@/data/site'
import { fetchProperties } from '@/lib/api'
import { PropertyCard } from '@/components/PropertyCard'

export default function HomePage() {
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', { available: true }],
    queryFn: () => fetchProperties({ available: true }),
  })

  const featuredProperties = properties?.slice(0, 3) || []

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-clover-600 to-clover-800 hero-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {siteConfig.name}
            </h1>
            <p className="text-xl md:text-2xl text-clover-100 mb-8 max-w-2xl mx-auto">
              {siteConfig.tagline}
            </p>
            <p className="text-lg text-clover-200 mb-8 max-w-xl mx-auto">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/properties"
                className="px-8 py-3 bg-white text-clover-700 font-semibold rounded-lg hover:bg-clover-50 transition-colors shadow-lg"
              >
                Browse Properties
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-white dark:fill-slate-900"
            />
          </svg>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Featured Properties
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover our available rentals
              </p>
            </div>
            <Link
              href="/properties"
              className="text-clover-600 dark:text-clover-400 hover:underline font-medium"
            >
              View All Properties
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-gray-500 dark:text-gray-400">
                No available properties at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Why Choose Roses & Clovers?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-clover-100 dark:bg-clover-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-clover-600 dark:text-clover-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quality Properties</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every property is carefully maintained and updated to ensure your comfort and satisfaction.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Personal Touch</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We treat every tenant like family, providing responsive service and genuine care.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Trusted Service</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Transparent policies, fair pricing, and honest communication you can count on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-rose-500 to-rose-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Find Your New Home?
          </h2>
          <p className="text-rose-100 mb-8 max-w-2xl mx-auto">
            Browse our available properties or get in touch with us to discuss your housing needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/properties"
              className="px-8 py-3 bg-white text-rose-600 font-semibold rounded-lg hover:bg-rose-50 transition-colors"
            >
              View Properties
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
