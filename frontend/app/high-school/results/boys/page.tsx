'use client'

import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ResultsTable } from '@/components/ResultsTable'
import { useSeason } from '@/components/SeasonSwitcher'
import { getResultsByTeamLevelAndGender } from '@/data/results'
import { getSeasonName } from '@/lib/utils'

function ResultsContent() {
  const season = useSeason()
  const allResults = getResultsByTeamLevelAndGender('hs', 'boys')
  const results = allResults.filter(r => r.season === season)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Boys {getSeasonName(season)} Results
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Meet results and individual performances for the high school boys team.
        Use the season switcher in the header to toggle between XC and Track seasons.
      </p>

      {results.length > 0 ? (
        <div className="space-y-6">
          {results.map((result) => (
            <ResultsTable key={`${result.meetId}-${result.gender}`} result={result} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No results available for {getSeasonName(season)}.</p>
          <p className="mt-2">Check back after meets are completed.</p>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 no-print">
        <p>Results are updated after each meet. Times are chip times when available.</p>
        <button
          onClick={() => window.print()}
          className="mt-2 text-prBlue-600 dark:text-prBlue-400 hover:underline"
        >
          Print Results
        </button>
      </div>
    </div>
  )
}

export default function BoysResultsPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8">Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  )
}
