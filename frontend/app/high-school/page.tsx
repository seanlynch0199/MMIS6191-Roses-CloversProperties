import { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { StatCard } from '@/components/StatCard'
import { runners } from '@/data/runners'
import { getCoachesByTeamLevel } from '@/data/coaches'

export const metadata: Metadata = {
  title: 'High School Program',
  description: 'Pine Ridge High School Cross Country and Track program overview, coaches, and results.',
}

export default function HighSchoolPage() {
  const hsRunners = runners.filter(r => r.teamLevel === 'hs')
  const hsBoys = hsRunners.filter(r => r.gender === 'boys')
  const hsGirls = hsRunners.filter(r => r.gender === 'girls')
  const captains = hsRunners.filter(r => r.isCaptain)
  const coaches = getCoachesByTeamLevel('hs')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        High School Program
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
        The Pine Ridge Timberwolves high school program competes in Georgia GHSA Class AAAA.
        Our varsity runners compete in 5K cross country races and track events ranging from
        the 800m to the 3200m, plus relay events.
      </p>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard label="Boys Team" value={hsBoys.length} description="athletes" />
        <StatCard label="Girls Team" value={hsGirls.length} description="athletes" />
        <StatCard label="Coaches" value={coaches.length} description="on staff" />
        <StatCard label="Captains" value={captains.length} description="leaders" variant="accent" />
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Link
          href="/high-school/coaches"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Meet the Coaches</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Learn about our experienced coaching staff dedicated to developing runners.
          </p>
        </Link>

        <Link
          href="/high-school/results/boys"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Boys Results</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View meet results, team scores, and individual performances.
          </p>
        </Link>

        <Link
          href="/high-school/results/girls"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Girls Results</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View meet results, team scores, and individual performances.
          </p>
        </Link>

        <Link
          href="/runners?teamLevel=hs"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Browse Roster</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore athlete profiles, PRs, and season history.
          </p>
        </Link>
      </div>

      {/* Team Captains */}
      {captains.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Team Captains</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {captains.map((captain) => (
              <Link
                key={captain.id}
                href={`/runners/${captain.slug}`}
                className="flex items-center gap-4 p-4 bg-prGreen-50 dark:bg-prGreen-900/20 rounded-lg hover:bg-prGreen-100 dark:hover:bg-prGreen-900/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-prGreen-200 dark:bg-prGreen-800 flex items-center justify-center">
                  <span className="text-lg font-bold text-prGreen-700 dark:text-prGreen-300">
                    {captain.firstName.charAt(0)}{captain.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {captain.firstName} {captain.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {captain.gender === 'boys' ? 'Boys' : 'Girls'} Captain &middot; Grade {captain.grade}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
