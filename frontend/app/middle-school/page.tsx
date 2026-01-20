import { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { StatCard } from '@/components/StatCard'
import { runners } from '@/data/runners'
import { getCoachesByTeamLevel } from '@/data/coaches'

export const metadata: Metadata = {
  title: 'Middle School Program',
  description: 'Pine Ridge Middle School Cross Country and Track program overview.',
}

export default function MiddleSchoolPage() {
  const msRunners = runners.filter(r => r.teamLevel === 'ms')
  const msBoys = msRunners.filter(r => r.gender === 'boys')
  const msGirls = msRunners.filter(r => r.gender === 'girls')
  const coaches = getCoachesByTeamLevel('ms')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Middle School Program
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
        The Pine Ridge middle school program introduces young athletes to competitive running
        in a supportive, fun environment. Our runners compete in 2-mile cross country races
        and age-appropriate track events, building the foundation for high school success.
      </p>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard label="Boys Team" value={msBoys.length} description="athletes" />
        <StatCard label="Girls Team" value={msGirls.length} description="athletes" />
        <StatCard label="Coaches" value={coaches.length} description="on staff" />
        <StatCard label="Grades" value="6-8" description="eligible" variant="accent" />
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link
          href="/middle-school/coaches"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Meet the Coaches</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Our MS coaches specialize in developing young runners.
          </p>
        </Link>

        <Link
          href="/middle-school/results/boys"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Boys Results</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View meet results and individual performances.
          </p>
        </Link>

        <Link
          href="/middle-school/results/girls"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Girls Results</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View meet results and individual performances.
          </p>
        </Link>

        <Link
          href="/middle-school/records"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">County Records</h2>
          <p className="text-gray-600 dark:text-gray-400">
            All-time county records for middle school runners.
          </p>
        </Link>

        <Link
          href="/runners?teamLevel=ms"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Browse Roster</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore athlete profiles and PRs.
          </p>
        </Link>
      </div>

      {/* Program Philosophy */}
      <section className="bg-prBlue-50 dark:bg-prBlue-900/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-prBlue-900 dark:text-prBlue-100 mb-3">
          Our Philosophy
        </h2>
        <p className="text-prBlue-800 dark:text-prBlue-200 mb-4">
          At the middle school level, our focus is on building a love for running and establishing
          healthy habits that will last a lifetime. We emphasize:
        </p>
        <ul className="space-y-2 text-prBlue-700 dark:text-prBlue-300">
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-prGreen-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Fun and team camaraderie above all
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-prGreen-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Proper running form and fundamentals
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-prGreen-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Gradual progression to avoid overuse injuries
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-prGreen-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Preparation for high school competition
          </li>
        </ul>
      </section>
    </div>
  )
}
