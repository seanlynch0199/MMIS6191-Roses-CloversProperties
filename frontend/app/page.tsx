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
      <section className="relative bg-stone-50 border-b-4 border-clover-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-4">
              {siteConfig.name}
            </h1>
            <p className="text-xl md:text-2xl text-clover-700 font-medium mb-6 max-w-2xl mx-auto">
              {siteConfig.tagline}
            </p>
            <p className="text-lg text-stone-600 mb-8 max-w-xl mx-auto">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/properties"
                className="px-8 py-3 bg-clover-600 text-white font-semibold rounded-lg hover:bg-clover-700 transition-colors shadow-lg"
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
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-stone-200 border-b border-stone-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
                Featured Properties
              </h2>
              <p className="text-stone-600 mt-1">
                Discover our available rentals
              </p>
            </div>
            <Link
              href="/properties"
              className="text-clover-600 hover:underline font-medium"
            >
              View All Properties
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-stone-300 rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-stone-200">
              <p className="text-stone-500">
                No available properties at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 text-center mb-12">
            Why Choose Roses &amp; Clovers?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-clover-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-clover-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">Quality Properties</h3>
              <p className="text-stone-600">
                Every property is carefully maintained and updated to ensure your comfort and satisfaction.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">Personal Touch</h3>
              <p className="text-stone-600">
                We treat every tenant like family, providing responsive service and genuine care.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-wood-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-wood-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">Trusted Service</h3>
              <p className="text-stone-600">
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
