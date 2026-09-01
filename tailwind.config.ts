import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0f0f0f',
        panel: '#181818',
        panel2: '#212121',
        border: '#303030',
        accent: '#ff0033',
        accent2: '#3ea6ff',
        good: '#3fb950',
        bad: '#f85149',
        muted: '#aaaaaa',
      },
    },
  },
  plugins: [],
}
export default config
