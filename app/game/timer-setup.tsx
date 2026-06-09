import { router } from 'expo-router';
import { CheckCircle, Play, Timer } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenGradient } from '@/components/ScreenGradient';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/theme/colors';
import { glow } from '@/theme/glow';
import { useGameStore } from '@/store/gameStore';

const OPTIONS = [
  { label: '1 минута', sec: 60 },
  { label: '3 минуты', sec: 180 },
  { label: '5 минут', sec: 300 },
  { label: '10 минут', sec: 600 },
];

export default function TimerSetup() {
  const durationSec = useGameStore((s) => s.durationSec);
  const setDuration = useGameStore((s) => s.setDuration);

  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-6 pt-4">
          <ScreenHeader title="Обсуждение" subtitle="Сколько длится раунд?" showBack={false} />

          <View className="flex-1 justify-center">
            <View className="mb-8 items-center">
              <View
                style={[
                  { backgroundColor: `${colors.time}1F`, borderColor: `${colors.time}40` },
                  glow(colors.time, 'card'),
                ]}
                className="h-24 w-24 items-center justify-center rounded-full border"
              >
                <Timer size={44} color={colors.time} weight="bold" />
              </View>
            </View>

            <View className="gap-3">
              {OPTIONS.map((o) => {
                const selected = durationSec === o.sec;
                return (
                  <Pressable
                    key={o.sec}
                    onPress={() => setDuration(o.sec)}
                    style={[
                      {
                        borderColor: selected ? colors.time : colors.borderSubtle,
                        backgroundColor: selected ? `${colors.time}1A` : colors.surface,
                      },
                      selected ? glow(colors.time, 'card') : null,
                    ]}
                    className="flex-row items-center justify-between rounded-2xl border p-5 active:opacity-90"
                  >
                    <Text className="font-sans-sb text-lg text-white">{o.label}</Text>
                    {selected ? (
                      <CheckCircle size={26} color={colors.time} weight="fill" />
                    ) : (
                      <View
                        style={{ borderColor: colors.surface3 }}
                        className="h-6 w-6 rounded-full border-2"
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="pb-4">
            <PrimaryButton
              label="Запустить обсуждение"
              iconNode={<Play size={22} color="#FFFFFF" weight="fill" />}
              size="lg"
              accent="time"
              onPress={() => router.replace('/game/timer')}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}
