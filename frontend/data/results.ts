import { MeetResult } from './types'

export const meetResults: MeetResult[] = [
  // XC 2024 - HS Boys
  {
    meetId: 'xc-2024-01',
    meetName: 'Season Opener Invitational',
    date: '2024-08-24',
    season: 'xc',
    teamLevel: 'hs',
    gender: 'boys',
    teamPlace: 3,
    teamScore: 78,
    top5Average: '16:55',
    individualResults: [
      { runnerId: 'hs-b-001', runnerName: 'Marcus Chen', grade: 12, time: '16:15', place: 2 },
      { runnerId: 'hs-b-003', runnerName: 'Ethan Kowalski', grade: 12, time: '16:58', place: 5 },
      { runnerId: 'hs-b-002', runnerName: 'Jaylen Brooks', grade: 11, time: '17:02', place: 8 },
      { runnerId: 'hs-b-004', runnerName: 'Devon Martinez', grade: 10, time: '17:28', place: 12 },
      { runnerId: 'hs-b-005', runnerName: 'Noah Patel', grade: 11, time: '17:35', place: 14 },
      { runnerId: 'hs-b-007', runnerName: 'Cameron Wright', grade: 12, time: '17:42', place: 18 },
      { runnerId: 'hs-b-006', runnerName: 'Tyler Jackson', grade: 9, time: '18:22', place: 28 },
    ],
  },
  {
    meetId: 'xc-2024-02',
    meetName: 'Timberwolf Invitational',
    date: '2024-09-07',
    season: 'xc',
    teamLevel: 'hs',
    gender: 'boys',
    teamPlace: 1,
    teamScore: 42,
    top5Average: '16:36',
    individualResults: [
      { runnerId: 'hs-b-001', runnerName: 'Marcus Chen', grade: 12, time: '16:01', place: 1, pr: true },
      { runnerId: 'hs-b-003', runnerName: 'Ethan Kowalski', grade: 12, time: '16:41', place: 3 },
      { runnerId: 'hs-b-002', runnerName: 'Jaylen Brooks', grade: 11, time: '16:45', place: 4 },
      { runnerId: 'hs-b-007', runnerName: 'Cameron Wright', grade: 12, time: '17:05', place: 6, pr: true },
      { runnerId: 'hs-b-004', runnerName: 'Devon Martinez', grade: 10, time: '17:05', place: 7 },
      { runnerId: 'hs-b-005', runnerName: 'Noah Patel', grade: 11, time: '17:12', place: 9 },
      { runnerId: 'hs-b-006', runnerName: 'Tyler Jackson', grade: 9, time: '17:45', place: 15, pr: true },
    ],
  },
  {
    meetId: 'xc-2024-03',
    meetName: 'Mountain Challenge',
    date: '2024-09-21',
    season: 'xc',
    teamLevel: 'hs',
    gender: 'boys',
    teamPlace: 2,
    teamScore: 58,
    top5Average: '16:25',
    individualResults: [
      { runnerId: 'hs-b-001', runnerName: 'Marcus Chen', grade: 12, time: '15:58', place: 3, pr: true },
      { runnerId: 'hs-b-003', runnerName: 'Ethan Kowalski', grade: 12, time: '16:22', place: 4, pr: true },
      { runnerId: 'hs-b-002', runnerName: 'Jaylen Brooks', grade: 11, time: '16:28', place: 6, pr: true },
      { runnerId: 'hs-b-004', runnerName: 'Devon Martinez', grade: 10, time: '16:52', place: 10, pr: true },
      { runnerId: 'hs-b-006', runnerName: 'Tyler Jackson', grade: 9, time: '17:15', place: 12, pr: true },
    ],
  },
  {
    meetId: 'xc-2024-06',
    meetName: 'Region Championships',
    date: '2024-10-12',
    season: 'xc',
    teamLevel: 'hs',
    gender: 'boys',
    teamPlace: 2,
    teamScore: 52,
    top5Average: '16:08',
    individualResults: [
      { runnerId: 'hs-b-001', runnerName: 'Marcus Chen', grade: 12, time: '15:42', place: 1, pr: true },
      { runnerId: 'hs-b-002', runnerName: 'Jaylen Brooks', grade: 11, time: '16:08', place: 5, pr: true },
      { runnerId: 'hs-b-004', runnerName: 'Devon Martinez', grade: 10, time: '16:45', place: 9, pr: true },
      { runnerId: 'hs-b-005', runnerName: 'Noah Patel', grade: 11, time: '16:52', place: 11, pr: true },
      { runnerId: 'hs-b-009', runnerName: 'Ben Carter', grade: 11, time: '17:45', place: 18, pr: true },
    ],
  },

  // XC 2024 - HS Girls
  {
    meetId: 'xc-2024-01',
    meetName: 'Season Opener Invitational',
    date: '2024-08-24',
    season: 'xc',
    teamLevel: 'hs',
    gender: 'girls',
    teamPlace: 2,
    teamScore: 62,
    top5Average: '19:48',
    individualResults: [
      { runnerId: 'hs-g-001', runnerName: 'Sophia Andersson', grade: 12, time: '18:35', place: 1 },
      { runnerId: 'hs-g-002', runnerName: 'Maya Thompson', grade: 11, time: '19:22', place: 4 },
      { runnerId: 'hs-g-003', runnerName: 'Isabella Reyes', grade: 12, time: '19:48', place: 6 },
      { runnerId: 'hs-g-004', runnerName: 'Emma Nguyen', grade: 10, time: '20:15', place: 9 },
      { runnerId: 'hs-g-005', runnerName: 'Ava Johnson', grade: 11, time: '20:28', place: 11 },
    ],
  },
  {
    meetId: 'xc-2024-02',
    meetName: 'Timberwolf Invitational',
    date: '2024-09-07',
    season: 'xc',
    teamLevel: 'hs',
    gender: 'girls',
    teamPlace: 1,
    teamScore: 38,
    top5Average: '19:22',
    individualResults: [
      { runnerId: 'hs-g-001', runnerName: 'Sophia Andersson', grade: 12, time: '18:12', place: 1, pr: true },
      { runnerId: 'hs-g-002', runnerName: 'Maya Thompson', grade: 11, time: '18:55', place: 3, pr: true },
      { runnerId: 'hs-g-003', runnerName: 'Isabella Reyes', grade: 12, time: '19:25', place: 5 },
      { runnerId: 'hs-g-007', runnerName: 'Grace Kim', grade: 10, time: '20:12', place: 11, pr: true },
      { runnerId: 'hs-g-004', runnerName: 'Emma Nguyen', grade: 10, time: '20:08', place: 10 },
    ],
  },
  {
    meetId: 'xc-2024-03',
    meetName: 'Mountain Challenge',
    date: '2024-09-21',
    season: 'xc',
    teamLevel: 'hs',
    gender: 'girls',
    teamPlace: 2,
    teamScore: 48,
    top5Average: '19:05',
    individualResults: [
      { runnerId: 'hs-g-001', runnerName: 'Sophia Andersson', grade: 12, time: '18:05', place: 2, pr: true },
      { runnerId: 'hs-g-003', runnerName: 'Isabella Reyes', grade: 12, time: '19:05', place: 5, pr: true },
      { runnerId: 'hs-g-006', runnerName: 'Lily O\'Connor', grade: 9, time: '19:48', place: 8, pr: true },
      { runnerId: 'hs-g-009', runnerName: 'Rachel Green', grade: 10, time: '20:28', place: 13, pr: true },
      { runnerId: 'hs-g-004', runnerName: 'Emma Nguyen', grade: 10, time: '19:45', place: 7 },
    ],
  },
  {
    meetId: 'xc-2024-06',
    meetName: 'Region Championships',
    date: '2024-10-12',
    season: 'xc',
    teamLevel: 'hs',
    gender: 'girls',
    teamPlace: 3,
    teamScore: 65,
    top5Average: '18:52',
    individualResults: [
      { runnerId: 'hs-g-001', runnerName: 'Sophia Andersson', grade: 12, time: '17:58', place: 1, pr: true },
      { runnerId: 'hs-g-002', runnerName: 'Maya Thompson', grade: 11, time: '18:28', place: 4, pr: true },
      { runnerId: 'hs-g-004', runnerName: 'Emma Nguyen', grade: 10, time: '19:22', place: 7, pr: true },
      { runnerId: 'hs-g-005', runnerName: 'Ava Johnson', grade: 11, time: '19:35', place: 10, pr: true },
      { runnerId: 'hs-g-008', runnerName: 'Sarah White', grade: 11, time: '20:05', place: 14, pr: true },
    ],
  },
  {
    meetId: 'xc-2024-07',
    meetName: 'State Meet',
    date: '2024-11-02',
    season: 'xc',
    teamLevel: 'hs',
    gender: 'girls',
    teamPlace: 8,
    teamScore: 185,
    top5Average: '19:15',
    individualResults: [
      { runnerId: 'hs-g-001', runnerName: 'Sophia Andersson', grade: 12, time: '17:52', place: 5, pr: true },
      { runnerId: 'hs-g-002', runnerName: 'Maya Thompson', grade: 11, time: '18:42', place: 28 },
      { runnerId: 'hs-g-004', runnerName: 'Emma Nguyen', grade: 10, time: '19:35', place: 52 },
      { runnerId: 'hs-g-005', runnerName: 'Ava Johnson', grade: 11, time: '19:48', place: 58 },
      { runnerId: 'hs-g-003', runnerName: 'Isabella Reyes', grade: 12, time: '19:58', place: 65 },
    ],
  },

  // XC 2024 - MS Boys
  {
    meetId: 'xc-2024-05',
    meetName: 'County Championships',
    date: '2024-10-05',
    season: 'xc',
    teamLevel: 'ms',
    gender: 'boys',
    teamPlace: 1,
    teamScore: 28,
    top5Average: '11:52',
    individualResults: [
      { runnerId: 'ms-b-001', runnerName: 'Lucas Foster', grade: 8, time: '11:02', place: 1, pr: true },
      { runnerId: 'ms-b-002', runnerName: 'Aiden Williams', grade: 8, time: '11:28', place: 3, pr: true },
      { runnerId: 'ms-b-003', runnerName: 'Jackson Rivera', grade: 7, time: '11:55', place: 6, pr: true },
      { runnerId: 'ms-b-005', runnerName: 'Nathan Garcia', grade: 8, time: '12:08', place: 8, pr: true },
      { runnerId: 'ms-b-006', runnerName: 'David Hernandez', grade: 7, time: '12:35', place: 9, pr: true },
    ],
  },

  // XC 2024 - MS Girls
  {
    meetId: 'xc-2024-05',
    meetName: 'County Championships',
    date: '2024-10-05',
    season: 'xc',
    teamLevel: 'ms',
    gender: 'girls',
    teamPlace: 1,
    teamScore: 22,
    top5Average: '13:02',
    individualResults: [
      { runnerId: 'ms-g-001', runnerName: 'Chloe Adams', grade: 8, time: '12:15', place: 1, pr: true },
      { runnerId: 'ms-g-002', runnerName: 'Zoe Mitchell', grade: 8, time: '12:42', place: 2, pr: true },
      { runnerId: 'ms-g-003', runnerName: 'Mia Brown', grade: 7, time: '13:05', place: 4, pr: true },
      { runnerId: 'ms-g-005', runnerName: 'Olivia Lewis', grade: 8, time: '13:28', place: 6, pr: true },
      { runnerId: 'ms-g-006', runnerName: 'Emily Davis', grade: 7, time: '13:38', place: 8, pr: true },
    ],
  },

  // Track 2024 - HS Boys (sample)
  {
    meetId: 'track-2024-08',
    meetName: 'State Finals',
    date: '2024-05-11',
    season: 'track',
    teamLevel: 'hs',
    gender: 'boys',
    individualResults: [
      { runnerId: 'hs-b-003', runnerName: 'Ethan Kowalski', grade: 12, time: '1:56.2', place: 6 },
      { runnerId: 'hs-b-001', runnerName: 'Marcus Chen', grade: 12, time: '9:28.5', place: 4 },
    ],
  },

  // Track 2024 - HS Girls (sample)
  {
    meetId: 'track-2024-08',
    meetName: 'State Finals',
    date: '2024-05-11',
    season: 'track',
    teamLevel: 'hs',
    gender: 'girls',
    individualResults: [
      { runnerId: 'hs-g-003', runnerName: 'Isabella Reyes', grade: 12, time: '2:15.2', place: 8 },
      { runnerId: 'hs-g-001', runnerName: 'Sophia Andersson', grade: 12, time: '10:48.2', place: 3, pr: true },
    ],
  },
]

export function getResultsByMeet(meetId: string): MeetResult[] {
  return meetResults.filter(r => r.meetId === meetId)
}

export function getResultsBySeason(season: 'xc' | 'track'): MeetResult[] {
  return meetResults.filter(r => r.season === season)
}

export function getResultsByTeamLevelAndGender(
  teamLevel: 'hs' | 'ms',
  gender: 'boys' | 'girls'
): MeetResult[] {
  return meetResults.filter(r => r.teamLevel === teamLevel && r.gender === gender)
}

export function getLatestResults(
  season: 'xc' | 'track',
  teamLevel: 'hs' | 'ms',
  gender: 'boys' | 'girls',
  limit?: number
): MeetResult[] {
  const results = meetResults
    .filter(r => r.season === season && r.teamLevel === teamLevel && r.gender === gender)
    .sort((a, b) => b.date.localeCompare(a.date))

  return limit ? results.slice(0, limit) : results
}
