import { router } from 'expo-router';
import { ArrowsClockwise, GameController, Ghost, House, Key, SkipForward, Trophy, User } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenGradient } from '@/components/ScreenGradient';
import { CategoryIcon } from '@/components/icons/CategoryIcon';
import { GhostIcon, ModeIcon, SpyIcon } from '@/components/icons/ModeIcons';
import { getCategory } from '@/data/categories';
import { getMode } from '@/data/modes';
import type { Role } from '@/game/types';
import { colors } from '@/theme/colors';
import { glow } from '@/theme/glow';
import { useGameStore } from '@/store/gameStore';

const KIND_META: Record<Role['kind'], { label: string; color: string }> = {
  civilian: { label: 'Мирный', color: colors.streak },
  spy: { label: 'Шпион', color: colors.danger },
  ghost: { label: 'Призрак', color: colors.level },
};

function roleIcon(kind: Role['kind'], color: string) {
  if (kind === 'spy') return <SpyIcon size={20} color={color} />;
  if (kind === 'ghost') return <GhostIcon size={20} color={color} />;
  return <User size={20} color={color} weight="bold" />;
}

function InfoRow({ icon, label, value, valueNode }: { icon: ReactNode; label: string; value?: string; valueNode?: ReactNode }) {
  return (
    <View className="flex-row items-center py-2.5">
      {icon}
      <Text className="ml-2 flex-1 font-sans text-sm text-muted">{label}</Text>
      {valueNode ?? <Text className="font-sans-b text-base text-white">{value}</Text>}
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
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-6 pt-4">
          <Text className="mb-1 text-center font-display text-3xl uppercase text-white">
            Итоги партии
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            {/* Winner banner */}
            {showWinner ? (
              <View
                style={[
                  { backgroundColor: `${colors.accent}1A`, borderColor: colors.accent },
                  glow(colors.accent, 'card'),
                ]}
                className="mt-4 items-center rounded-3xl border p-5"
              >
                <Trophy size={34} color={colors.accent} weight="fill" />
                <Text style={{ color: colors.accent }} className="mt-2 font-display text-xl uppercase">
                  {winnerOption!.label}
                </Text>
              </View>
            ) : (
              <View
                style={{ borderColor: colors.borderSubtle }}
                className="mt-4 items-center rounded-3xl border bg-surface p-5"
              >
                <SkipForward size={28} color={colors.muted} weight="fill" />
                <Text className="mt-2 font-sans-sb text-base text-muted">Победитель не выбран</Text>
              </View>
            )}

            {/* Round info */}
            <Card className="mt-4">
              <InfoRow
                icon={<GameController size={18} color={colors.muted} weight="bold" />}
                label="Режим"
                valueNode={
                  <View className="flex-row items-center">
                    <ModeIcon name={mode.iconKey} size={18} color={colors.accentBright} />
                    <Text className="ml-1.5 font-sans-b text-base text-white">{mode.title}</Text>
                  </View>
                }
              />
              <View style={{ backgroundColor: colors.divider }} className="h-px" />
              <InfoRow
                icon={<CategoryIcon id={category.id} size={18} color={colors.muted} />}
                label="Категория"
                valueNode={
                  <View className="flex-row items-center">
                    <CategoryIcon id={category.id} size={18} color={colors.accentBright} />
                    <Text className="ml-1.5 font-sans-b text-base text-white">{category.title}</Text>
                  </View>
                }
              />
              <View style={{ backgroundColor: colors.divider }} className="h-px" />
              <InfoRow icon={<Key size={18} color={colors.muted} weight="bold" />} label="Загаданное слово" value={word} />
              {config.mode === 'ghost' && fakeWord ? (
                <>
                  <View style={{ backgroundColor: colors.divider }} className="h-px" />
                  <InfoRow icon={<Ghost size={18} color={colors.muted} weight="fill" />} label="Слово призраков" value={fakeWord} />
                </>
              ) : null}
            </Card>

            {/* Roles list */}
            <Text className="mb-2 mt-5 px-1 font-display text-xs uppercase tracking-widest text-muted">
              Роли игроков
            </Text>
            <Card>
              {roles.map((r, i) => {
                const meta = KIND_META[r.kind];
                return (
                  <View key={r.id}>
                    {i > 0 ? <View style={{ backgroundColor: colors.divider }} className="h-px" /> : null}
                    <View className="flex-row items-center py-3">
                      <View
                        style={{ backgroundColor: `${meta.color}1F`, borderColor: `${meta.color}40` }}
                        className="mr-3 h-10 w-10 items-center justify-center rounded-2xl border"
                      >
                        {roleIcon(r.kind, meta.color)}
                      </View>
                      <Text className="flex-1 font-sans-sb text-base text-white">Игрок {r.player}</Text>
                      <Text style={{ color: meta.color }} className="font-sans-b text-base">
                        {meta.label}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </Card>
          </ScrollView>

          <View className="pb-4 pt-2">
            <PrimaryButton
              label="Сыграть ещё раз"
              iconNode={<ArrowsClockwise size={22} color="#FFFFFF" weight="bold" />}
              size="lg"
              accent="accent"
              onPress={onPlayAgain}
            />
            <View className="h-3" />
            <PrimaryButton
              label="Главное меню"
              iconNode={<House size={20} color={colors.accentBright} weight="bold" />}
              variant="soft"
              accent="info"
              onPress={onMenu}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}
