import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { colors } from '@/theme/colors';
import { useSettingsStore } from '@/store/settingsStore';

function Row({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center py-3">
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-surface-2">
        <Ionicons name={icon} size={20} color={colors.accent} />
      </View>
      <Text className="flex-1 text-base font-semibold text-white">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.accent, false: colors.surface2 }}
        thumbColor="#fff"
      />
    </View>
  );
}

export default function Settings() {
  const { soundEnabled, hapticsEnabled, setSound, setHaptics } = useSettingsStore();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-row items-center px-6 pb-2 pt-4">
        <Text className="flex-1 text-2xl font-extrabold text-white">Настройки</Text>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-surface border border-border"
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View className="px-6 pt-2">
        <Card>
          <Row icon="volume-high-outline" label="Звук" value={soundEnabled} onValueChange={setSound} />
          <View className="h-px bg-border" />
          <Row
            icon="phone-portrait-outline"
            label="Вибрация"
            value={hapticsEnabled}
            onValueChange={setHaptics}
          />
        </Card>

        <Card className="mt-4">
          <Text className="text-base font-bold text-white">О игре</Text>
          <Text className="mt-2 text-sm leading-6 text-muted">
            «Шпион» — локальная party-игра для компании. Версия 1.0.0. Передавайте устройство по
            кругу и веселитесь!
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}
