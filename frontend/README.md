# Pine Ridge Running Club Website

A modern, responsive website for the Pine Ridge Running Club (fictional), built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Charts**: Recharts
- **Data**: Local JSON/TypeScript files (no database)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with header/footer
│   ├── page.tsx           # Home page
│   ├── health/            # Health resources
│   ├── home-meet/         # Course info
│   ├── runners/           # Runner explorer & profiles
│   ├── high-school/       # HS program pages
│   ├── middle-school/     # MS program pages
│   ├── top-hounds/        # Records & rankings
│   └── schedules/         # Schedule pages
├── components/            # Reusable React components
├── data/                  # TypeScript data files
│   ├── types.ts          # Type definitions
│   ├── site.ts           # Site config & navigation
│   ├── runners.ts        # Athlete data (40+ runners)
│   ├── schedules.ts      # Meet schedules
│   ├── results.ts        # Meet results
│   ├── records.ts        # All-time records
│   ├── coaches.ts        # Coach bios
│   └── course.ts         # Home course info
├── lib/                   # Utility functions
│   └── utils.ts          # Helpers (formatTime, etc.)
└── public/               # Static assets
```

## Editing Data

All data is stored in TypeScript files in the `/data` directory. No database is required.

### Adding/Editing Runners

Edit `data/runners.ts`:

```typescript
{
  id: 'hs-b-001',
  slug: 'first-last',  // URL-friendly name
  firstName: 'First',
  lastName: 'Last',
  teamLevel: 'hs',     // 'hs' or 'ms'
  gender: 'boys',      // 'boys' or 'girls'
  grade: 12,
  eventFocus: 'distance',
  bio: 'Runner bio...',
  prs: [
    { event: '5K', time: '16:00', date: '2024-10-01', meet: 'Meet Name', season: 'xc' }
  ],
  seasonHistory: [...],
  notableMeets: ['Achievement 1', 'Achievement 2']
}
```

### Adding Meets to Schedule

Edit `data/schedules.ts`:

```typescript
{
  id: 'xc-2024-01',
  name: 'Meet Name',
  date: '2024-08-24',
  location: 'Venue Name',
  address: '123 Main St, City, GA 30000',
  notes: 'Optional notes',
  season: 'xc',        // 'xc' or 'track'
  teamLevels: ['hs', 'ms'],
  isHomeMeet: false
}
```

### Adding Results

Edit `data/results.ts` with meet results including individual times and team scores.

### Adding Records

Edit `data/records.ts` for all-time records and rankings.

## Season Switcher

The website supports both Cross Country (XC) and Track seasons:

- **URL Parameter**: `?season=xc` or `?season=track`
- **localStorage**: Selection persists across page loads
- **Default**: Automatically selects based on current month (XC: Aug-Nov, Track: Feb-May)

The season switcher appears on relevant pages (schedules, results, records).

## Dark Mode

Dark mode is fully supported:

- Toggle in the header
- Respects system preference by default
- Persists selection in localStorage

## Color Theme

Custom colors defined in `tailwind.config.ts`:

- **Primary (prBlue)**: `#0B3A6E` - Used for navigation, links, headers
- **Accent (prGreen)**: `#1B7A3A` - Used for highlights, badges, CTAs

CSS variables are also available:
- `--color-primary`
- `--color-accent`
- `--color-bg`
- `--color-card`
- `--color-text`

## Key Features

1. **Runner Explorer** - Search and filter athletes by team, gender, grade, event focus
2. **Runner Profiles** - Individual pages with PRs, season history, progression charts
3. **Season Switcher** - Toggle between XC and Track content
4. **Sortable Tables** - Click column headers to sort records
5. **Dark Mode** - Full dark theme support
6. **Print Styles** - Results and records pages are print-friendly
7. **Mobile Responsive** - Works on all screen sizes

## Deployment

The project is configured for deployment with:

```bash
npm run build
```

Output is in `.next/` directory. Can be deployed to Vercel, AWS, or any Node.js host.

## License

This is a fictional project for demonstration purposes.
