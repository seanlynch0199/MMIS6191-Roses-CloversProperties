'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DarkModeToggle } from './DarkModeToggle'
import { cn } from '@/lib/utils'

const navigation = [
  { label: 'Properties', href: '/properties' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

// Logo SVG component - clover leaf + rose petal combined
function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Clover leaves */}
      <circle cx="14" cy="12" r="6" className="fill-clover-500" />
      <circle cx="26" cy="12" r="6" className="fill-clover-500" />
      <circle cx="20" cy="6" r="6" className="fill-clover-500" />
      {/* Stem */}
      <path
        d="M20 18 L20 36"
        className="stroke-clover-600"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Rose petal accent */}
      <circle cx="30" cy="28" r="5" className="fill-rose-500" />
      <circle cx="34" cy="24" r="3" className="fill-rose-400" />
    </svg>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Don't show header on admin pages (they have their own)
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-10 h-10" />
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                Roses & Clovers
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Properties
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === item.href
                    ? 'text-clover-600 dark:text-clover-400 bg-clover-50 dark:bg-clover-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-clover-600 dark:hover:text-clover-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="ml-2 px-4 py-2 text-sm font-medium text-white bg-clover-600 hover:bg-clover-700 rounded-md transition-colors"
            >
              Admin Login
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            <DarkModeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
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
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === item.href
                    ? 'text-clover-600 dark:text-clover-400 bg-clover-50 dark:bg-clover-900/20'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block mt-2 mx-4 px-4 py-2 text-sm font-medium text-center text-white bg-clover-600 hover:bg-clover-700 rounded-md transition-colors"
            >
              Admin Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
