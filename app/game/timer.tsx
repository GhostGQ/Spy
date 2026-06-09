import { router } from 'expo-router';
import { Flag, House, Pause, PauseCircle, Play, SignOut } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CircularTimer } from '@/components/CircularTimer';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenGradient } from '@/components/ScreenGradient';
import { hapticNotify } from '@/lib/haptics';
import { colors } from '@/theme/colors';
import { glow } from '@/theme/glow';
import { useGameStore } from '@/store/gameStore';

export default function Timer() {
  const total = useGameStore((s) => s.durationSec);
  const reset = useGameStore((s) => s.reset);
  const [remaining, setRemaining] = useState(total);
  const [paused, setPaused] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const overlayOpen = paused || exitOpen;

  // Countdown — runs while no overlay is open. The updater stays pure (just
  // decrements); navigation happens in the effect below once it reaches 0.
  useEffect(() => {
    if (overlayOpen) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => (r <= 1 ? 0 : r - 1));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [overlayOpen]);

  // Navigate to the result screen when the countdown hits 0 (side effect, not
  // inside render or a state updater).
  useEffect(() => {
    if (remaining <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      hapticNotify('warning');
      router.replace('/game/result');
    }
  }, [remaining]);

  const finishGame = () => router.replace('/game/result');
  const toMenu = () => {
    reset();
    router.replace('/');
  };

  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        {/* Minimal screen: timer + pause + exit only */}
        <View className="flex-1 items-center justify-center">
          <CircularTimer remaining={remaining} total={total} />
        </View>

        <View className="flex-row items-center justify-center gap-5 pb-10">
          <Pressable
            onPress={() => setExitOpen(true)}
            style={{ backgroundColor: colors.surface, borderColor: colors.borderSubtle }}
            className="h-16 w-16 items-center justify-center rounded-full border active:opacity-80"
          >
            <SignOut size={26} color={colors.danger} weight="bold" />
          </Pressable>

          <Pressable
            onPress={() => setPaused(true)}
            style={[{ backgroundColor: colors.accent }, glow(colors.accent, 'cta')]}
            className="h-20 w-20 items-center justify-center rounded-full active:opacity-90"
          >
            <Pause size={34} color="#FFFFFF" weight="fill" />
          </Pressable>
        </View>

        {/* Pause overlay */}
        <Modal visible={paused} transparent animationType="fade" onRequestClose={() => setPaused(false)}>
          <View className="flex-1 items-center justify-center bg-black/70 px-8">
            <View
              style={{ borderColor: colors.borderSubtle }}
              className="w-full rounded-3xl border bg-surface p-6"
            >
              <View className="mb-5 items-center">
                <PauseCircle size={48} color={colors.accent} weight="fill" />
                <Text className="mt-2 font-display text-2xl uppercase text-white">Пауза</Text>
                <Text className="mt-1 font-sans text-sm text-muted">Таймер остановлен</Text>
              </View>
              <PrimaryButton
                label="Продолжить игру"
                iconNode={<Play size={20} color="#FFFFFF" weight="fill" />}
                accent="streak"
                onPress={() => setPaused(false)}
              />
              <View className="h-3" />
              <PrimaryButton
                label="Завершить игру"
                iconNode={<Flag size={20} color={colors.danger} weight="fill" />}
                accent="danger"
                variant="soft"
                onPress={finishGame}
              />
            </View>
          </View>
        </Modal>

        {/* Exit confirm overlay */}
        <Modal visible={exitOpen} transparent animationType="fade" onRequestClose={() => setExitOpen(false)}>
          <View className="flex-1 items-center justify-center bg-black/70 px-8">
            <View
              style={{ borderColor: colors.borderSubtle }}
              className="w-full rounded-3xl border bg-surface p-6"
            >
              <View className="mb-5 items-center">
                <SignOut size={44} color={colors.danger} weight="bold" />
                <Text className="mt-2 font-display text-2xl uppercase text-white">Выйти в меню?</Text>
                <Text className="mt-1 text-center font-sans text-sm text-muted">
                  Текущая партия будет прервана без подведения итогов.
                </Text>
              </View>
              <PrimaryButton
                label="Остаться"
                iconNode={<Play size={20} color="#FFFFFF" weight="fill" />}
                accent="streak"
                onPress={() => setExitOpen(false)}
              />
              <View className="h-3" />
              <PrimaryButton
                label="В главное меню"
                iconNode={<House size={20} color={colors.danger} weight="bold" />}
                accent="danger"
                variant="soft"
                onPress={toMenu}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScreenGradient>
  );
}
