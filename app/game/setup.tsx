import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SelectableCard } from '@/components/SelectableCard';
import { Stepper } from '@/components/Stepper';
import { MODES, getMode } from '@/data/modes';
import { maxSpecialMajority } from '@/game/roles';
import { useGameStore } from '@/store/gameStore';

function Label({ children }: { children: string }) {
  return (
    <Text className="mb-2 mt-5 text-xs font-bold uppercase tracking-widest text-muted">
      {children}
    </Text>
  );
}

export default function Setup() {
  const config = useGameStore((s) => s.config);
  const setMode = useGameStore((s) => s.setMode);
  const setPlayerCount = useGameStore((s) => s.setPlayerCount);
  const setSpecialCount = useGameStore((s) => s.setSpecialCount);

  const mode = getMode(config.mode);
  const maxSpecial = maxSpecialMajority(config.playerCount);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-1 px-6 pt-4">
        <ScreenHeader title="Создание игры" subtitle="Настройте партию" onBack={() => router.back()} />

        <View className="flex-1">
          <Label>Режим</Label>
          <View className="gap-2">
            {MODES.map((m) => (
              <SelectableCard
                key={m.id}
                title={m.title}
                subtitle={m.short}
                emoji={m.emoji}
                selected={config.mode === m.id}
                onPress={() => setMode(m.id)}
                accent="accent"
              />
            ))}
          </View>

          <Label>Игроки</Label>
          <View className="rounded-2xl bg-surface border border-border p-4">
            <Stepper
              label="Количество игроков"
              value={config.playerCount}
              onChange={setPlayerCount}
              min={3}
              max={12}
              accent="level"
            />
          </View>

          <Label>Дополнительно</Label>
          {mode.configurableSpecialCount ? (
            <View className="rounded-2xl bg-surface border border-border p-4">
              <Stepper
                label={mode.specialCountLabel}
                hint={`Максимум ${maxSpecial} — мирные всегда в большинстве`}
                value={Math.min(config.specialCount, maxSpecial)}
                onChange={setSpecialCount}
                min={1}
                max={maxSpecial}
                accent="danger"
              />
            </View>
          ) : (
            <View className="rounded-2xl bg-surface border border-border p-4">
              <Text className="text-sm leading-6 text-muted">
                🌀 В режиме «Хаос» количество шпионов скрыто и определится случайно при старте.
              </Text>
            </View>
          )}
        </View>

        <View className="pb-2 pt-3">
          <PrimaryButton
            label="Выбрать категорию"
            icon="arrow-forward"
            size="lg"
            onPress={() => router.push('/game/categories')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
