/**
 * Палитра приложения (gaming-дизайн-система).
 * Дублирует значения из tailwind.config.js, чтобы использовать цвета там, где
 * className недоступен (SVG, нативные пропсы, анимации Reanimated, градиенты).
 */
export const colors = {
  // Dark navy/indigo base
  bg: '#13152E',
  bgElevated: '#1A1D3A',
  surface: '#1E2248',
  surface2: '#252A52',
  surface3: '#2A2F5A',
  border: '#2A2F5A',
  borderSubtle: 'rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.06)',
  muted: '#6B7394',
  text: '#FFFFFF',
  textSecondary: '#B8BDD8',

  // Accents (token names kept; values from design system)
  accent: '#3B82F6', // electric blue — primary
  accentBright: '#60A5FA',
  cyan: '#2DD4F7',
  purple: '#7C3AED',
  purpleLight: '#A78BFA',
  level: '#8B5CF6', // purple
  info: '#60A5FA',
  streak: '#34D399', // green
  danger: '#F87171', // red
  time: '#FB923C', // orange (legacy)
  star: '#FBBF24',
} as const;

/** Page background gradient (top → bottom). */
export const pageGradient = ['#1A1D3A', '#13152E'] as const;
/** Primary CTA gradient (left → right). */
export const ctaGradient = ['#3B82F6', '#2DD4F7'] as const;
/** Secondary CTA gradient. */
export const ctaPurpleGradient = ['#4F46E5', '#6D28D9'] as const;

export type AccentToken =
  | 'accent'
  | 'accentBright'
  | 'cyan'
  | 'purple'
  | 'level'
  | 'info'
  | 'streak'
  | 'danger'
  | 'time'
  | 'muted';

export const accentHex: Record<AccentToken, string> = {
  accent: colors.accent,
  accentBright: colors.accentBright,
  cyan: colors.cyan,
  purple: colors.purple,
  level: colors.level,
  info: colors.info,
  streak: colors.streak,
  danger: colors.danger,
  time: colors.time,
  muted: colors.muted,
};
