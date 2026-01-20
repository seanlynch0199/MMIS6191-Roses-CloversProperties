'use client'

import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ResultsTable } from '@/components/ResultsTable'
import { useSeason } from '@/components/SeasonSwitcher'
import { getResultsByTeamLevelAndGender } from '@/data/results'
import { getSeasonName } from '@/lib/utils'

function ResultsContent() {
  const season = useSeason()
  const allResults = getResultsByTeamLevelAndGender('ms', 'girls')
  const results = allResults.filter(r => r.season === season)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        MS Girls {getSeasonName(season)} Results
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Meet results and individual performances for the middle school girls team.
        MS cross country races are 2 miles.
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
    </div>
  )
}

export default function MSGirlsResultsPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8">Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  )
}
