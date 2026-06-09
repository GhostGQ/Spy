import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CircularTimer } from '@/components/CircularTimer';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { useGameStore } from '@/store/gameStore';

export default function Timer() {
  const total = useGameStore((s) => s.durationSec);
  const reset = useGameStore((s) => s.reset);
  const [remaining, setRemaining] = useState(total);
  const [paused, setPaused] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const overlayOpen = paused || exitOpen;

  // Countdown — runs while not paused and no overlay is open.
  useEffect(() => {
    if (overlayOpen) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          // time is up → go to result selection
          router.replace('/game/result');
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [overlayOpen]);

  const finishGame = () => router.replace('/game/result');
  const toMenu = () => {
    reset();
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      {/* Minimal screen: timer + pause + exit only */}
      <View className="flex-1 items-center justify-center">
        <CircularTimer remaining={remaining} total={total} />
      </View>

      <View className="flex-row items-center justify-center gap-4 pb-8">
        <Pressable
          onPress={() => setExitOpen(true)}
          className="h-16 w-16 items-center justify-center rounded-full bg-surface border border-border"
        >
          <Ionicons name="exit-outline" size={26} color={colors.danger} />
        </Pressable>

        <Pressable
          onPress={() => setPaused(true)}
          style={{ backgroundColor: colors.accent }}
          className="h-20 w-20 items-center justify-center rounded-full"
        >
          <Ionicons name="pause" size={34} color={colors.bg} />
        </Pressable>
      </View>

      {/* Pause overlay */}
      <Modal visible={paused} transparent animationType="fade" onRequestClose={() => setPaused(false)}>
        <View className="flex-1 items-center justify-center bg-black/70 px-8">
          <View className="w-full rounded-3xl bg-surface border border-border p-6">
            <View className="mb-5 items-center">
              <Ionicons name="pause-circle" size={48} color={colors.accent} />
              <Text className="mt-2 text-2xl font-extrabold text-white">Пауза</Text>
              <Text className="mt-1 text-sm text-muted">Таймер остановлен</Text>
            </View>
            <PrimaryButton
              label="Продолжить игру"
              icon="play"
              accent="streak"
              onPress={() => setPaused(false)}
            />
            <View className="h-3" />
            <PrimaryButton
              label="Завершить игру"
              icon="flag"
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
          <View className="w-full rounded-3xl bg-surface border border-border p-6">
            <View className="mb-5 items-center">
              <Ionicons name="exit" size={48} color={colors.danger} />
              <Text className="mt-2 text-2xl font-extrabold text-white">Выйти в меню?</Text>
              <Text className="mt-1 text-center text-sm text-muted">
                Текущая партия будет прервана без подведения итогов.
              </Text>
            </View>
            <PrimaryButton
              label="Остаться"
              icon="arrow-back"
              accent="streak"
              onPress={() => setExitOpen(false)}
            />
            <View className="h-3" />
            <PrimaryButton label="В главное меню" icon="home" accent="danger" variant="soft" onPress={toMenu} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
