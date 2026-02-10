'use client'

import Link from 'next/link'

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/properties"
          className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Properties
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage rental properties, availability, and pricing.
          </p>
        </Link>

        <Link
          href="/admin/tenants"
          className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Tenants
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View and manage tenant information and contacts.
          </p>
        </Link>

        <Link
          href="/admin/leases"
          className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Leases
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create and track lease agreements between properties and tenants.
          </p>
        </Link>
      </div>
    </div>
  )
}
