import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Callout } from '@/components/Callout'
import { records } from '@/data/records'

export const metadata: Metadata = {
  title: 'Grinder Records',
  description: 'Workout benchmarks and training records for Pine Ridge Running Club.',
}

export default function GrinderRecordsPage() {
  const grinderRecords = records.filter(r => r.category === 'Grinder Records')

  const boysGrinders = grinderRecords.filter(r => r.gender === 'boys')
  const girlsGrinders = grinderRecords.filter(r => r.gender === 'girls')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Grinder Records
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The &quot;Grinder Records&quot; track the toughest workout performances in Pine Ridge history.
        These aren&apos;t race times - they&apos;re training benchmarks that show who can push
        through the pain when it matters most.
      </p>

      <Callout variant="warning" className="mb-8">
        <strong>What makes a Grinder?</strong> A &quot;Grinder&quot; workout is designed to test mental
        and physical toughness. These workouts are performed during training, not competition,
        and represent the hardest efforts our athletes have given in practice.
      </Callout>

      {/* Boys Grinders */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Boys Grinder Records</h2>
        <div className="space-y-4">
          {boysGrinders.map((record) => (
            <div
              key={record.id}
              className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{record.event}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{record.holderName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{record.year}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-prBlue-600 dark:text-prBlue-400">
                    {record.time}
                  </span>
                </div>
              </div>
              {record.notes && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                  {record.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Girls Grinders */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Girls Grinder Records</h2>
        <div className="space-y-4">
          {girlsGrinders.map((record) => (
            <div
              key={record.id}
              className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{record.event}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{record.holderName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{record.year}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-prGreen-600 dark:text-prGreen-400">
                    {record.time}
                  </span>
                </div>
              </div>
              {record.notes && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                  {record.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Workout Descriptions */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Workout Descriptions</h2>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">5-Mile Tempo</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A continuous 5-mile run at &quot;comfortably hard&quot; pace on the home course.
              This tests sustained threshold running ability.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">6x1000m</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Six repetitions of 1000 meters with 90 seconds recovery. Time shown is the
              average of all six reps. Tests VO2max and repeatability.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Ridge Loop (3.2mi)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The toughest loop on our training grounds with 450 feet of elevation gain.
              A solo time trial effort that separates the tough from the truly tough.
            </p>
          </div>
        </div>
      </section>

      <Callout title="Records Methodology" variant="neutral" className="mt-8">
        Grinder records are verified by coaching staff and recorded during official team
        practices. Times must be witnessed and confirmed. Athletes cannot set Grinder
        records during individual training - these are team workout benchmarks only.
      </Callout>
    </div>
  )
}
