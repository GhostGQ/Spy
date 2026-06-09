import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { getCategory } from '@/data/categories';
import { getMode } from '@/data/modes';
import type { Role } from '@/game/types';
import { colors } from '@/theme/colors';
import { useGameStore } from '@/store/gameStore';

const KIND_META: Record<Role['kind'], { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  civilian: { label: 'Мирный', color: colors.streak, icon: 'person' },
  spy: { label: 'Шпион', color: colors.danger, icon: 'eye-off' },
  ghost: { label: 'Призрак', color: colors.level, icon: 'sparkles' },
};

function InfoRow({ label, value, icon }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View className="flex-row items-center py-2">
      <Ionicons name={icon} size={18} color={colors.muted} />
      <Text className="ml-2 flex-1 text-sm text-muted">{label}</Text>
      <Text className="text-base font-bold text-white">{value}</Text>
    </View>
  );
}

export default function Summary() {
  const config = useGameStore((s) => s.config);
  const roles = useGameStore((s) => s.roles);
  const word = useGameStore((s) => s.word);
  const fakeWord = useGameStore((s) => s.fakeWord);
  const roundCategoryId = useGameStore((s) => s.roundCategoryId);
  const winner = useGameStore((s) => s.winner);
  const playAgain = useGameStore((s) => s.playAgain);
  const reset = useGameStore((s) => s.reset);

  const mode = getMode(config.mode);
  const category = getCategory(roundCategoryId || config.categoryIds[0]);
  const winnerOption = winner ? mode.winners.find((w) => w.key === winner) : undefined;
  const showWinner = winner && winner !== 'skip' && winnerOption;

  const onPlayAgain = () => {
    playAgain();
    router.replace('/game/roles');
  };
  const onMenu = () => {
    reset();
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-1 px-6 pt-4">
        <Text className="mb-1 text-center text-3xl font-extrabold text-white">Итоги партии</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
          {/* Winner banner */}
          {showWinner ? (
            <View
              style={{ backgroundColor: `${colors.accent}1A`, borderColor: colors.accent }}
              className="mt-4 items-center rounded-3xl border p-5"
            >
              <Ionicons name="trophy" size={32} color={colors.accent} />
              <Text style={{ color: colors.accent }} className="mt-2 text-xl font-extrabold">
                {winnerOption!.label}
              </Text>
            </View>
          ) : (
            <View className="mt-4 items-center rounded-3xl border border-border bg-surface p-5">
              <Ionicons name="play-skip-forward" size={28} color={colors.muted} />
              <Text className="mt-2 text-base font-semibold text-muted">Победитель не выбран</Text>
            </View>
          )}

          {/* Round info */}
          <Card className="mt-4">
            <InfoRow label="Режим" value={`${mode.emoji} ${mode.title}`} icon="game-controller-outline" />
            <View className="h-px bg-border" />
            <InfoRow label="Категория" value={`${category.emoji} ${category.title}`} icon="albums-outline" />
            <View className="h-px bg-border" />
            <InfoRow label="Загаданное слово" value={word} icon="key-outline" />
            {config.mode === 'ghost' && fakeWord ? (
              <>
                <View className="h-px bg-border" />
                <InfoRow label="Слово призраков" value={fakeWord} icon="sparkles-outline" />
              </>
            ) : null}
          </Card>

          {/* Roles list */}
          <Text className="mb-2 mt-5 px-1 text-xs font-bold uppercase tracking-widest text-muted">
            Роли игроков
          </Text>
          <Card>
            {roles.map((r, i) => {
              const meta = KIND_META[r.kind];
              return (
                <View key={r.id}>
                  {i > 0 ? <View className="h-px bg-border" /> : null}
                  <View className="flex-row items-center py-3">
                    <View
                      style={{ backgroundColor: `${meta.color}22` }}
                      className="mr-3 h-10 w-10 items-center justify-center rounded-2xl"
                    >
                      <Ionicons name={meta.icon} size={20} color={meta.color} />
                    </View>
                    <Text className="flex-1 text-base font-semibold text-white">Игрок {r.player}</Text>
                    <Text style={{ color: meta.color }} className="text-base font-bold">
                      {meta.label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </Card>
        </ScrollView>

        <View className="pb-4 pt-2">
          <PrimaryButton label="Сыграть ещё раз" icon="refresh" size="lg" accent="accent" onPress={onPlayAgain} />
          <View className="h-3" />
          <PrimaryButton label="Главное меню" icon="home" variant="soft" accent="info" onPress={onMenu} />
        </View>
      </View>
    </SafeAreaView>
  );
}
