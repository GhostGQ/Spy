import type { ReactNode } from 'react';
import { View } from 'react-native';

interface Props {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: Props) {
  return (
    <View className={`rounded-3xl bg-surface border border-border p-5 ${className}`}>
      {children}
    </View>
  );
}
