import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // dark: classes compile but never activate — no .dark class is ever added to <html>
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Clover Green - Primary accent
        clover: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Rose Red - Secondary accent
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        // Wood - Warm brown accent
        wood: {
          50:  '#fdf8f0',
          100: '#f5e5c0',
          200: '#e8c87a',
          300: '#d4a84e',
          400: '#bf8a2e',
          500: '#a56e18',
          600: '#8a5511',
          700: '#6f400d',
          800: '#572f0a',
          900: '#3d1f06',
          950: '#1e0d02',
        },
      },
    },
  },
  plugins: [],
}

export default config
