'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/properties', label: 'Properties' },
  { href: '/admin/tenants', label: 'Tenants' },
  { href: '/admin/leases', label: 'Leases' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  function isActive(item: { href: string; exact?: boolean }) {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
                  <circle cx="14" cy="12" r="6" className="fill-clover-500" />
                  <circle cx="26" cy="12" r="6" className="fill-clover-500" />
                  <circle cx="20" cy="6" r="6" className="fill-clover-500" />
                  <path d="M20 18 L20 36" className="stroke-clover-600" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="30" cy="28" r="5" className="fill-rose-500" />
                  <circle cx="34" cy="24" r="3" className="fill-rose-400" />
                </svg>
                <span className="font-bold text-gray-900 dark:text-white hidden sm:block">
                  Admin Portal
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item)
                        ? 'text-clover-600 dark:text-clover-400 bg-clover-50 dark:bg-clover-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-clover-600 dark:hover:text-clover-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-clover-600 dark:hover:text-clover-400"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto px-4 py-2 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                isActive(item)
                  ? 'text-clover-600 dark:text-clover-400 bg-clover-50 dark:bg-clover-900/20'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
