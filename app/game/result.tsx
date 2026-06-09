import { router } from 'expo-router';
import { Detective, Ghost, SkipForward, Trophy, Users, UsersThree } from 'phosphor-react-native';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenGradient } from '@/components/ScreenGradient';
import { getMode } from '@/data/modes';
import type { Winner } from '@/game/types';
import { colors } from '@/theme/colors';
import { glow } from '@/theme/glow';
import { useGameStore } from '@/store/gameStore';

function winnerIcon(key: Winner, color: string) {
  const p = { size: 22, color, weight: 'bold' as const };
  switch (key) {
    case 'civilians':
      return <Users {...p} />;
    case 'majority':
      return <UsersThree {...p} />;
    case 'spies':
      return <Detective {...p} weight="fill" />;
    case 'ghosts':
      return <Ghost {...p} weight="fill" />;
    default:
      return <SkipForward {...p} />;
  }
}

export default function Result() {
  const modeId = useGameStore((s) => s.config.mode);
  const setWinner = useGameStore((s) => s.setWinner);
  const mode = getMode(modeId);

  const choose = (w: Winner) => {
    setWinner(w);
    router.replace('/game/summary');
  };

  return (
    <ScreenGradient variant="splash">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 justify-center px-6">
          <View className="mb-10 items-center">
            <View
              style={[
                { backgroundColor: `${colors.accent}1F`, borderColor: `${colors.accent}40` },
                glow(colors.accent, 'card'),
              ]}
              className="h-24 w-24 items-center justify-center rounded-full border"
            >
              <Trophy size={44} color={colors.accent} weight="fill" />
            </View>
            <Text className="mt-5 font-display text-3xl uppercase text-white">Кто победил?</Text>
            <Text className="mt-2 text-center font-sans text-sm text-text-secondary">
              Обсуждение завершено. Выберите итог раунда.
            </Text>
          </View>

          <View className="gap-3">
            {mode.winners.map((w) => {
              const isSkip = w.key === 'skip';
              const iconColor = isSkip ? colors.muted : '#FFFFFF';
              return (
                <PrimaryButton
                  key={w.key}
                  label={w.label}
                  accent={w.accent}
                  variant={isSkip ? 'outline' : 'solid'}
                  size="lg"
                  iconNode={winnerIcon(w.key, iconColor)}
                  onPress={() => choose(w.key)}
                />
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}
