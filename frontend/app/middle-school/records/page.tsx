'use client'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Callout } from '@/components/Callout'
import { getRecordsByTeamLevel } from '@/data/records'

export default function MSRecordsPage() {
  const msRecords = getRecordsByTeamLevel('ms')

  const boysRecords = msRecords.filter(r => r.gender === 'boys')
  const girlsRecords = msRecords.filter(r => r.gender === 'girls')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        County Records
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        All-time county records for middle school cross country and track. These records
        represent the fastest times ever run by Pine Ridge middle school athletes.
      </p>

      {/* Boys Records */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Boys Records</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Event</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Athlete</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Year</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Meet</th>
              </tr>
            </thead>
            <tbody>
              {boysRecords.map((record, index) => (
                <tr
                  key={record.id}
                  className={`border-b border-gray-100 dark:border-gray-800 ${
                    index === 0 ? 'bg-prGreen-50/50 dark:bg-prGreen-900/10' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{record.event}</td>
                  <td className="py-3 px-4 font-mono font-bold text-prBlue-600 dark:text-prBlue-400">{record.time}</td>
                  <td className="py-3 px-4">{record.holderName}</td>
                  <td className="py-3 px-4">{record.year}</td>
                  <td className="py-3 px-4 hidden sm:table-cell text-gray-500">{record.meet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Girls Records */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Girls Records</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Event</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Athlete</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Year</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Meet</th>
              </tr>
            </thead>
            <tbody>
              {girlsRecords.map((record, index) => (
                <tr
                  key={record.id}
                  className={`border-b border-gray-100 dark:border-gray-800 ${
                    index === 0 ? 'bg-prGreen-50/50 dark:bg-prGreen-900/10' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{record.event}</td>
                  <td className="py-3 px-4 font-mono font-bold text-prGreen-600 dark:text-prGreen-400">{record.time}</td>
                  <td className="py-3 px-4">{record.holderName}</td>
                  <td className="py-3 px-4">{record.year}</td>
                  <td className="py-3 px-4 hidden sm:table-cell text-gray-500">{record.meet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout title="Records Methodology" variant="neutral">
        County records are verified times from official meets with electronic timing.
        Only performances from sanctioned middle school competitions are eligible.
        Records are updated within one week of being set. If you believe a record
        is incorrect or missing, please contact the coaching staff.
      </Callout>
    </div>
  )
}
