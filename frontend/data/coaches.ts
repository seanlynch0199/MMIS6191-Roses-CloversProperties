import { Coach } from './types'

export const coaches: Coach[] = [
  {
    id: 'coach-001',
    name: 'Coach David Reynolds',
    title: 'Head Coach - Cross Country & Track',
    teamLevel: 'hs',
    bio: 'Coach Reynolds brings over 15 years of coaching experience to Pine Ridge. A former collegiate runner at North Georgia, he has built the Timberwolves program from the ground up. Under his leadership, the team has sent runners to the state meet every year since 2015. Coach Reynolds believes in developing the whole athlete - emphasizing academics, character, and competitive excellence.',
    email: 'dreynolds@pineridgeschools.edu',
    yearsCoaching: 15,
    specialties: ['Distance Training', 'Race Strategy', 'Mental Preparation'],
  },
  {
    id: 'coach-002',
    name: 'Coach Maria Santos',
    title: 'Assistant Coach - Girls Program',
    teamLevel: 'hs',
    bio: 'Coach Santos joined Pine Ridge in 2019 after a successful collegiate career at Kennesaw State. She brings energy, expertise in strength training, and a passion for developing female distance runners. Her focus on injury prevention and periodization has helped the girls program achieve new heights.',
    email: 'msantos@pineridgeschools.edu',
    yearsCoaching: 6,
    specialties: ['Strength & Conditioning', 'Injury Prevention', 'Speed Development'],
  },
  {
    id: 'coach-003',
    name: 'Coach Tom Barrett',
    title: 'Assistant Coach - Track Specialist',
    teamLevel: 'hs',
    bio: 'Coach Barrett is our track and field specialist with expertise in middle distance events. A former 800m runner, he works closely with our relay teams and mid-distance athletes. His technical knowledge and attention to detail have produced multiple state qualifiers.',
    email: 'tbarrett@pineridgeschools.edu',
    yearsCoaching: 8,
    specialties: ['Middle Distance', 'Relay Strategy', 'Technical Training'],
  },
  {
    id: 'coach-004',
    name: 'Coach Jennifer Park',
    title: 'Head Coach - Middle School',
    teamLevel: 'ms',
    bio: 'Coach Park leads our middle school program with patience, enthusiasm, and a focus on fundamentals. She creates a welcoming environment where young runners can discover their love for the sport. Many of our current high school stars got their start under Coach Park\'s guidance.',
    email: 'jpark@pineridgeschools.edu',
    yearsCoaching: 10,
    specialties: ['Youth Development', 'Running Fundamentals', 'Building Team Culture'],
  },
  {
    id: 'coach-005',
    name: 'Coach Marcus Williams',
    title: 'Assistant Coach - Middle School',
    teamLevel: 'ms',
    bio: 'Coach Williams is a Pine Ridge alumnus who returned to give back to the program that shaped him. His enthusiasm is contagious, and he connects especially well with young athletes. He handles logistics, timing, and helps coordinate our feeder program.',
    email: 'mwilliams@pineridgeschools.edu',
    yearsCoaching: 3,
    specialties: ['Meet Logistics', 'JV Development', 'Alumni Relations'],
  },
]

export function getCoachesByTeamLevel(teamLevel: 'hs' | 'ms'): Coach[] {
  return coaches.filter(c => c.teamLevel === teamLevel)
}

export function getHeadCoach(teamLevel: 'hs' | 'ms'): Coach | undefined {
  return coaches.find(c => c.teamLevel === teamLevel && c.title.includes('Head'))
}
