import { router } from 'expo-router';
import { ArrowRight } from 'phosphor-react-native';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenGradient } from '@/components/ScreenGradient';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SelectableCard } from '@/components/SelectableCard';
import { Stepper } from '@/components/Stepper';
import { ChaosIcon, ModeIcon } from '@/components/icons/ModeIcons';
import { MODES, getMode } from '@/data/modes';
import { maxSpecialMajority } from '@/game/roles';
import type { ModeId } from '@/game/types';
import { useGameStore } from '@/store/gameStore';
import { accentHex, colors, type AccentToken } from '@/theme/colors';

/** Distinct accent per mode for a livelier, gaming feel. */
const MODE_ACCENT: Record<ModeId, AccentToken> = {
  classic: 'accent',
  chaos: 'cyan',
  ghost: 'level',
};

function Label({ children }: { children: string }) {
  return (
    <Text className="mb-2 mt-5 font-display text-[13px] uppercase tracking-widest text-muted">
      {children}
    </Text>
  );
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{ backgroundColor: colors.surface, borderColor: colors.borderSubtle }}
      className="rounded-2xl border p-4"
    >
      {children}
    </View>
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
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-6 pt-4">
          <ScreenHeader
            title="Создание игры"
            subtitle="Настройте партию"
            onBack={() => router.back()}
          />

          <View className="flex-1">
            <Label>Режим</Label>
            <View className="gap-2.5">
              {MODES.map((m) => {
                const selected = config.mode === m.id;
                const acc = MODE_ACCENT[m.id];
                return (
                  <SelectableCard
                    key={m.id}
                    title={m.title}
                    subtitle={m.short}
                    selected={selected}
                    onPress={() => setMode(m.id)}
                    accent={acc}
                    icon={
                      <ModeIcon
                        name={m.iconKey}
                        size={26}
                        color={selected ? accentHex[acc] : colors.textSecondary}
                      />
                    }
                  />
                );
              })}
            </View>

            <Label>Игроки</Label>
            <GlassCard>
              <Stepper
                label="Количество игроков"
                value={config.playerCount}
                onChange={setPlayerCount}
                min={3}
                max={12}
                accent="level"
              />
            </GlassCard>

            <Label>Дополнительно</Label>
            {mode.configurableSpecialCount ? (
              <GlassCard>
                <Stepper
                  label={mode.specialCountLabel}
                  value={Math.min(config.specialCount, maxSpecial)}
                  onChange={setSpecialCount}
                  min={1}
                  max={maxSpecial}
                  accent="accent"
                />
              </GlassCard>
            ) : (
              <GlassCard>
                <View className="flex-row items-center">
                  <View
                    style={{ backgroundColor: `${colors.cyan}1F`, borderColor: `${colors.cyan}33` }}
                    className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border"
                  >
                    <ChaosIcon size={24} color={colors.cyan} />
                  </View>
                  <Text className="flex-1 font-sans text-sm leading-6 text-text-secondary">
                    В режиме «Хаос» количество шпионов скрыто и определится случайно при старте.
                  </Text>
                </View>
              </GlassCard>
            )}
          </View>

          <View className="pb-2 pt-3">
            <PrimaryButton
              label="Выбрать категорию"
              iconNode={<ArrowRight size={22} color="#FFFFFF" weight="bold" />}
              size="lg"
              onPress={() => router.push('/game/categories')}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}
