/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark navy/indigo base (gaming design system)
        bg: '#13152E', // deepest — page gradient end
        'bg-elevated': '#1A1D3A', // gradient start
        surface: '#1E2248', // card
        'surface-2': '#252A52', // elevated card
        'surface-3': '#2A2F5A', // input / control surface
        border: '#2A2F5A',
        muted: '#6B7394',
        'text-secondary': '#B8BDD8',
        // Accents (token names kept for backward compat; values from design system)
        accent: '#3B82F6', // electric blue — primary
        'accent-bright': '#60A5FA',
        cyan: '#2DD4F7',
        purple: '#7C3AED',
        'purple-light': '#A78BFA',
        level: '#8B5CF6', // purple (kept name)
        info: '#60A5FA',
        streak: '#34D399', // green
        danger: '#F87171', // red
        time: '#FB923C', // orange (legacy timer screen)
        star: '#FBBF24',
      },
      fontFamily: {
        display: ['Rajdhani_700Bold'],
        'display-sb': ['Rajdhani_600SemiBold'],
        sans: ['Inter_400Regular'],
        'sans-md': ['Inter_500Medium'],
        'sans-sb': ['Inter_600SemiBold'],
        'sans-b': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
