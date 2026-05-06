/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          0: '#0b0e14',
          1: '#11151d',
          2: '#161b25',
          3: '#1d2330',
        },
        line: {
          DEFAULT: '#232a39',
          soft: '#1a2030',
        },
        ink: {
          0: '#f3f5f9',
          1: '#c8cfde',
          2: '#8893a8',
          3: '#7b8499',
        },
        accent: {
          DEFAULT: '#ffb38a',
          strong: '#ff8a4c',
        },
        warn: '#ffb38a',
        critical: '#ff6b6b',
        ok: '#6ee2b9',
        info: '#7cc8ff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
}
