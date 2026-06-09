import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { MODES } from '@/data/modes';
import { colors } from '@/theme/colors';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-3">
      <Text className="mb-2 text-lg font-bold text-white">{title}</Text>
      {children}
    </Card>
  );
}

export default function Rules() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-row items-center px-6 pb-2 pt-4">
        <Text className="flex-1 text-2xl font-extrabold text-white">Правила</Text>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-surface border border-border"
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 32 }}>
        <Section title="Как играть">
          <Text className="text-sm leading-6 text-muted">
            Передавайте устройство по кругу. Каждый по очереди смотрит свою роль и слово, затем
            скрывает её и передаёт дальше. После раздачи начинается обсуждение: по очереди
            называйте ассоциации к слову, не произнося его. Задача — вычислить тех, кто слова не
            знает.
          </Text>
        </Section>

        <Section title="Этапы">
          <Text className="text-sm leading-6 text-muted">
            1. Создание игры — выбор режима, категории и числа игроков.{'\n'}
            2. Выдача ролей — каждый смотрит свою роль.{'\n'}
            3. Обсуждение — таймер на выбранное время.{'\n'}
            4. Голосование — выбор победителя.{'\n'}
            5. Итоги — кто кем был и какое слово.
          </Text>
        </Section>

        <Text className="mb-2 mt-2 px-1 text-lg font-bold text-white">Режимы</Text>
        {MODES.map((m) => (
          <Card key={m.id} className="mb-3">
            <View className="mb-1 flex-row items-center">
              <Text className="mr-2 text-xl">{m.emoji}</Text>
              <Text className="text-base font-bold text-white">{m.title}</Text>
            </View>
            <Text className="text-sm leading-6 text-muted">{m.description}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
