import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CoachCard } from '@/components/CoachCard'
import { getCoachesByTeamLevel } from '@/data/coaches'

export const metadata: Metadata = {
  title: 'Middle School Coaches',
  description: 'Meet the coaching staff of Pine Ridge Middle School Cross Country and Track programs.',
}

export default function MiddleSchoolCoachesPage() {
  const coaches = getCoachesByTeamLevel('ms')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Middle School Coaches
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Our middle school coaching staff specializes in working with young athletes.
        They create a positive, encouraging environment where runners can develop
        their skills while having fun.
      </p>

      <div className="space-y-6">
        {coaches.map((coach) => (
          <CoachCard key={coach.id} coach={coach} />
        ))}
      </div>
    </div>
  )
}
