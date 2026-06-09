import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';

import { pageGradient, splashGradient } from '@/theme/colors';

interface Props {
  children: ReactNode;
  /** 'page' = standard vertical navy; 'splash' = cinematic diagonal hero bg. */
  variant?: 'page' | 'splash';
}

/** Full-screen deep-navy gradient background (design-system page/hero bg). */
export function ScreenGradient({ children, variant = 'page' }: Props) {
  const isSplash = variant === 'splash';
  return (
    <LinearGradient
      colors={isSplash ? splashGradient : pageGradient}
      start={isSplash ? { x: 0.1, y: 0 } : { x: 0, y: 0 }}
      end={isSplash ? { x: 0.7, y: 1 } : { x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
