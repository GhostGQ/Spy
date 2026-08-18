import { router } from 'expo-router';
import { BookOpen, GearSix, Play, Sparkle } from 'phosphor-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FullAccessSheet } from '@/components/FullAccessSheet';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RainField } from '@/components/RainField';
import { ScreenGradient } from '@/components/ScreenGradient';
import { SpyHero } from '@/components/SpyHero';
import { IAP_ENABLED, TESTING_FULL_ACCESS } from '@/config/iap';
import { colors } from '@/theme/colors';
import { useGameStore } from '@/store/gameStore';
import { usePurchaseStore } from '@/store/purchaseStore';

function SecondaryButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: colors.surface, borderColor: colors.borderSubtle }}
      className="flex-1 flex-row items-center justify-center rounded-full border py-4 active:opacity-80"
    >
      {icon}
      <Text className="ml-2 font-sans-sb text-base text-text-secondary">{label}</Text>
    </Pressable>
  );
}

export default function MainMenu() {
  const { t } = useTranslation();
  const reset = useGameStore((s) => s.reset);
  const allUnlocked = usePurchaseStore((s) => s.allUnlocked);
  const [fullAccessOpen, setFullAccessOpen] = useState(false);

  const showFullAccessCta = IAP_ENABLED && !TESTING_FULL_ACCESS && !allUnlocked;

  const startGame = () => {
    reset();
    router.push('/game/setup');
  };

  return (
    <ScreenGradient variant="splash">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <RainField count={24} color={colors.steelBright} opacity={0.4} />
        {/* flexGrow keeps the portrait spread-out layout; scrolls instead of
            overlapping on short viewports (landscape / small tablets). */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingVertical: 24,
          }}
        >
          {showFullAccessCta ? (
            <PrimaryButton
              label={t('purchase.unlockFullAccess')}
              iconNode={<Sparkle size={20} color="#FFFFFF" weight="fill" />}
              size="md"
              accent="premium"
              onPress={() => setFullAccessOpen(true)}
            />
          ) : null}

          {/* Brand / hero */}
          <View className="flex-1 items-center justify-center">
            <View className="items-center justify-center">
              <SpyHero size={224} />
            </View>
            <Text
              style={{ textShadowColor: 'rgba(255,255,255,0.28)', textShadowRadius: 16, letterSpacing: 6 }}
              className="mt-8 font-display text-6xl text-white"
            >
              {t('menu.title')}
            </Text>
            <View
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)' }}
              className="mt-4 rounded-full border px-4 py-1.5"
            >
              <Text className="font-sans-md text-sm text-text-secondary">
                {t('menu.subtitle')}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View>
            <PrimaryButton
              label={t('menu.play')}
              iconNode={<Play size={22} color="#FFFFFF" weight="fill" />}
              size="lg"
              accent="steel"
              onPress={startGame}
            />
            <View className="mt-3 flex-row gap-3">
              <SecondaryButton
                icon={<BookOpen size={20} color={colors.steelBright} weight="bold" />}
                label={t('menu.rules')}
                onPress={() => router.push('/rules')}
              />
              <SecondaryButton
                icon={<GearSix size={20} color={colors.steelBright} weight="bold" />}
                label={t('menu.settings')}
                onPress={() => router.push('/settings')}
              />
            </View>
            <Text className="mt-5 text-center font-sans text-xs text-muted">
              {t('menu.tagline')}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      <FullAccessSheet visible={fullAccessOpen} onClose={() => setFullAccessOpen(false)} />
    </ScreenGradient>
  );
}
