import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Callout } from '@/components/Callout'
import { Accordion } from '@/components/Accordion'

export const metadata: Metadata = {
  title: 'Health & Resources',
  description: 'Runner health tips, injury prevention, nutrition guidance, and training resources for Pine Ridge Running Club athletes.',
}

export default function HealthPage() {
  const healthTopics = [
    {
      title: 'Hydration Guidelines',
      content: (
        <div className="space-y-2">
          <p>Proper hydration is crucial for performance and safety. Follow these guidelines:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Drink 16-20 oz of water 2-3 hours before running</li>
            <li>Drink 8-10 oz 10-20 minutes before starting</li>
            <li>During runs over 60 minutes, drink 4-8 oz every 15-20 minutes</li>
            <li>After running, drink 16-24 oz for every pound lost</li>
            <li>Monitor urine color - pale yellow indicates good hydration</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Pre-Race Nutrition',
      content: (
        <div className="space-y-2">
          <p>What you eat before a race matters. Here are our recommendations:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Eat a familiar meal 3-4 hours before race time</li>
            <li>Focus on easily digestible carbohydrates</li>
            <li>Avoid high fiber, fatty, or spicy foods</li>
            <li>A small snack (banana, energy bar) 1-2 hours before is fine</li>
            <li>Never try new foods on race day</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Recovery Best Practices',
      content: (
        <div className="space-y-2">
          <p>Recovery is when your body adapts and gets stronger:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Cool down with 10-15 minutes of easy jogging/walking</li>
            <li>Stretch major muscle groups for 10-15 minutes post-run</li>
            <li>Eat a recovery snack within 30 minutes (carbs + protein)</li>
            <li>Get 8-10 hours of sleep on training days</li>
            <li>Take rest days seriously - they prevent injury</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Injury Prevention',
      content: (
        <div className="space-y-2">
          <p>Most running injuries are preventable. Follow these principles:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Increase weekly mileage by no more than 10% per week</li>
            <li>Include strength training 2-3 times per week</li>
            <li>Replace running shoes every 300-500 miles</li>
            <li>Listen to your body - pain is a warning signal</li>
            <li>Report any persistent pain to coaches immediately</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Heat Safety',
      content: (
        <div className="space-y-2">
          <p>Running in Georgia heat requires extra precautions:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Run early morning when possible (before 10am)</li>
            <li>Wear light-colored, moisture-wicking clothing</li>
            <li>Know the signs of heat exhaustion: dizziness, nausea, headache</li>
            <li>Take breaks in shade when needed</li>
            <li>Acclimatize gradually to hot weather</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Mental Preparation',
      content: (
        <div className="space-y-2">
          <p>Running is as much mental as physical:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Visualize successful races and workouts</li>
            <li>Break races into smaller segments mentally</li>
            <li>Focus on effort, not just outcomes</li>
            <li>Develop mantras or positive self-talk phrases</li>
            <li>Remember: discomfort is temporary, achievement lasts</li>
          </ul>
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Health & Resources
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Everything our runners need to stay healthy, perform their best, and enjoy the sport for years to come.
        These guidelines are developed with input from our coaching staff and sports medicine professionals.
      </p>

      <Callout title="Important" variant="warning" className="mb-8">
        If you experience any persistent pain, dizziness, or unusual symptoms during or after running,
        stop immediately and notify a coach. Your long-term health is more important than any single
        workout or race.
      </Callout>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Health Topics
        </h2>
        <Accordion items={healthTopics} allowMultiple />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Training Resources
        </h2>
        <div className="grid gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Summer Training Guide</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Build your base before the season starts. This guide covers weekly mileage progressions,
              easy run guidelines, and preparation for fall XC.
            </p>
            <span className="text-sm text-prBlue-600 dark:text-prBlue-400">Contact coaches for PDF</span>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Strength & Conditioning Routine</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Core exercises, hip strengthening, and bodyweight workouts designed specifically for distance runners.
            </p>
            <span className="text-sm text-prBlue-600 dark:text-prBlue-400">Contact coaches for PDF</span>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Race Day Checklist</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Everything you need to pack and prepare for meets. Never forget your spikes again!
            </p>
            <span className="text-sm text-prBlue-600 dark:text-prBlue-400">Contact coaches for PDF</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Athletic Training
        </h2>
        <Callout variant="info">
          <p>
            Pine Ridge High School has a certified athletic trainer available during practices and meets.
            For appointments or questions:
          </p>
          <p className="mt-2">
            <strong>Athletic Training Room:</strong> (706) 555-0143<br />
            <strong>Hours:</strong> Mon-Fri 2:30pm - 6:00pm during season
          </p>
        </Callout>
      </section>
    </div>
  )
}
