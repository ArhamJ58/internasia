import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        onyx: { DEFAULT: '#0B0B0C', 800: '#141416', 700: '#1C1C1F', 600: '#2A2A2E' },
        ivory: { DEFAULT: '#F7F4EE', 200: '#EFEAE1', 300: '#E2DBCE' },
        gold: {
          DEFAULT: '#DBB300', // brand gold, sampled from the monogram
          light: '#F0D34E',
          deep: '#A9860B',
          champagne: '#C9A84C',
        },
        ink: '#3A3733',
        muted: '#7A736A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        jp: ['var(--font-jp)', 'Noto Sans JP', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.32em',
        wide2: '0.18em',
      },
      maxWidth: { shell: '1280px' },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
        glide: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
