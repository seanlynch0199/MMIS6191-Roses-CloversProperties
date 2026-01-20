import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Callout } from '@/components/Callout'
import { records } from '@/data/records'

export const metadata: Metadata = {
  title: 'Championships',
  description: 'Championship history and notable performances for Pine Ridge Running Club.',
}

export default function ChampionshipsPage() {
  const championshipRecords = records.filter(r => r.category === 'Championships')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Championships
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Pine Ridge&apos;s finest championship moments. State, region, and conference
        performances that define our program&apos;s competitive history.
      </p>

      {/* Championship Highlights */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Championship History</h2>
        <div className="space-y-4">
          {championshipRecords.map((record) => (
            <div
              key={record.id}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{record.event}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{record.holderName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{record.meet} &middot; {record.year}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-prBlue-600 dark:text-prBlue-400">
                    {record.time}
                  </span>
                </div>
              </div>
              {record.notes && (
                <p className="mt-3 text-sm text-prGreen-600 dark:text-prGreen-400 font-medium">
                  {record.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* State Meet History */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">State Meet History</h2>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Team Finishes</h3>
              <ul className="space-y-2">
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">2019 Boys XC</span>
                  <span className="font-semibold text-gray-900 dark:text-white">3rd Place</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">2021 Girls XC</span>
                  <span className="font-semibold text-gray-900 dark:text-white">5th Place</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">2024 Boys 4x800</span>
                  <span className="font-semibold text-prGreen-600 dark:text-prGreen-400">STATE CHAMPIONS</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">All-State Selections</h3>
              <ul className="space-y-2">
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total All-State (Boys XC)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">8 athletes</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total All-State (Girls XC)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">5 athletes</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Track State Qualifiers</span>
                  <span className="font-semibold text-gray-900 dark:text-white">24 total</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Success */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Success</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-prBlue-50 dark:bg-prBlue-900/20 rounded-lg border border-prBlue-200 dark:border-prBlue-800">
            <h3 className="font-semibold text-prBlue-900 dark:text-prBlue-100">2024 Cross Country</h3>
            <ul className="mt-2 text-sm text-prBlue-700 dark:text-prBlue-300 space-y-1">
              <li>Boys: 2nd at Region, 12th at State</li>
              <li>Girls: 3rd at Region, 8th at State</li>
              <li>2 Individual All-State honorees</li>
            </ul>
          </div>
          <div className="p-4 bg-prGreen-50 dark:bg-prGreen-900/20 rounded-lg border border-prGreen-200 dark:border-prGreen-800">
            <h3 className="font-semibold text-prGreen-900 dark:text-prGreen-100">2024 Track</h3>
            <ul className="mt-2 text-sm text-prGreen-700 dark:text-prGreen-300 space-y-1">
              <li>4x800 STATE CHAMPIONS (Boys)</li>
              <li>6 State Meet qualifiers</li>
              <li>Multiple school records broken</li>
            </ul>
          </div>
        </div>
      </section>

      <Callout variant="info" className="mt-8">
        Championship results are from GHSA State Meets. &quot;All-State&quot; recognition
        is awarded to top-15 individual finishers in cross country and top-8 finishers
        (state finals) in track events.
      </Callout>
    </div>
  )
}
