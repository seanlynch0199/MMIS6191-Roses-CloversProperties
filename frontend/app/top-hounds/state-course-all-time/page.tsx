import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Callout } from '@/components/Callout'
import { records } from '@/data/records'

export const metadata: Metadata = {
  title: 'State Course All-Time',
  description: 'Fastest times by Pine Ridge runners on the state championship course.',
}

export default function StateCourseAllTimePage() {
  const stateCourseRecords = records.filter(r => r.category === 'State Course Records')

  // Mock data for state course history
  const boysStateCourse = [
    { rank: 1, name: 'Jake Morrison', time: '15:35', year: 2019, place: 3 },
    { rank: 2, name: 'Marcus Chen', time: '15:48', year: 2024, place: 8 },
    { rank: 3, name: 'Kevin Walsh', time: '16:02', year: 2018, place: 12 },
    { rank: 4, name: 'Ryan O\'Brien', time: '16:18', year: 2020, place: 18 },
    { rank: 5, name: 'David Park', time: '16:25', year: 2017, place: 22 },
  ]

  const girlsStateCourse = [
    { rank: 1, name: 'Sarah Mitchell', time: '17:48', year: 2021, place: 4 },
    { rank: 2, name: 'Sophia Andersson', time: '17:52', year: 2024, place: 5 },
    { rank: 3, name: 'Emma Richardson', time: '18:15', year: 2019, place: 11 },
    { rank: 4, name: 'Lauren Hayes', time: '18:42', year: 2020, place: 19 },
    { rank: 5, name: 'Maya Thompson', time: '18:42', year: 2024, place: 28 },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        State Course All-Time
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The fastest times ever run by Pine Ridge athletes on the Carrollton state championship
        course. This challenging 5K course tests every runner with its rolling terrain and
        competitive atmosphere.
      </p>

      {/* Course Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">About the State Course</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Location:</span>
            <p className="font-medium text-gray-900 dark:text-white">Carrollton, GA</p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Distance:</span>
            <p className="font-medium text-gray-900 dark:text-white">5K (3.1 miles)</p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Terrain:</span>
            <p className="font-medium text-gray-900 dark:text-white">Rolling hills, grass</p>
          </div>
        </div>
      </div>

      {/* Records */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Boys */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Boys All-Time</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">#</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Name</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Yr</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Pl</th>
                </tr>
              </thead>
              <tbody>
                {boysStateCourse.map((runner, index) => (
                  <tr
                    key={runner.rank}
                    className={index < 3 ? 'bg-prGreen-50/50 dark:bg-prGreen-900/10' : ''}
                  >
                    <td className="py-2 px-3 text-sm text-gray-500">{runner.rank}</td>
                    <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{runner.name}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-prBlue-600 dark:text-prBlue-400">{runner.time}</td>
                    <td className="py-2 px-3 text-sm text-gray-500">{runner.year}</td>
                    <td className="py-2 px-3 text-sm text-gray-500">{runner.place}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Girls */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Girls All-Time</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">#</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Name</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Yr</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Pl</th>
                </tr>
              </thead>
              <tbody>
                {girlsStateCourse.map((runner, index) => (
                  <tr
                    key={runner.rank}
                    className={index < 3 ? 'bg-prGreen-50/50 dark:bg-prGreen-900/10' : ''}
                  >
                    <td className="py-2 px-3 text-sm text-gray-500">{runner.rank}</td>
                    <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{runner.name}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-prGreen-600 dark:text-prGreen-400">{runner.time}</td>
                    <td className="py-2 px-3 text-sm text-gray-500">{runner.year}</td>
                    <td className="py-2 px-3 text-sm text-gray-500">{runner.place}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Callout variant="neutral" title="Note">
        Times shown are from GHSA State Championship meets only. The state course has been
        used since 2015. Place indicates overall finish at the state meet.
      </Callout>
    </div>
  )
}
