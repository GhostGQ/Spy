import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { getMode } from '@/data/modes';
import type { Winner } from '@/game/types';
import { colors } from '@/theme/colors';
import { useGameStore } from '@/store/gameStore';

export default function Result() {
  const modeId = useGameStore((s) => s.config.mode);
  const setWinner = useGameStore((s) => s.setWinner);
  const mode = getMode(modeId);

  const choose = (w: Winner) => {
    setWinner(w);
    router.replace('/game/summary');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center px-6">
        <View className="mb-8 items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-surface border border-border">
            <Ionicons name="trophy" size={40} color={colors.accent} />
          </View>
          <Text className="mt-4 text-3xl font-extrabold text-white">Кто победил?</Text>
          <Text className="mt-2 text-center text-sm text-muted">
            Обсуждение завершено. Выберите итог раунда.
          </Text>
        </View>

        <View className="gap-3">
          {mode.winners.map((w) => (
            <PrimaryButton
              key={w.key}
              label={w.label}
              accent={w.accent}
              variant={w.key === 'skip' ? 'outline' : 'solid'}
              size="lg"
              icon={w.key === 'skip' ? 'play-skip-forward' : 'ribbon'}
              onPress={() => choose(w.key)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
