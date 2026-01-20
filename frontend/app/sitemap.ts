import { MetadataRoute } from 'next'
import { runners } from '@/data/runners'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pineridgerunning.com'

  // Static pages
  const staticPages = [
    '',
    '/health',
    '/home-meet',
    '/runners',
    '/schedules',
    '/schedules/archive',
    '/high-school',
    '/high-school/coaches',
    '/high-school/results/boys',
    '/high-school/results/girls',
    '/middle-school',
    '/middle-school/coaches',
    '/middle-school/results/boys',
    '/middle-school/results/girls',
    '/middle-school/records',
    '/top-hounds',
    '/top-hounds/overall-rankings',
    '/top-hounds/championships',
    '/top-hounds/state-course-all-time',
    '/top-hounds/boys-5k-times',
    '/top-hounds/girls-5k-times',
    '/top-hounds/4x800-records',
    '/top-hounds/grinder-records',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic runner pages
  const runnerPages = runners.map((runner) => ({
    url: `${baseUrl}/runners/${runner.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...runnerPages]
}
