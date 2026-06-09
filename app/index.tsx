import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { SpyIllustration } from '@/components/SpyIllustration';
import { colors } from '@/theme/colors';
import { useGameStore } from '@/store/gameStore';

function SecondaryButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      className="flex-1 flex-row items-center justify-center rounded-2xl bg-surface border border-border py-4"
    >
      <Ionicons name={icon} size={20} color={colors.muted} />
      <Text className="ml-2 text-base font-semibold text-muted">{label}</Text>
    </Pressable>
  );
}

export default function MainMenu() {
  const reset = useGameStore((s) => s.reset);

  const startGame = () => {
    reset();
    router.push('/game/setup');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-1 justify-between px-6 py-6">
        {/* Brand / illustration */}
        <View className="flex-1 items-center justify-center">
          <SpyIllustration size={210} />
          <Text className="mt-6 text-5xl font-extrabold tracking-tight text-white">ШПИОН</Text>
          <Text className="mt-2 text-base text-muted">Найди того, кто не знает слова</Text>
        </View>

        {/* Actions */}
        <View>
          <PrimaryButton
            label="Играть"
            icon="play"
            size="lg"
            accent="accent"
            onPress={startGame}
          />
          <View className="mt-3 flex-row gap-3">
            <SecondaryButton icon="book-outline" label="Правила" onPress={() => router.push('/rules')} />
            <SecondaryButton
              icon="settings-outline"
              label="Настройки"
              onPress={() => router.push('/settings')}
            />
          </View>
          <Text className="mt-5 text-center text-xs text-muted">
            Локальная игра · 3–12 игроков · одно устройство
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
