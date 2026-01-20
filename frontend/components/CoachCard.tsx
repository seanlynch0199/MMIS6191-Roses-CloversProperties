import { Coach } from '@/data/types'
import { cn, getInitials } from '@/lib/utils'

interface CoachCardProps {
  coach: Coach
  className?: string
}

export function CoachCard({ coach, className }: CoachCardProps) {
  const nameParts = coach.name.replace('Coach ', '').split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ')

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6', className)}>
      <div className="flex items-start gap-4">
        {/* Photo or Initials */}
        <div className="flex-shrink-0">
          {coach.photo ? (
            <img
              src={coach.photo}
              alt={coach.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-prBlue-100 dark:bg-prBlue-900 flex items-center justify-center">
              <span className="text-2xl font-bold text-prBlue-600 dark:text-prBlue-300">
                {getInitials(firstName, lastName)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{coach.name}</h3>
          <p className="text-sm text-prBlue-600 dark:text-prBlue-400">{coach.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {coach.yearsCoaching} years coaching
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{coach.bio}</p>

      {/* Specialties */}
      <div className="mt-4 flex flex-wrap gap-2">
        {coach.specialties.map((specialty) => (
          <span
            key={specialty}
            className="px-2 py-1 text-xs font-medium bg-prGreen-100 dark:bg-prGreen-900/30 text-prGreen-700 dark:text-prGreen-300 rounded-full"
          >
            {specialty}
          </span>
        ))}
      </div>

      {coach.email && (
        <a
          href={`mailto:${coach.email}`}
          className="mt-4 inline-flex items-center gap-1 text-sm text-prBlue-600 dark:text-prBlue-400 hover:underline"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {coach.email}
        </a>
      )}
    </div>
  )
}
