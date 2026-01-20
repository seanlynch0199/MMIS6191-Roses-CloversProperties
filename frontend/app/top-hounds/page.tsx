import { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { boys5kAllTime, girls5kAllTime } from '@/data/records'

export const metadata: Metadata = {
  title: 'Top Hounds',
  description: 'All-time records, rankings, and championship history for Pine Ridge Running Club.',
}

const recordCategories = [
  {
    title: 'Overall Rankings',
    href: '/top-hounds/overall-rankings',
    description: 'Combined rankings across all events and seasons.',
    icon: '🏆',
  },
  {
    title: 'Championships',
    href: '/top-hounds/championships',
    description: 'State, region, and conference championship performances.',
    icon: '🥇',
  },
  {
    title: 'State Course All-Time',
    href: '/top-hounds/state-course-all-time',
    description: 'Fastest times on the state championship course.',
    icon: '🏟️',
  },
  {
    title: 'Boys 5K Times',
    href: '/top-hounds/boys-5k-times',
    description: 'All-time fastest boys 5K cross country times.',
    icon: '🏃',
  },
  {
    title: 'Girls 5K Times',
    href: '/top-hounds/girls-5k-times',
    description: 'All-time fastest girls 5K cross country times.',
    icon: '🏃‍♀️',
  },
  {
    title: '4x800 Records',
    href: '/top-hounds/4x800-records',
    description: 'Relay team records and history.',
    icon: '🔄',
  },
  {
    title: 'Grinder Records',
    href: '/top-hounds/grinder-records',
    description: 'Tough workout benchmarks and training records.',
    icon: '💪',
  },
]

export default function TopHoundsPage() {
  const topBoy = boys5kAllTime[0]
  const topGirl = girls5kAllTime[0]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Top Hounds
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
        The best of the best. Explore all-time records, rankings, and championship history
        for Pine Ridge Running Club. These athletes have left their mark on our program.
      </p>

      {/* Quick Highlights */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gradient-to-br from-prBlue-500 to-prBlue-700 rounded-xl p-6 text-white">
          <h2 className="text-lg font-medium text-prBlue-100 mb-2">Boys 5K Record</h2>
          <p className="text-4xl font-bold mb-2">{topBoy.time}</p>
          <p className="text-prBlue-100">{topBoy.name} ({topBoy.year})</p>
          <p className="text-sm text-prBlue-200 mt-1">{topBoy.meet}</p>
        </div>
        <div className="bg-gradient-to-br from-prGreen-500 to-prGreen-700 rounded-xl p-6 text-white">
          <h2 className="text-lg font-medium text-prGreen-100 mb-2">Girls 5K Record</h2>
          <p className="text-4xl font-bold mb-2">{topGirl.time}</p>
          <p className="text-prGreen-100">{topGirl.name} ({topGirl.year})</p>
          <p className="text-sm text-prGreen-200 mt-1">{topGirl.meet}</p>
        </div>
      </div>

      {/* Category Grid */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Explore Records</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recordCategories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-prBlue-300 dark:hover:border-prBlue-600 transition-all hover:shadow-lg group"
          >
            <span className="text-3xl mb-3 block">{category.icon}</span>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-prBlue-600 dark:group-hover:text-prBlue-400 transition-colors">
              {category.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
