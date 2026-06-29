import type { ModeId } from '@/game/types';
import { useGameStore } from '@/store/gameStore';
import { accentHex, colors, type AccentToken } from '@/theme/colors';

/**
 * Per-mode visual identity (data only — no game logic). Single source of truth
 * for the color "world" each mode lives in: the accent token used across its
 * screens, a soft ambient gradient wash for backgrounds, and an `fxKey` that
 * selects the signature micro-animation shown on the selected ModeCard.
 *
 * Kept deliberately restrained ("в меру") — one dominant hue per mode.
 */
export type ModeFxKey = 'ring' | 'swirl' | 'spectral' | 'nodes' | 'scan';

export interface ModeTheme {
  /** Dominant accent token for the mode (cards, glows, CTAs). */
  accent: AccentToken;
  /** Resolved hex of the dominant accent (convenience). */
  hex: string;
  /** Signature selected-state effect for the ModeCard. */
  fxKey: ModeFxKey;
}

export const MODE_THEME: Record<ModeId, ModeTheme> = {
  classic: { accent: 'accent', hex: accentHex.accent, fxKey: 'ring' },
  chaos: { accent: 'cyan', hex: accentHex.cyan, fxKey: 'swirl' },
  ghost: { accent: 'level', hex: accentHex.level, fxKey: 'spectral' },
  syndicate: { accent: 'crimson', hex: accentHex.crimson, fxKey: 'nodes' },
  detective: { accent: 'amber', hex: accentHex.amber, fxKey: 'scan' },
};

/** Dominant accent token for a mode (replaces the old MODE_ACCENT map). */
export function modeAccent(id: ModeId): AccentToken {
  return MODE_THEME[id].accent;
}

/**
 * Live active-mode color for the current game config. Downstream screens use
 * this so the whole UI (cards, buttons, accents) adopts the selected mode's
 * color once it's been chosen.
 */
export function useModeAccent(): { token: AccentToken; hex: string } {
  const mode = useGameStore((s) => s.config.mode);
  const th = MODE_THEME[mode];
  return { token: th.accent, hex: th.hex };
}

/** Resolved dominant hex for a mode. */
export function modeHex(id: ModeId): string {
  return MODE_THEME[id].hex;
}

/**
 * Soft ambient background wash (top-anchored colored glow) for a mode, used by
 * ScreenGradient's `tint` prop. Returns a 3-stop gradient fading to transparent.
 */
export function modeAmbient(id: ModeId): readonly [string, string, string] {
  const hex = MODE_THEME[id].hex;
  return [`${hex}26`, `${hex}0D`, `${colors.bg}00`];
}
