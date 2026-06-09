import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { RoleCard } from '@/components/RoleCard';
import { colors } from '@/theme/colors';
import { useGameStore } from '@/store/gameStore';

export default function Roles() {
  const roles = useGameStore((s) => s.roles);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  // Guard: roles not dealt (e.g. deep link) → bounce to setup.
  if (roles.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="mb-4 text-center text-base text-muted">Роли ещё не розданы.</Text>
        <PrimaryButton label="К созданию игры" onPress={() => router.replace('/game/setup')} />
      </SafeAreaView>
    );
  }

  const total = roles.length;
  const role = roles[index];
  const isLast = index === total - 1;

  // The FRONT face keeps showing the role captured at reveal time. This stays
  // frozen while the card flips back, so the next player's word never flashes.
  const [frontRole, setFrontRole] = useState(roles[0]);

  const onTapCard = () => {
    if (!revealed) {
      setFrontRole(role);
      setRevealed(true);
      return;
    }
    // hide & pass to next (or move on after the last player)
    if (isLast) {
      router.replace('/game/timer-setup');
    } else {
      // Back face switches to the next player immediately; the front face keeps
      // `frontRole` (the player who just looked) until the next reveal.
      setRevealed(false);
      setIndex((i) => i + 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-1 px-5 py-4">
        {/* progress dots */}
        <View className="mb-2 flex-row items-center justify-center gap-1.5">
          {roles.map((r, i) => (
            <View
              key={r.id}
              style={{
                width: i === index ? 22 : 8,
                backgroundColor:
                  i < index ? colors.streak : i === index ? colors.accent : colors.surface2,
              }}
              className="h-2 rounded-full"
            />
          ))}
        </View>
        <Text className="mb-3 text-center text-sm text-muted">
          Игрок {index + 1} из {total}
        </Text>

        {/* full-bleed tappable card */}
        <Pressable onPress={onTapCard} className="flex-1">
          <RoleCard role={frontRole} playerNumber={role.player} revealed={revealed} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
