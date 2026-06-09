/**
 * Палитра приложения. Дублирует значения из tailwind.config.js,
 * чтобы использовать цвета там, где className недоступен
 * (SVG, нативные пропсы, анимации Reanimated).
 */
export const colors = {
  bg: '#0E0F13',
  surface: '#191B22',
  surface2: '#23262F',
  border: '#2E323D',
  muted: '#8A8F9C',
  text: '#F4F5F7',

  accent: '#F5C518', // yellow
  time: '#FF8A3D', // orange
  streak: '#34D27B', // green
  level: '#9B7CFF', // purple
  info: '#3D9BFF', // blue
  danger: '#FF5A5A', // red
} as const;

export type AccentToken = 'accent' | 'time' | 'streak' | 'level' | 'info' | 'danger' | 'muted';

export const accentHex: Record<AccentToken, string> = {
  accent: colors.accent,
  time: colors.time,
  streak: colors.streak,
  level: colors.level,
  info: colors.info,
  danger: colors.danger,
  muted: colors.muted,
};
