import { router } from 'expo-router';
import { BookOpen, GearSix, Play } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenGradient } from '@/components/ScreenGradient';
import { SpyHero } from '@/components/SpyHero';
import { colors } from '@/theme/colors';
import { glow } from '@/theme/glow';
import { useGameStore } from '@/store/gameStore';

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
  const reset = useGameStore((s) => s.reset);

  const startGame = () => {
    reset();
    router.push('/game/setup');
  };

  return (
    <ScreenGradient variant="splash">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 justify-between px-3 py-6">
          {/* Brand / hero */}
          <View className="flex-1 items-center justify-center">
            <View
              style={[{ width: 236, height: 236, borderRadius: 118 }, glow(colors.cyan, 'cta')]}
              className="items-center justify-center"
            >
              <SpyHero size={236} />
            </View>
            <Text
              style={{ textShadowColor: 'rgba(96,165,250,0.55)', textShadowRadius: 18, letterSpacing: 2 }}
              className="mt-6 font-display text-6xl text-white"
            >
              ШПИОН
            </Text>
            <Text className="mt-3 font-sans text-base text-text-secondary">
              Найди того, кто не знает слова
            </Text>
          </View>

          {/* Actions */}
          <View>
            <PrimaryButton
              label="Играть"
              iconNode={<Play size={22} color="#FFFFFF" weight="fill" />}
              size="lg"
              onPress={startGame}
            />
            <View className="mt-3 flex-row gap-3">
              <SecondaryButton
                icon={<BookOpen size={20} color={colors.accentBright} weight="bold" />}
                label="Правила"
                onPress={() => router.push('/rules')}
              />
              <SecondaryButton
                icon={<GearSix size={20} color={colors.accentBright} weight="bold" />}
                label="Настройки"
                onPress={() => router.push('/settings')}
              />
            </View>
            <Text className="mt-5 text-center font-sans text-xs text-muted">
              Локальная игра · 3–12 игроков · одно устройство
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}
