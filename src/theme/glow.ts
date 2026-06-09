import type { ViewStyle } from 'react-native';

type GlowIntensity = 'cta' | 'card' | 'soft';

const PRESETS: Record<GlowIntensity, { radius: number; opacity: number; elevation: number }> = {
  cta: { radius: 18, opacity: 0.55, elevation: 12 },
  card: { radius: 16, opacity: 0.28, elevation: 8 },
  soft: { radius: 10, opacity: 0.2, elevation: 4 },
};

/**
 * Colored neon glow (signature effect of the design system).
 * iOS uses colored shadow; Android falls back to elevation.
 */
export function glow(hex: string, intensity: GlowIntensity = 'card'): ViewStyle {
  const p = PRESETS[intensity];
  return {
    shadowColor: hex,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: p.opacity,
    shadowRadius: p.radius,
    elevation: p.elevation,
  };
}
