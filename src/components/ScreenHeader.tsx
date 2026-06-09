import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function ScreenHeader({ title, subtitle, onBack, showBack = true }: Props) {
  return (
    <View className="mb-6 flex-row items-center">
      {showBack ? (
        <Pressable
          onPress={onBack ?? (() => router.back())}
          hitSlop={12}
          className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-surface border border-border"
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
      ) : null}
      <View className="flex-1">
        <Text className="text-2xl font-extrabold text-white">{title}</Text>
        {subtitle ? <Text className="mt-0.5 text-sm text-muted">{subtitle}</Text> : null}
      </View>
    </View>
  );
}
