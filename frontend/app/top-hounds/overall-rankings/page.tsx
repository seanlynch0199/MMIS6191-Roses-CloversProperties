import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Callout } from '@/components/Callout'
import { boys5kAllTime, girls5kAllTime } from '@/data/records'

export const metadata: Metadata = {
  title: 'Overall Rankings',
  description: 'Combined all-time rankings for Pine Ridge Running Club athletes.',
}

export default function OverallRankingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Overall Rankings
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        All-time cross country rankings for Pine Ridge athletes. Rankings are based on
        best 5K performances from any certified course.
      </p>

      {/* Top 3 Highlights */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Boys Top 3 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Boys Top 3</h2>
          <div className="space-y-3">
            {boys5kAllTime.slice(0, 3).map((runner, index) => (
              <div
                key={runner.rank}
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  index === 0
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                    : index === 1
                    ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                }`}
              >
                <div className={`text-2xl font-bold ${
                  index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-500' : 'text-orange-600'
                }`}>
                  #{runner.rank}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{runner.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{runner.meet} ({runner.year})</p>
                </div>
                <div className="text-xl font-mono font-bold text-prBlue-600 dark:text-prBlue-400">
                  {runner.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Girls Top 3 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Girls Top 3</h2>
          <div className="space-y-3">
            {girls5kAllTime.slice(0, 3).map((runner, index) => (
              <div
                key={runner.rank}
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  index === 0
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                    : index === 1
                    ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                }`}
              >
                <div className={`text-2xl font-bold ${
                  index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-500' : 'text-orange-600'
                }`}>
                  #{runner.rank}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{runner.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{runner.meet} ({runner.year})</p>
                </div>
                <div className="text-xl font-mono font-bold text-prGreen-600 dark:text-prGreen-400">
                  {runner.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Rankings Tables */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Boys Full List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Boys All-Time</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">#</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Name</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Year</th>
                </tr>
              </thead>
              <tbody>
                {boys5kAllTime.map((runner, index) => (
                  <tr
                    key={runner.rank}
                    className={index < 3 ? 'bg-prGreen-50/50 dark:bg-prGreen-900/10' : ''}
                  >
                    <td className="py-2 px-3 text-sm text-gray-500">{runner.rank}</td>
                    <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{runner.name}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-prBlue-600 dark:text-prBlue-400">{runner.time}</td>
                    <td className="py-2 px-3 text-sm text-gray-500">{runner.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Girls Full List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Girls All-Time</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">#</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Name</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Year</th>
                </tr>
              </thead>
              <tbody>
                {girls5kAllTime.map((runner, index) => (
                  <tr
                    key={runner.rank}
                    className={index < 3 ? 'bg-prGreen-50/50 dark:bg-prGreen-900/10' : ''}
                  >
                    <td className="py-2 px-3 text-sm text-gray-500">{runner.rank}</td>
                    <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{runner.name}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-prGreen-600 dark:text-prGreen-400">{runner.time}</td>
                    <td className="py-2 px-3 text-sm text-gray-500">{runner.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Callout title="Records Methodology" variant="neutral" className="mt-8">
        Rankings include only verified times from official GHSA-sanctioned meets with
        electronic chip timing. Times from invitationals with certified courses are included.
        Multiple appearances by the same athlete are counted - this shows depth of performance,
        not just peak performance.
      </Callout>
    </div>
  )
}
