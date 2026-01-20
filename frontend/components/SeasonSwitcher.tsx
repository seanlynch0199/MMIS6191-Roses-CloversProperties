'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Season } from '@/data/types'
import { cn, getSeasonFromUrlOrStorage, saveSeasonToStorage } from '@/lib/utils'

interface SeasonSwitcherProps {
  className?: string
  showOnPaths?: string[]
}

export function SeasonSwitcher({ className, showOnPaths }: SeasonSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [season, setSeason] = useState<Season>('xc')
  const [mounted, setMounted] = useState(false)

  // Determine if switcher should show based on current path
  const shouldShow = !showOnPaths || showOnPaths.some(path => pathname.startsWith(path))

  useEffect(() => {
    setMounted(true)
    const currentSeason = getSeasonFromUrlOrStorage(searchParams)
    setSeason(currentSeason)
  }, [searchParams])

  const handleSeasonChange = (newSeason: Season) => {
    setSeason(newSeason)
    saveSeasonToStorage(newSeason)

    // Update URL with new season
    const params = new URLSearchParams(searchParams.toString())
    params.set('season', newSeason)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  if (!shouldShow || !mounted) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg', className)}>
      <button
        onClick={() => handleSeasonChange('xc')}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
          season === 'xc'
            ? 'bg-prBlue-500 text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        )}
      >
        XC
      </button>
      <button
        onClick={() => handleSeasonChange('track')}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
          season === 'track'
            ? 'bg-prBlue-500 text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        )}
      >
        Track
      </button>
    </div>
  )
}

// Hook for components to get current season
export function useSeason(): Season {
  const searchParams = useSearchParams()
  const [season, setSeason] = useState<Season>('xc')

  useEffect(() => {
    const currentSeason = getSeasonFromUrlOrStorage(searchParams)
    setSeason(currentSeason)
  }, [searchParams])

  return season
}
