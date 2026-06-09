import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { accentHex, type AccentToken } from '@/theme/colors';

type Variant = 'solid' | 'soft' | 'outline';
type Size = 'lg' | 'md';

interface Props {
  label: string;
  onPress?: () => void;
  accent?: AccentToken;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  className?: string;
}

const withAlpha = (hex: string, alpha: string) => `${hex}${alpha}`;

export function PrimaryButton({
  label,
  onPress,
  accent = 'accent',
  variant = 'solid',
  size = 'md',
  icon,
  disabled,
  className = '',
}: Props) {
  const hex = accentHex[accent];
  const pad = size === 'lg' ? 'py-5 px-6' : 'py-4 px-5';
  const textSize = size === 'lg' ? 'text-xl' : 'text-base';

  const isSolid = variant === 'solid';
  const isSoft = variant === 'soft';

  const bg = isSolid ? hex : isSoft ? withAlpha(hex, '22') : 'transparent';
  const borderColor = variant === 'outline' ? hex : 'transparent';
  const textColor = isSolid ? '#0E0F13' : hex;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: bg,
        borderColor,
        borderWidth: variant === 'outline' ? 2 : 0,
        opacity: disabled ? 0.4 : 1,
      }}
      className={`flex-row items-center justify-center rounded-2xl active:opacity-80 ${pad} ${className}`}
    >
      {icon ? (
        <View className="mr-2">
          <Ionicons name={icon} size={size === 'lg' ? 24 : 20} color={textColor} />
        </View>
      ) : null}
      <Text style={{ color: textColor }} className={`font-bold ${textSize}`}>
        {label}
      </Text>
    </Pressable>
  );
}
