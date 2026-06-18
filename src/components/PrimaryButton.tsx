import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { accentGradient, accentHex, type AccentToken } from '@/theme/colors';
import { glow } from '@/theme/glow';

type Variant = 'solid' | 'soft' | 'outline';
type Size = 'lg' | 'md';

interface Props {
  label: string;
  onPress?: () => void;
  accent?: AccentToken;
  variant?: Variant;
  size?: Size;
  /** Legacy Ionicons glyph (other screens). Ignored if `iconNode` is set. */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Preferred: a rendered icon node (e.g. Phosphor). */
  iconNode?: ReactNode;
  disabled?: boolean;
  className?: string;
}

const withAlpha = (hex: string, alpha: string) => `${hex}${alpha}`;

/**
 * Pill CTA. Primary (accent === 'accent') renders the blue→cyan gradient with a
 * neon glow; other accents render a solid colored fill; soft/outline are tinted.
 */
export function PrimaryButton({
  label,
  onPress,
  accent = 'accent',
  variant = 'solid',
  size = 'md',
  icon,
  iconNode,
  disabled,
  className = '',
}: Props) {
  const hex = accentHex[accent];
  const pad = size === 'lg' ? 'py-4 px-6' : 'py-3.5 px-5';
  const textSize = size === 'lg' ? 'text-lg' : 'text-base';

  const isSolid = variant === 'solid';
  const isSoft = variant === 'soft';
  // All solid buttons now render a per-accent gradient (was blue-only).
  const isGradient = isSolid;

  const bg = isGradient
    ? 'transparent'
    : isSoft
      ? withAlpha(hex, '22')
      : 'transparent';
  const borderColor = variant === 'outline' ? withAlpha(hex, 'AA') : 'transparent';
  const textColor = isSolid ? '#FFFFFF' : hex;
  const iconSize = size === 'lg' ? 22 : 20;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: bg,
          borderColor,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          opacity: disabled ? 0.4 : 1,
        },
        isSolid && !disabled ? glow(hex, 'cta') : null,
      ]}
      className={`flex-row items-center justify-center overflow-hidden rounded-full active:opacity-80 ${pad} ${className}`}
    >
      {isGradient ? (
        <LinearGradient
          colors={accentGradient[accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      {iconNode ? (
        <View className="mr-2">{iconNode}</View>
      ) : icon ? (
        <View className="mr-2">
          <Ionicons name={icon} size={iconSize} color={textColor} />
        </View>
      ) : null}

      <Text style={{ color: textColor }} className={`font-sans-b ${textSize}`}>
        {label}
      </Text>
    </Pressable>
  );
}
