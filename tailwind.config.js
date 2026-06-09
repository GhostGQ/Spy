/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark base
        bg: '#0E0F13',
        surface: '#191B22',
        'surface-2': '#23262F',
        border: '#2E323D',
        muted: '#8A8F9C',
        // Accents (per design palette)
        accent: '#F5C518', // yellow — progress / primary
        time: '#FF8A3D', // orange — timer
        streak: '#34D27B', // green — civilians / streak
        level: '#9B7CFF', // purple — level
        info: '#3D9BFF', // blue — achievements / info
        danger: '#FF5A5A', // red — spies / exit
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
