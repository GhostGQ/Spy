import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { RoleCard } from '@/components/RoleCard';
import { ScreenGradient } from '@/components/ScreenGradient';
import { colors } from '@/theme/colors';
import { useGameStore } from '@/store/gameStore';

export default function Roles() {
  const roles = useGameStore((s) => s.roles);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  // The FRONT face keeps showing the role captured at reveal time, frozen while
  // the card flips back, so the next player's word never flashes.
  const [frontRole, setFrontRole] = useState(roles[0]);

  // Guard: roles not dealt (e.g. deep link) → bounce to setup.
  if (roles.length === 0) {
    return (
      <ScreenGradient>
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-center font-sans text-base text-muted">
            Роли ещё не розданы.
          </Text>
          <PrimaryButton label="К созданию игры" onPress={() => router.replace('/game/setup')} />
        </SafeAreaView>
      </ScreenGradient>
    );
  }

  const total = roles.length;
  const role = roles[index];
  const isLast = index === total - 1;

  const onTapCard = () => {
    if (!revealed) {
      setFrontRole(role);
      setRevealed(true);
      return;
    }
    if (isLast) {
      router.replace('/game/timer-setup');
    } else {
      setRevealed(false);
      setIndex((i) => i + 1);
    }
  };

  const hint = !revealed
    ? 'Нажмите на карту, чтобы открыть роль'
    : isLast
      ? 'Нажмите ещё раз, чтобы начать обсуждение'
      : 'Нажмите ещё раз, чтобы скрыть и передать';

  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-5 py-4">
          {/* progress dots */}
          <View className="mb-2 flex-row items-center justify-center gap-1.5">
            {roles.map((r, i) => (
              <View
                key={r.id}
                style={{
                  width: i === index ? 22 : 8,
                  backgroundColor:
                    i < index ? colors.streak : i === index ? colors.accentBright : colors.surface3,
                }}
                className="h-2 rounded-full"
              />
            ))}
          </View>
          <Text className="mb-3 text-center font-sans text-sm text-text-secondary">
            Игрок {index + 1} из {total}
          </Text>

          {/* full-bleed tappable card */}
          <Pressable onPress={onTapCard} className="flex-1">
            <RoleCard role={frontRole} playerNumber={role.player} revealed={revealed} />
          </Pressable>

          {/* tap hint (kept off the card so the card stays clean) */}
          <Text className="mt-4 text-center font-sans text-sm text-muted">{hint}</Text>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}
