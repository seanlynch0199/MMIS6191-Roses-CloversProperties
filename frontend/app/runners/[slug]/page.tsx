'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Callout } from '@/components/Callout'
import { SeasonProgressChart } from '@/components/SeasonProgressChart'
import { runners, getRunnerBySlug } from '@/data/runners'
import { getGradeSuffix, getEventFocusName, getInitials, getTeamLevelName, copyToClipboard, formatDate } from '@/lib/utils'

export default function RunnerProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const runner = getRunnerBySlug(slug)
  const [copied, setCopied] = useState(false)

  if (!runner) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Runner Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400">
            We couldn&apos;t find a runner with that profile. Check the URL or browse all runners.
          </p>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    const url = window.location.href
    const success = await copyToClipboard(url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const primaryEvent = runner.prs[0]?.event || '5K'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: 'Runners', href: '/runners' },
          { label: `${runner.firstName} ${runner.lastName}` },
        ]}
      />

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
        {/* Photo/Initials */}
        <div className="flex-shrink-0">
          {runner.photo ? (
            <img
              src={runner.photo}
              alt={`${runner.firstName} ${runner.lastName}`}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-prBlue-100 dark:bg-prBlue-900 flex items-center justify-center">
              <span className="text-3xl font-bold text-prBlue-600 dark:text-prBlue-300">
                {getInitials(runner.firstName, runner.lastName)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {runner.firstName} {runner.lastName}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                {getGradeSuffix(runner.grade)} Grade &middot; {getTeamLevelName(runner.teamLevel)}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 text-sm font-medium bg-prBlue-100 dark:bg-prBlue-900 text-prBlue-700 dark:text-prBlue-300 rounded">
                  {getEventFocusName(runner.eventFocus)}
                </span>
                {runner.isCaptain && (
                  <span className="px-2 py-1 text-sm font-medium bg-prGreen-100 dark:bg-prGreen-900 text-prGreen-700 dark:text-prGreen-300 rounded">
                    Team Captain
                  </span>
                )}
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-prGreen-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bio */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{runner.bio}</p>
      </section>

      {/* Personal Records */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Personal Records</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Event</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Meet</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {runner.prs.map((pr, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{pr.event}</td>
                  <td className="py-3 px-4 font-mono font-bold text-prBlue-600 dark:text-prBlue-400">{pr.time}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{pr.meet}</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-500 hidden sm:table-cell">{formatDate(pr.date, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Season Progression Chart */}
      {runner.seasonHistory.length >= 2 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Season Progression ({primaryEvent})
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <SeasonProgressChart results={runner.seasonHistory} event={primaryEvent} />
          </div>
        </section>
      )}

      {/* Notable Meets */}
      {runner.notableMeets.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Notable Achievements</h2>
          <ul className="space-y-2">
            {runner.notableMeets.map((meet, index) => (
              <li key={index} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-prGreen-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{meet}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Season History */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Season History</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Meet</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Event</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Place</th>
              </tr>
            </thead>
            <tbody>
              {[...runner.seasonHistory]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((result, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(result.date, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{result.meetName}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{result.event}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-900 dark:text-white">{result.time}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{result.place}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
