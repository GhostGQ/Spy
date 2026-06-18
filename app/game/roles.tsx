import { router } from 'expo-router';
import { CaretLeft, House, Play } from 'phosphor-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/BottomSheet';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RoleCard } from '@/components/RoleCard';
import { ScreenGradient } from '@/components/ScreenGradient';
import { hapticImpact, hapticSelection } from '@/lib/haptics';
import { colors } from '@/theme/colors';
import { useGameStore } from '@/store/gameStore';

export default function Roles() {
  const { t } = useTranslation();
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
            {t('roles.notDealt')}
          </Text>
          <PrimaryButton label={t('roles.toSetup')} onPress={() => router.replace('/game/setup')} />
        </SafeAreaView>
      </ScreenGradient>
    );
  }

  const [doneOpen, setDoneOpen] = useState(false);

  const total = roles.length;
  const role = roles[index];
  const isLast = index === total - 1;

  const onTapCard = () => {
    if (!revealed) {
      hapticImpact();
      setFrontRole(role);
      setRevealed(true);
      return;
    }
    hapticSelection();
    setRevealed(false);
    if (isLast) {
      setDoneOpen(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const onBackToSetup = () => {
    hapticSelection();
    router.replace('/game/setup');
  };

  const hint = !revealed
    ? t('roles.hintReveal')
    : isLast
      ? t('roles.hintLast')
      : t('roles.hintNext');

  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-3 py-4">
          {/* back to setup */}
          <View className="mb-2 flex-row items-center">
            <Pressable
              onPress={onBackToSetup}
              hitSlop={12}
              style={{ backgroundColor: colors.surface, borderColor: colors.borderSubtle }}
              className="h-11 w-11 items-center justify-center rounded-full border active:opacity-80"
            >
              <CaretLeft size={22} color={colors.textSecondary} weight="bold" />
            </Pressable>
          </View>

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
            {t('roles.playerOf', { current: index + 1, total })}
          </Text>

          {/* full-bleed tappable card */}
          <Pressable onPress={onTapCard} className="flex-1">
            <RoleCard role={frontRole} playerNumber={role.player} revealed={revealed} />
          </Pressable>

          {/* tap hint (kept off the card so the card stays clean) */}
          <Text className="mt-4 text-center font-sans text-sm text-muted">{hint}</Text>
        </View>

        {/* All cards seen — ready to start */}
        <BottomSheet visible={doneOpen} onRequestClose={() => setDoneOpen(false)}>
          <View className="mb-5 items-center">
            <Text className="font-display text-2xl uppercase text-white">{t('roles.readyTitle')}</Text>
            <Text className="mt-1 text-center font-sans text-sm text-muted">
              {t('roles.readyBody')}
            </Text>
          </View>
          <PrimaryButton
            label={t('roles.startGame')}
            iconNode={<Play size={20} color="#FFFFFF" weight="fill" />}
            accent="streak"
            onPress={() => {
              hapticImpact();
              router.replace('/game/timer');
            }}
          />
          <View className="h-3" />
          <PrimaryButton
            label={t('roles.toSetup')}
            iconNode={<House size={20} color={colors.danger} weight="bold" />}
            accent="danger"
            variant="soft"
            onPress={onBackToSetup}
          />
        </BottomSheet>
      </SafeAreaView>
    </ScreenGradient>
  );
}
