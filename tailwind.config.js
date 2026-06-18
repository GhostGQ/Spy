/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neutral near-black noir base — monochrome until a mode is chosen
        bg: '#0A0A0C', // deepest — page gradient end
        'bg-elevated': '#121216', // gradient start
        surface: '#17171C', // card
        'surface-2': '#1F1F25', // elevated card
        'surface-3': '#292930', // input / control surface
        border: '#292930',
        muted: '#7C7F8B',
        'text-secondary': '#C2C4CE',
        steel: '#6E7689',
        'steel-bright': '#A6ADBE',
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
        // Redesign tokens — noir-spy + spectral
        amber: '#F5B43C', // classified-dossier gold
        'amber-bright': '#FBD27A',
        spectral: '#5EEAD4', // ghostly teal-green
        crimson: '#EF4444', // deeper syndicate red
      },
      fontFamily: {
        display: ['Tektur_700Bold'],
        'display-sb': ['Tektur_600SemiBold'],
        sans: ['Inter_400Regular'],
        'sans-md': ['Inter_500Medium'],
        'sans-sb': ['Inter_600SemiBold'],
        'sans-b': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
