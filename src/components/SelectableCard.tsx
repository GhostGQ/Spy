import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { accentHex, type AccentToken } from '@/theme/colors';

interface Props {
  title: string;
  subtitle?: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
  accent?: AccentToken;
}

export function SelectableCard({
  title,
  subtitle,
  emoji,
  selected,
  onPress,
  accent = 'accent',
}: Props) {
  const hex = accentHex[accent];
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderColor: selected ? hex : '#2E323D',
        backgroundColor: selected ? `${hex}1A` : '#191B22',
      }}
      className="flex-row items-center rounded-2xl border p-4 active:opacity-90"
    >
      {emoji ? <Text className="mr-3 text-2xl">{emoji}</Text> : null}
      <View className="flex-1">
        <Text className="text-base font-bold text-white">{title}</Text>
        {subtitle ? <Text className="mt-0.5 text-xs text-muted">{subtitle}</Text> : null}
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={24} color={hex} />
      ) : (
        <View className="h-6 w-6 rounded-full border-2 border-border" />
      )}
    </Pressable>
  );
}
