/**
 * Палитра приложения (gaming-дизайн-система).
 * Дублирует значения из tailwind.config.js, чтобы использовать цвета там, где
 * className недоступен (SVG, нативные пропсы, анимации Reanimated, градиенты).
 */
export const colors = {
  // Neutral near-black noir base. The app is monochrome until a mode is chosen,
  // then downstream screens are tinted by the mode's color.
  bg: '#0A0A0C',
  bgElevated: '#121216',
  surface: '#17171C',
  surface2: '#1F1F25',
  surface3: '#292930',
  border: '#292930',
  borderSubtle: 'rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.06)',
  muted: '#7C7F8B',
  text: '#FFFFFF',
  textSecondary: '#C2C4CE',

  // Neutral "steel" accent for pre-mode (menu) chrome — desaturated noir silver.
  steel: '#6E7689',
  steelBright: '#A6ADBE',

  // Accents (token names kept; values from design system)
  accent: '#3B82F6', // electric blue — primary
  accentBright: '#60A5FA',
  cyan: '#2DD4F7',
  premium: '#C9A227', // champagne gold — premium / purchases
  premiumLight: '#E6C868',
  level: '#8B5CF6', // purple — ghost role identity
  info: '#60A5FA',
  streak: '#34D399', // green
  danger: '#F87171', // red
  time: '#FB923C', // orange (legacy)
  star: '#FBBF24',

  // Redesign tokens — noir-spy + spectral.
  amber: '#F5B43C', // classified-dossier gold (detective + warm signature)
  amberBright: '#FBD27A',
  spectral: '#5EEAD4', // ghostly teal-green shimmer (paired with purple)
  crimson: '#EF4444', // deeper syndicate red
} as const;

/** Page background gradient (top → bottom) — neutral noir black-gray. */
export const pageGradient = ['#121216', '#0A0A0C'] as const;
/** Cinematic hero/splash gradient (diagonal, neutral charcoal). */
export const splashGradient = ['#16161B', '#0A0A0C', '#0E0E13'] as const;
/** Primary CTA gradient (left → right). */
export const ctaGradient = ['#3B82F6', '#2DD4F7'] as const;
/** Secondary CTA gradient. */
export const ctaPurpleGradient = ['#4F46E5', '#6D28D9'] as const;

export type AccentToken =
  | 'accent'
  | 'accentBright'
  | 'cyan'
  | 'premium'
  | 'premiumLight'
  | 'level'
  | 'info'
  | 'streak'
  | 'danger'
  | 'time'
  | 'amber'
  | 'amberBright'
  | 'spectral'
  | 'crimson'
  | 'steel'
  | 'steelBright'
  | 'star'
  | 'muted';

export const accentHex: Record<AccentToken, string> = {
  accent: colors.accent,
  accentBright: colors.accentBright,
  cyan: colors.cyan,
  premium: colors.premium,
  premiumLight: colors.premiumLight,
  level: colors.level,
  info: colors.info,
  streak: colors.streak,
  danger: colors.danger,
  time: colors.time,
  amber: colors.amber,
  amberBright: colors.amberBright,
  spectral: colors.spectral,
  crimson: colors.crimson,
  steel: colors.steel,
  steelBright: colors.steelBright,
  star: colors.star,
  muted: colors.muted,
};

/** Append an 8-bit alpha (e.g. '1F', '40') to a 6-digit hex color. */
export const withAlpha = (hex: string, alpha: string) => `${hex}${alpha}`;

/**
 * Two-stop gradient per accent (left → right) for solid CTAs, so buttons in a
 * mode's color world read richer than a flat fill. `accent` keeps the signature
 * blue→cyan; others go bright→deep within the same hue.
 */
export const accentGradient: Record<AccentToken, readonly [string, string]> = {
  accent: ['#3B82F6', '#2DD4F7'],
  accentBright: ['#93C5FD', '#3B82F6'],
  cyan: ['#67E8F9', '#22B8D9'],
  premium: ['#E0BE5C', '#A6801A'],
  premiumLight: ['#F0D88A', '#C9A227'],
  level: ['#A78BFA', '#7C3AED'],
  info: ['#93C5FD', '#3B82F6'],
  streak: ['#5EEAD4', '#10B981'],
  danger: ['#FB9C9C', '#EF4444'],
  time: ['#FDBA74', '#F97316'],
  amber: ['#FBD27A', '#E89A1C'],
  amberBright: ['#FDE6B0', '#F5B43C'],
  spectral: ['#9CF6E6', '#2DD4BF'],
  crimson: ['#F87171', '#DC2626'],
  steel: ['#8B93A7', '#5A6175'],
  steelBright: ['#C2C8D6', '#8B93A7'],
  star: ['#FDE68A', '#F59E0B'],
  muted: ['#8089A8', '#5B6485'],
};
