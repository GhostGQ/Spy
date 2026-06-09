import type { ReactNode } from 'react';
import { View } from 'react-native';

import { colors } from '@/theme/colors';

interface Props {
  children: ReactNode;
  className?: string;
}

/** Glassy surface card (design-system). */
export function Card({ children, className = '' }: Props) {
  return (
    <View
      style={{ borderColor: colors.borderSubtle }}
      className={`rounded-3xl bg-surface border p-5 ${className}`}
    >
      {children}
    </View>
  );
}
