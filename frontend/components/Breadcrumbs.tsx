'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbs = items || generateBreadcrumbs(pathname)

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <Link href="/" className="hover:text-prBlue-500 dark:hover:text-prBlue-300">
            Home
          </Link>
        </li>
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {item.href && index < breadcrumbs.length - 1 ? (
              <Link href={item.href} className="hover:text-prBlue-500 dark:hover:text-prBlue-300">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    const label = formatSegment(segment)
    breadcrumbs.push({ label, href: currentPath })
  }

  return breadcrumbs
}

function formatSegment(segment: string): string {
  // Handle special cases
  const specialCases: Record<string, string> = {
    'high-school': 'High School',
    'middle-school': 'Middle School',
    'top-hounds': 'Top Hounds',
    'home-meet': 'Home Meet',
    'boys-5k-times': 'Boys 5K Times',
    'girls-5k-times': 'Girls 5K Times',
    '4x800-records': '4x800 Records',
    'grinder-records': 'Grinder Records',
    'overall-rankings': 'Overall Rankings',
    'state-course-all-time': 'State Course All-Time',
  }

  if (specialCases[segment]) {
    return specialCases[segment]
  }

  // Default: capitalize each word
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
