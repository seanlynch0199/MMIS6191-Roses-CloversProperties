'use client'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Callout } from '@/components/Callout'
import { boys5kAllTime } from '@/data/records'

export default function Boys5kTimesPage() {
  const top3 = boys5kAllTime.slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Boys 5K All-Time
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The fastest 5K cross country times ever run by Pine Ridge boys.
      </p>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* 2nd Place */}
        <div className="mt-8">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-t-lg p-4 text-center">
            <div className="text-3xl mb-2">🥈</div>
            <div className="font-bold text-gray-900 dark:text-white">{top3[1]?.name}</div>
            <div className="font-mono font-bold text-prBlue-600 dark:text-prBlue-400">{top3[1]?.time}</div>
            <div className="text-xs text-gray-500">{top3[1]?.year}</div>
          </div>
          <div className="bg-gray-300 dark:bg-gray-600 h-16 rounded-b-lg"></div>
        </div>

        {/* 1st Place */}
        <div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-t-lg p-4 text-center border-2 border-yellow-400">
            <div className="text-3xl mb-2">🥇</div>
            <div className="font-bold text-gray-900 dark:text-white">{top3[0]?.name}</div>
            <div className="font-mono font-bold text-prBlue-600 dark:text-prBlue-400 text-lg">{top3[0]?.time}</div>
            <div className="text-xs text-gray-500">{top3[0]?.year}</div>
          </div>
          <div className="bg-yellow-200 dark:bg-yellow-800/30 h-24 rounded-b-lg"></div>
        </div>

        {/* 3rd Place */}
        <div className="mt-12">
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-t-lg p-4 text-center">
            <div className="text-3xl mb-2">🥉</div>
            <div className="font-bold text-gray-900 dark:text-white">{top3[2]?.name}</div>
            <div className="font-mono font-bold text-prBlue-600 dark:text-prBlue-400">{top3[2]?.time}</div>
            <div className="text-xs text-gray-500">{top3[2]?.year}</div>
          </div>
          <div className="bg-orange-200 dark:bg-orange-800/30 h-12 rounded-b-lg"></div>
        </div>
      </div>

      {/* Full Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Rank</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Athlete</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Year</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Meet</th>
            </tr>
          </thead>
          <tbody>
            {boys5kAllTime.map((runner, index) => (
              <tr
                key={runner.rank}
                className={`border-b border-gray-100 dark:border-gray-800 ${
                  index < 3 ? 'bg-prGreen-50/50 dark:bg-prGreen-900/10' : ''
                }`}
              >
                <td className="py-3 px-4 font-semibold">#{runner.rank}</td>
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{runner.name}</td>
                <td className="py-3 px-4 font-mono font-bold text-prBlue-600 dark:text-prBlue-400">{runner.time}</td>
                <td className="py-3 px-4">{runner.year}</td>
                <td className="py-3 px-4 hidden sm:table-cell text-gray-500">{runner.meet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout title="Records Methodology" variant="neutral">
        All times are from official GHSA-sanctioned meets with electronic chip timing on
        certified 5K courses. Only one performance per athlete is listed (personal best).
        Times are updated within one week of new records being set.
      </Callout>
    </div>
  )
}
