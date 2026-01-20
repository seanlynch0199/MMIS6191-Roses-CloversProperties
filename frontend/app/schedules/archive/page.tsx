import { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { schedules, getArchivedSeasons } from '@/data/schedules'
import { getSeasonName } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Schedule Archive',
  description: 'Archive of past cross country and track schedules for Pine Ridge Running Club.',
}

export default function ScheduleArchivePage() {
  const allSeasons = schedules.map(s => ({ season: s.season, year: s.year }))
    .sort((a, b) => b.year - a.year || a.season.localeCompare(b.season))

  // Group by year
  const seasonsByYear = allSeasons.reduce((acc, s) => {
    if (!acc[s.year]) acc[s.year] = []
    acc[s.year].push(s)
    return acc
  }, {} as Record<number, typeof allSeasons>)

  const years = Object.keys(seasonsByYear).map(Number).sort((a, b) => b - a)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Schedule Archive
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Browse past season schedules. Select a season to view the full meet list.
      </p>

      <div className="space-y-8">
        {years.map(year => (
          <div key={year}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{year}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {seasonsByYear[year].map(({ season }) => {
                const schedule = schedules.find(s => s.season === season && s.year === year)
                return (
                  <Link
                    key={`${year}-${season}`}
                    href={`/schedules?season=${season}`}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {getSeasonName(season)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {schedule?.meets.length || 0} meets
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        season === 'xc'
                          ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      }`}>
                        {season.toUpperCase()}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
