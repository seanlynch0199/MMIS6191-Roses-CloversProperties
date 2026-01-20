import Link from 'next/link'
import { MeetResult } from '@/data/types'
import { cn, formatDate } from '@/lib/utils'

interface ResultsTableProps {
  result: MeetResult
  showLinks?: boolean
}

export function ResultsTable({ result, showLinks = true }: ResultsTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden print-full-width">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h3 className="font-semibold text-gray-900 dark:text-white">{result.meetName}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(result.date)}</p>
        {result.teamPlace && (
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Team Place: <span className="font-semibold text-gray-900 dark:text-white">{result.teamPlace}</span>
            </span>
            {result.teamScore && (
              <span className="text-gray-600 dark:text-gray-400">
                Score: <span className="font-semibold text-gray-900 dark:text-white">{result.teamScore}</span>
              </span>
            )}
            {result.top5Average && (
              <span className="text-gray-600 dark:text-gray-400">
                Top 5 Avg: <span className="font-semibold text-gray-900 dark:text-white">{result.top5Average}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-white dark:bg-gray-800">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Place</th>
              <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Name</th>
              <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Grade</th>
              <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
            </tr>
          </thead>
          <tbody>
            {result.individualResults.map((runner, index) => (
              <tr
                key={runner.runnerId}
                className={cn(
                  'border-b border-gray-100 dark:border-gray-700/50',
                  index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'
                )}
              >
                <td className="py-2 px-4 text-sm text-gray-600 dark:text-gray-400">{runner.place}</td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    {showLinks ? (
                      <Link
                        href={`/runners/${runner.runnerId.replace(/^(hs|ms)-(b|g)-\d+$/, (match) => {
                          // Try to construct slug from ID pattern
                          return match
                        })}`}
                        className="font-medium text-prBlue-600 dark:text-prBlue-400 hover:underline"
                      >
                        {runner.runnerName}
                      </Link>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">{runner.runnerName}</span>
                    )}
                    {runner.pr && (
                      <span className="px-1.5 py-0.5 text-xs font-bold bg-prGreen-100 dark:bg-prGreen-900 text-prGreen-700 dark:text-prGreen-300 rounded">
                        PR
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-4 text-sm text-gray-600 dark:text-gray-400">{runner.grade}</td>
                <td className="py-2 px-4 font-mono text-sm font-semibold text-gray-900 dark:text-white">{runner.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
