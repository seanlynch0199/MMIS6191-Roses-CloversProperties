import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Callout } from '@/components/Callout'
import { relay4x800Records } from '@/data/records'

export const metadata: Metadata = {
  title: '4x800 Records',
  description: '4x800 relay records and history for Pine Ridge Running Club.',
}

export default function Relay4x800Page() {
  const boysRelays = relay4x800Records.filter(r => r.gender === 'boys')
  const girlsRelays = relay4x800Records.filter(r => r.gender === 'girls')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        4x800 Relay Records
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The 4x800m relay is one of track&apos;s most demanding events, requiring four athletes
        to each run two laps at near-maximum effort. Pine Ridge has a proud tradition in this event.
      </p>

      {/* Current Records Highlight */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gradient-to-br from-prBlue-500 to-prBlue-700 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏆</span>
            <span className="text-prBlue-100 font-medium">Boys School Record</span>
          </div>
          <p className="text-4xl font-bold mb-2">7:58.4</p>
          <p className="text-prBlue-100">{boysRelays[0]?.names}</p>
          <p className="text-sm text-prBlue-200 mt-1">{boysRelays[0]?.meet} &middot; {boysRelays[0]?.year}</p>
          <div className="mt-3 inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded">
            STATE CHAMPIONS
          </div>
        </div>
        <div className="bg-gradient-to-br from-prGreen-500 to-prGreen-700 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏆</span>
            <span className="text-prGreen-100 font-medium">Girls School Record</span>
          </div>
          <p className="text-4xl font-bold mb-2">9:28.5</p>
          <p className="text-prGreen-100">{girlsRelays[0]?.names}</p>
          <p className="text-sm text-prGreen-200 mt-1">{girlsRelays[0]?.meet} &middot; {girlsRelays[0]?.year}</p>
        </div>
      </div>

      {/* All-Time Lists */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Boys */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Boys All-Time</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">#</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Team</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Year</th>
                </tr>
              </thead>
              <tbody>
                {boysRelays.map((relay, index) => (
                  <tr
                    key={relay.rank}
                    className={index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}
                  >
                    <td className="py-2 px-3 text-sm text-gray-500">{relay.rank}</td>
                    <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">{relay.names}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-prBlue-600 dark:text-prBlue-400">{relay.time}</td>
                    <td className="py-2 px-3 text-sm text-gray-500">{relay.year}</td>
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
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Team</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Year</th>
                </tr>
              </thead>
              <tbody>
                {girlsRelays.map((relay, index) => (
                  <tr key={relay.rank}>
                    <td className="py-2 px-3 text-sm text-gray-500">{relay.rank}</td>
                    <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">{relay.names}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-prGreen-600 dark:text-prGreen-400">{relay.time}</td>
                    <td className="py-2 px-3 text-sm text-gray-500">{relay.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Callout title="About the 4x800" variant="info">
        The 4x800m relay (also known as the &quot;4x8&quot;) covers 3,200 meters total, with each runner
        completing 800m (two laps). It requires a combination of speed, endurance, and tactical
        racing. Our 2024 boys team made program history by winning the state championship -
        Pine Ridge&apos;s first state title in any track event.
      </Callout>
    </div>
  )
}
