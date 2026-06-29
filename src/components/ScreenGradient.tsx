import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { colors, pageGradient, splashGradient } from '@/theme/colors';

interface Props {
  children: ReactNode;
  /** 'page' = standard vertical navy; 'splash' = cinematic diagonal hero bg. */
  variant?: 'page' | 'splash';
  /**
   * Optional mode-colored ambient wash anchored at the top of the screen. Pass a
   * hex (e.g. the active mode's accent); it blooms in softly on change so the
   * background can carry per-mode color identity without a harsh fill.
   */
  tint?: string;
}

/** Full-screen deep-navy gradient background (design-system page/hero bg). */
export function ScreenGradient({ children, variant = 'page', tint }: Props) {
  const isSplash = variant === 'splash';
  return (
    <LinearGradient
      colors={isSplash ? splashGradient : pageGradient}
      start={isSplash ? { x: 0.1, y: 0 } : { x: 0, y: 0 }}
      end={isSplash ? { x: 0.7, y: 1 } : { x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {tint ? (
        <Animated.View
          key={tint}
          entering={FadeIn.duration(420)}
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        >
          <LinearGradient
            colors={[`${tint}33`, `${tint}10`, `${colors.bg}00`]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 0.6 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}
      {children}
    </LinearGradient>
  );
}
