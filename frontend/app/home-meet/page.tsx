import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Accordion } from '@/components/Accordion'
import { Callout } from '@/components/Callout'
import { homeCoursInfo } from '@/data/course'

export const metadata: Metadata = {
  title: 'Home Meet - Timberwolf Trail Course',
  description: 'Course information, spectator guide, parking, and tips for the Timberwolf Trail home course at Pine Ridge.',
}

export default function HomeMeetPage() {
  const courseTips = homeCoursInfo.tips.map(tip => ({
    title: tip.title,
    content: <p>{tip.content}</p>,
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {homeCoursInfo.name}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {homeCoursInfo.description}
      </p>

      {/* Course Overview */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-prBlue-50 dark:bg-prBlue-900/20 rounded-lg">
            <h3 className="font-semibold text-prBlue-700 dark:text-prBlue-300 mb-1">Distance</h3>
            <p className="text-2xl font-bold text-prBlue-900 dark:text-prBlue-100">{homeCoursInfo.distance}</p>
          </div>
          <div className="p-4 bg-prGreen-50 dark:bg-prGreen-900/20 rounded-lg">
            <h3 className="font-semibold text-prGreen-700 dark:text-prGreen-300 mb-1">Terrain</h3>
            <p className="text-prGreen-900 dark:text-prGreen-100">{homeCoursInfo.terrain}</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Course Type</h3>
            <p className="text-purple-900 dark:text-purple-100">Rolling Hills</p>
          </div>
        </div>

        {/* Course Map Placeholder */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 mb-6 text-center">
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">Course Map</p>
            </div>
          </div>
          {homeCoursInfo.mapLink && (
            <a
              href={homeCoursInfo.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-prBlue-600 dark:text-prBlue-400 hover:underline"
            >
              View Interactive Map
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </section>

      {/* Course Tips */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Course Tips
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Knowledge of the course can make a big difference. Here are tips from our coaches and experienced runners.
        </p>
        <Accordion items={courseTips} allowMultiple />
      </section>

      {/* Spectator Spots */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Spectator Spots
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Maximize your viewing experience by positioning yourself at these key locations around the course.
        </p>
        <div className="grid gap-4">
          {homeCoursInfo.spectatorSpots.map((spot, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-prBlue-100 dark:bg-prBlue-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-prBlue-600 dark:text-prBlue-300">{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{spot.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{spot.description}</p>
                  {spot.accessibility && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      <span className="font-medium">Accessibility:</span> {spot.accessibility}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Parking & Facilities */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Parking & Facilities
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Parking
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{homeCoursInfo.parking}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Restrooms
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{homeCoursInfo.restrooms}</p>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-3">
          Meet Day Facilities
        </h3>
        <ul className="grid md:grid-cols-2 gap-2">
          {homeCoursInfo.facilities.map((facility, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 text-prGreen-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {facility}
            </li>
          ))}
        </ul>
      </section>

      {/* Volunteer CTA */}
      <Callout variant="success" title="Volunteer at Home Meets">
        Home meets require 50+ volunteers to run smoothly. We need help with timing, course marshaling,
        concessions, and more. Parents and community members are welcome! Contact the coaching staff
        to sign up for our volunteer list.
      </Callout>
    </div>
  )
}
