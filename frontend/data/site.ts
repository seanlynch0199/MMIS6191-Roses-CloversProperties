import { SiteConfig, NavItem } from './types'

export const siteConfig: SiteConfig = {
  name: 'Pine Ridge Running Club',
  shortName: 'PRRC',
  tagline: 'Run Together. Rise Together.',
  description: 'Official home of the Pine Ridge Timberwolves Cross Country and Track programs. Building champions through dedication, teamwork, and a love for running.',
  school: 'Pine Ridge Timberwolves',
  mascot: 'Timberwolf',
  location: 'North Georgia',
  colors: {
    primary: '#0B3A6E',
    accent: '#1B7A3A',
  },
  contact: {
    email: 'running@pineridgeschools.edu',
    phone: '(706) 555-0142',
    address: '1200 Timberwolf Trail, Pine Ridge, GA 30528',
  },
  social: {
    twitter: 'PineRidgeXC',
    instagram: 'pineridgerunning',
    facebook: 'PineRidgeRunningClub',
  },
}

export const navigation: NavItem[] = [
  {
    label: 'High School',
    href: '/high-school',
    children: [
      { label: 'Overview', href: '/high-school' },
      { label: 'Coaches', href: '/high-school/coaches' },
      { label: 'Boys Results', href: '/high-school/results/boys' },
      { label: 'Girls Results', href: '/high-school/results/girls' },
    ],
  },
  {
    label: 'Middle School',
    href: '/middle-school',
    children: [
      { label: 'Overview', href: '/middle-school' },
      { label: 'Coaches', href: '/middle-school/coaches' },
      { label: 'Boys Results', href: '/middle-school/results/boys' },
      { label: 'Girls Results', href: '/middle-school/results/girls' },
      { label: 'County Records', href: '/middle-school/records' },
    ],
  },
  {
    label: 'Runners',
    href: '/runners',
  },
  {
    label: 'Top Hounds',
    href: '/top-hounds',
    children: [
      { label: 'Overview', href: '/top-hounds' },
      { label: 'Overall Rankings', href: '/top-hounds/overall-rankings' },
      { label: 'Championships', href: '/top-hounds/championships' },
      { label: 'State Course All-Time', href: '/top-hounds/state-course-all-time' },
      { label: 'Boys 5K Times', href: '/top-hounds/boys-5k-times' },
      { label: 'Girls 5K Times', href: '/top-hounds/girls-5k-times' },
      { label: '4x800 Records', href: '/top-hounds/4x800-records' },
      { label: 'Grinder Records', href: '/top-hounds/grinder-records' },
    ],
  },
  {
    label: 'Health',
    href: '/health',
  },
  {
    label: 'Home Meet',
    href: '/home-meet',
  },
  {
    label: 'Schedules',
    href: '/schedules',
    children: [
      { label: 'Current Season', href: '/schedules' },
      { label: 'Archive', href: '/schedules/archive' },
    ],
  },
]
