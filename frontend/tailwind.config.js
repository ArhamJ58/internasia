/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#070b14',
        surface: '#0d1525',
        card:    '#111827',
        border:  '#1e2d45',
        'border-hi': '#2a3f5e',
        gold:    '#f0b429',
        'gold-dim': '#a07818',
        't1':    '#e8edf5',
        't2':    '#8899bb',
        't3':    '#4a5a78',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
