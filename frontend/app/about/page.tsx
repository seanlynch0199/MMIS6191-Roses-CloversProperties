import { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/data/site'

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn more about ${siteConfig.name} and our commitment to quality property management.`,
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-clover-600 to-clover-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
          <p className="text-xl text-clover-100">
            Your trusted partner in finding the perfect home
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 mb-6">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {siteConfig.name} was founded with a simple mission: to provide quality rental properties
              with exceptional service. We believe that finding a home should be a joyful experience,
              not a stressful one.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our team is dedicated to maintaining each property to the highest standards, ensuring
              that every tenant enjoys a comfortable, safe, and welcoming living environment. We take
              pride in our responsive service and genuine care for our community.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6">
              Our Values
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mb-12">
              <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-600">
                <div className="w-12 h-12 bg-clover-100 dark:bg-clover-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-clover-600 dark:text-clover-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Integrity</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We believe in honest, transparent communication and fair dealings with all our tenants.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-600">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Care</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We treat every tenant like family and every property like our own home.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-600">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Responsiveness</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Quick response to maintenance requests and tenant needs is our priority.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-600">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quality</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We maintain high standards for all our properties, ensuring comfort and safety.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6">
              Get In Touch
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Whether you are looking for your next home or have questions about our properties,
              we would love to hear from you. Our team is always ready to help.
            </p>
          </div>

          </div>{/* end white card */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/properties"
              className="px-6 py-3 bg-clover-600 hover:bg-clover-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
