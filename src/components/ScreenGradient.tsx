import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';

import { pageGradient } from '@/theme/colors';

/**
 * Full-screen deep-navy page gradient background (design-system page bg).
 * Wrap a screen's root in this.
 */
export function ScreenGradient({ children }: { children: ReactNode }) {
  return (
    <LinearGradient
      colors={pageGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
