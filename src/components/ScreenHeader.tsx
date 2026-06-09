import { router } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
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
          style={{ backgroundColor: colors.surface, borderColor: colors.borderSubtle }}
          className="mr-3 h-11 w-11 items-center justify-center rounded-full border active:opacity-80"
        >
          <CaretLeft size={22} color={colors.textSecondary} weight="bold" />
        </Pressable>
      ) : null}
      <View className="flex-1">
        <Text className="font-display text-2xl uppercase tracking-wide text-white">{title}</Text>
        {subtitle ? (
          <Text className="mt-0.5 font-sans text-sm text-text-secondary">{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}
