'use client'

import { useState } from 'react'
import { Meet } from '@/data/types'
import { cn, formatDate, isFutureDate } from '@/lib/utils'

interface ScheduleTableProps {
  meets: Meet[]
  showTeamLevels?: boolean
}

export function ScheduleTable({ meets, showTeamLevels = true }: ScheduleTableProps) {
  const [expandedMeet, setExpandedMeet] = useState<string | null>(null)

  if (meets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No meets scheduled for this season.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Meet</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white hidden sm:table-cell">Location</th>
            {showTeamLevels && (
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white hidden md:table-cell">Teams</th>
            )}
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {meets.map((meet) => {
            const isUpcoming = isFutureDate(meet.date)
            const isExpanded = expandedMeet === meet.id

            return (
              <tr
                key={meet.id}
                className={cn(
                  'border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50',
                  isUpcoming && 'bg-prGreen-50/50 dark:bg-prGreen-900/10'
                )}
                onClick={() => setExpandedMeet(isExpanded ? null : meet.id)}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {isUpcoming && (
                      <span className="w-2 h-2 bg-prGreen-500 rounded-full" title="Upcoming"></span>
                    )}
                    {meet.isHomeMeet && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-prBlue-100 dark:bg-prBlue-900 text-prBlue-700 dark:text-prBlue-300 rounded">
                        HOME
                      </span>
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {formatDate(meet.date, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900 dark:text-white">{meet.name}</span>
                </td>
                <td className="py-3 px-4 hidden sm:table-cell">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{meet.location}</span>
                </td>
                {showTeamLevels && (
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex gap-1">
                      {meet.teamLevels.map((level) => (
                        <span
                          key={level}
                          className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                        >
                          {level.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                )}
                <td className="py-3 px-4">
                  <svg
                    className={cn('w-5 h-5 text-gray-400 transition-transform', isExpanded && 'rotate-180')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Expanded details */}
      {expandedMeet && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700">
          {meets.filter(m => m.id === expandedMeet).map((meet) => (
            <div key={meet.id} className="space-y-2">
              {meet.address && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Address:</span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">{meet.address}</span>
                </p>
              )}
              {meet.notes && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Notes:</span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">{meet.notes}</span>
                </p>
              )}
              {meet.externalUrl && (
                <a
                  href={meet.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-prBlue-600 dark:text-prBlue-400 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Results
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
