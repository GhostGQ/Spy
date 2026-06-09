import { Minus, Plus } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';

import { accentHex, type AccentToken } from '@/theme/colors';
import { glow } from '@/theme/glow';

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
      style={[
        { opacity: enabled ? 1 : 0.3, backgroundColor: `${hex}22`, borderColor: `${hex}40` },
        enabled ? glow(hex, 'soft') : null,
      ]}
      className="h-12 w-12 items-center justify-center rounded-2xl border active:opacity-70"
    >
      {dir === 1 ? (
        <Plus size={22} color={hex} weight="bold" />
      ) : (
        <Minus size={22} color={hex} weight="bold" />
      )}
    </Pressable>
  );

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 pr-3">
        <Text className="font-sans-sb text-base text-white">{label}</Text>
        {hint ? <Text className="mt-0.5 font-sans text-xs text-muted">{hint}</Text> : null}
      </View>
      <View className="flex-row items-center">
        {btn(-1, canDec)}
        <Text
          style={{ color: hex }}
          className="mx-4 w-8 text-center font-display text-3xl"
        >
          {value}
        </Text>
        {btn(1, canInc)}
      </View>
    </View>
  );
}
