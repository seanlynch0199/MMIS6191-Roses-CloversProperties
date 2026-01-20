'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation } from '@/data/site'
import { DarkModeToggle } from './DarkModeToggle'
import { SeasonSwitcher } from './SeasonSwitcher'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const seasonPaths = ['/schedules', '/high-school/results', '/middle-school/results', '/top-hounds']

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-prBlue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-prBlue-500 dark:text-prBlue-300 hidden sm:block">
              Pine Ridge RC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        'px-3 py-2 text-sm font-medium rounded-md flex items-center gap-1 transition-colors',
                        pathname.startsWith(item.href)
                          ? 'text-prBlue-500 dark:text-prBlue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:text-prBlue-500 dark:hover:text-prBlue-300'
                      )}
                    >
                      {item.label}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'block px-4 py-2 text-sm transition-colors',
                              pathname === child.href
                                ? 'text-prBlue-500 dark:text-prBlue-300 bg-gray-50 dark:bg-gray-700'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      pathname === item.href
                        ? 'text-prBlue-500 dark:text-prBlue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-prBlue-500 dark:hover:text-prBlue-300'
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            <SeasonSwitcher showOnPaths={seasonPaths} />
            <DarkModeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            {navigation.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div>
                    <div className="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {item.label}
                    </div>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'block px-6 py-2 text-sm transition-colors',
                          pathname === child.href
                            ? 'text-prBlue-500 dark:text-prBlue-300 bg-gray-50 dark:bg-gray-800'
                            : 'text-gray-700 dark:text-gray-300'
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block px-3 py-2 text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'text-prBlue-500 dark:text-prBlue-300'
                        : 'text-gray-700 dark:text-gray-300'
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
