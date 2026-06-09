import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { accentHex, type AccentToken } from '@/theme/colors';

interface Props {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  accent?: AccentToken;
  hint?: string;
}

export function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  accent = 'accent',
  hint,
}: Props) {
  const hex = accentHex[accent];
  const canDec = value > min;
  const canInc = value < max;

  const btn = (dir: -1 | 1, enabled: boolean) => (
    <Pressable
      disabled={!enabled}
      onPress={() => onChange(value + dir)}
      style={{ opacity: enabled ? 1 : 0.3, backgroundColor: `${hex}22` }}
      className="h-12 w-12 items-center justify-center rounded-2xl active:opacity-70"
    >
      <Ionicons name={dir === 1 ? 'add' : 'remove'} size={24} color={hex} />
    </Pressable>
  );

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 pr-3">
        <Text className="text-base font-semibold text-white">{label}</Text>
        {hint ? <Text className="mt-0.5 text-xs text-muted">{hint}</Text> : null}
      </View>
      <View className="flex-row items-center">
        {btn(-1, canDec)}
        <Text className="mx-4 w-8 text-center text-2xl font-extrabold text-white">{value}</Text>
        {btn(1, canInc)}
      </View>
    </View>
  );
}
