import { router } from 'expo-router';
import { CaretRight, FileText, ShieldCheck, SpeakerHigh, Vibrate, X } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { ScreenGradient } from '@/components/ScreenGradient';
import { hapticSelection } from '@/lib/haptics';
import { colors } from '@/theme/colors';
import { useSettingsStore } from '@/store/settingsStore';

function Row({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: ReactNode;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center py-3">
      <View
        style={{ backgroundColor: colors.surface3, borderColor: colors.borderSubtle }}
        className="mr-3 h-10 w-10 items-center justify-center rounded-2xl border"
      >
        {icon}
      </View>
      <Text className="flex-1 font-sans-sb text-base text-white">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.accent, false: colors.surface3 }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function LinkRow({ icon, label, onPress }: { icon: ReactNode; label: string; onPress: () => void }) {
  const handlePress = () => {
    hapticSelection();
    onPress();
  };
  return (
    <Pressable onPress={handlePress} className="flex-row items-center py-3 active:opacity-70">
      <View
        style={{ backgroundColor: colors.surface3, borderColor: colors.borderSubtle }}
        className="mr-3 h-10 w-10 items-center justify-center rounded-2xl border"
      >
        {icon}
      </View>
      <Text className="flex-1 font-sans-sb text-base text-white">{label}</Text>
      <CaretRight size={18} color={colors.textSecondary} weight="bold" />
    </Pressable>
  );
}

export default function Settings() {
  const { soundEnabled, hapticsEnabled, setSound, setHaptics } = useSettingsStore();

  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-row items-center px-3 pb-2 pt-4">
          <Text className="flex-1 font-display text-2xl uppercase text-white">Настройки</Text>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{ backgroundColor: colors.surface, borderColor: colors.borderSubtle }}
            className="h-11 w-11 items-center justify-center rounded-full border active:opacity-80"
          >
            <X size={22} color={colors.textSecondary} weight="bold" />
          </Pressable>
        </View>

        <View className="px-6 pt-2">
          <Card>
            <Row
              icon={<SpeakerHigh size={20} color={colors.accentBright} weight="bold" />}
              label="Звук"
              value={soundEnabled}
              onValueChange={setSound}
            />
            <View style={{ backgroundColor: colors.divider }} className="h-px" />
            <Row
              icon={<Vibrate size={20} color={colors.accentBright} weight="bold" />}
              label="Вибрация"
              value={hapticsEnabled}
              onValueChange={setHaptics}
            />
          </Card>

          <Text className="mb-2 mt-5 px-1 font-display text-xs uppercase tracking-widest text-muted">
            Правовая информация
          </Text>
          <Card>
            <LinkRow
              icon={<FileText size={20} color={colors.accentBright} weight="bold" />}
              label="Условия использования"
              onPress={() => router.push('/terms')}
            />
            <View style={{ backgroundColor: colors.divider }} className="h-px" />
            <LinkRow
              icon={<ShieldCheck size={20} color={colors.accentBright} weight="bold" />}
              label="Политика конфиденциальности"
              onPress={() => router.push('/privacy')}
            />
          </Card>

          <Card className="mt-4">
            <Text className="font-sans-b text-base text-white">О игре</Text>
            <Text className="mt-2 font-sans text-sm leading-6 text-text-secondary">
              «Шпион» — локальная party-игра для компании. Версия 1.0.0. Передавайте устройство по
              кругу и веселитесь!
            </Text>
          </Card>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}
