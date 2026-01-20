'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ScheduleTable } from '@/components/ScheduleTable'
import { useSeason } from '@/components/SeasonSwitcher'
import { schedules, getCurrentSeasonSchedule } from '@/data/schedules'
import { getSeasonName } from '@/lib/utils'

function ScheduleContent() {
  const season = useSeason()
  const currentYear = new Date().getFullYear()

  // Try current year first, then next year
  let schedule = schedules.find(s => s.season === season && s.year === currentYear)
  if (!schedule) {
    schedule = schedules.find(s => s.season === season && s.year === currentYear + 1)
  }
  if (!schedule) {
    schedule = schedules.find(s => s.season === season)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          {getSeasonName(season)} Schedule
        </h1>
        <Link
          href="/schedules/archive"
          className="text-sm text-prBlue-600 dark:text-prBlue-400 hover:underline"
        >
          View Archive
        </Link>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {season === 'xc'
          ? 'Cross Country season runs from August through November. Our runners compete in 5K races (3.1 miles) for high school and 2-mile races for middle school.'
          : 'Track & Field season runs from January through May. Events include the 800m, 1600m, 3200m, and relay events.'}
      </p>

      {schedule ? (
        <>
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {schedule.year} Season &middot; {schedule.meets.length} meets scheduled
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <ScheduleTable meets={schedule.meets} />
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No schedule available for {getSeasonName(season)} {currentYear}.</p>
          <p className="mt-2">Check back soon or view the archive for past seasons.</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium text-gray-900 dark:text-white mb-2">Schedule Notes</p>
        <ul className="list-disc list-inside space-y-1">
          <li>All times are tentative and subject to change</li>
          <li>Check with coaches for bus departure times (typically 2 hours before race time)</li>
          <li>Home meets are highlighted - volunteers needed!</li>
          <li>Click on any meet for additional details and directions</li>
        </ul>
      </div>
    </div>
  )
}

export default function SchedulesPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8">Loading schedule...</div>}>
      <ScheduleContent />
    </Suspense>
  )
}
