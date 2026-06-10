import { Platform, type ViewStyle } from 'react-native';

type GlowIntensity = 'cta' | 'card' | 'soft';

const PRESETS: Record<GlowIntensity, { radius: number; opacity: number }> = {
  cta: { radius: 18, opacity: 0.55 },
  card: { radius: 16, opacity: 0.28 },
  soft: { radius: 10, opacity: 0.2 },
};

/**
 * Colored neon glow (signature effect of the design system).
 *
 * iOS and web render the soft, *colored* shadow from `shadowColor`/`shadowRadius`.
 * Android ignores those props and only honours `elevation`, which draws a gray
 * shadow from the view's outline as a *polygon* — and when the glowing element
 * has a translucent background (as most do here) that polygon shows through the
 * fill as a faceted artifact. Android could never reproduce the colored glow, so
 * we omit elevation there entirely rather than render the artifact.
 */
export function glow(hex: string, intensity: GlowIntensity = 'card'): ViewStyle {
  if (Platform.OS === 'android') return {};
  const p = PRESETS[intensity];
  return {
    shadowColor: hex,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: p.opacity,
    shadowRadius: p.radius,
  };
}
