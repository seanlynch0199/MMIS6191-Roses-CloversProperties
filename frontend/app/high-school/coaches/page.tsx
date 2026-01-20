import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CoachCard } from '@/components/CoachCard'
import { getCoachesByTeamLevel } from '@/data/coaches'

export const metadata: Metadata = {
  title: 'High School Coaches',
  description: 'Meet the coaching staff of Pine Ridge High School Cross Country and Track programs.',
}

export default function HighSchoolCoachesPage() {
  const coaches = getCoachesByTeamLevel('hs')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        High School Coaches
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Our dedicated coaching staff brings years of experience and a passion for developing
        young runners. Each coach plays a vital role in building our program&apos;s culture of
        excellence and sportsmanship.
      </p>

      <div className="space-y-6">
        {coaches.map((coach) => (
          <CoachCard key={coach.id} coach={coach} />
        ))}
      </div>
    </div>
  )
}
