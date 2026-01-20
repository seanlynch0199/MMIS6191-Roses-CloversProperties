import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        prBlue: {
          50: '#e6f0fa',
          100: '#cce1f5',
          200: '#99c3eb',
          300: '#66a5e0',
          400: '#3387d6',
          500: '#0B3A6E',
          600: '#092e58',
          700: '#072342',
          800: '#04172c',
          900: '#020c16',
        },
        prGreen: {
          50: '#e8f5ec',
          100: '#d1ebd9',
          200: '#a3d7b3',
          300: '#75c38d',
          400: '#47af67',
          500: '#1B7A3A',
          600: '#16622e',
          700: '#104923',
          800: '#0b3117',
          900: '#05180c',
        },
      },
    },
  },
  plugins: [],
}

export default config
