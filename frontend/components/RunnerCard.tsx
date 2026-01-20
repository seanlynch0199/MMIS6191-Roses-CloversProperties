import Link from 'next/link'
import { Runner } from '@/data/types'
import { cn, getGradeSuffix, getEventFocusName, getInitials } from '@/lib/utils'

interface RunnerCardProps {
  runner: Runner
  className?: string
}

export function RunnerCard({ runner, className }: RunnerCardProps) {
  const bestPR = runner.prs[0]

  return (
    <Link
      href={`/runners/${runner.slug}`}
      className={cn(
        'block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Photo or Initials */}
        <div className="flex-shrink-0">
          {runner.photo ? (
            <img
              src={runner.photo}
              alt={`${runner.firstName} ${runner.lastName}`}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-prBlue-100 dark:bg-prBlue-900 flex items-center justify-center">
              <span className="text-lg font-bold text-prBlue-600 dark:text-prBlue-300">
                {getInitials(runner.firstName, runner.lastName)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {runner.firstName} {runner.lastName}
            </h3>
            {runner.isCaptain && (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-prGreen-100 dark:bg-prGreen-900 text-prGreen-700 dark:text-prGreen-300 rounded-full">
                Captain
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {getGradeSuffix(runner.grade)} Grade &middot; {getEventFocusName(runner.eventFocus)}
          </p>
          {bestPR && (
            <p className="text-sm mt-2">
              <span className="text-gray-500 dark:text-gray-400">Best {bestPR.event}:</span>{' '}
              <span className="font-semibold text-prBlue-600 dark:text-prBlue-400">{bestPR.time}</span>
            </p>
          )}
        </div>

        {/* Arrow */}
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
