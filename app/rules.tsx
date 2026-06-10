import { router } from 'expo-router';
import { X } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { ScreenGradient } from '@/components/ScreenGradient';
import { ModeIcon } from '@/components/icons/ModeIcons';
import { getModes } from '@/data/modes';
import { colors } from '@/theme/colors';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-3">
      <Text className="mb-2 font-sans-b text-lg text-white">{title}</Text>
      {children}
    </Card>
  );
}

export default function Rules() {
  const { t } = useTranslation();
  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-row items-center px-3 pb-2 pt-4">
          <Text className="flex-1 font-display text-2xl uppercase text-white">{t('rules.title')}</Text>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{ backgroundColor: colors.surface, borderColor: colors.borderSubtle }}
            className="h-11 w-11 items-center justify-center rounded-full border active:opacity-80"
          >
            <X size={22} color={colors.textSecondary} weight="bold" />
          </Pressable>
        </View>

        <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 32 }}>
          <Section title={t('rules.howToPlayTitle')}>
            <Text className="font-sans text-sm leading-6 text-text-secondary">
              {t('rules.howToPlayBody')}
            </Text>
          </Section>

          <Section title={t('rules.stagesTitle')}>
            <Text className="font-sans text-sm leading-6 text-text-secondary">
              {t('rules.stagesBody')}
            </Text>
          </Section>

          <Text className="mb-2 mt-2 px-1 font-sans-b text-lg text-white">{t('rules.modesTitle')}</Text>
          {getModes().map((m) => (
            <Card key={m.id} className="mb-3">
              <View className="mb-2 flex-row items-center">
                <View
                  style={{ backgroundColor: `${colors.accent}1F`, borderColor: `${colors.accent}40` }}
                  className="mr-3 h-10 w-10 items-center justify-center rounded-2xl border"
                >
                  <ModeIcon name={m.iconKey} size={22} color={colors.accentBright} />
                </View>
                <Text className="font-sans-b text-base text-white">{m.title}</Text>
              </View>
              <Text className="font-sans text-sm leading-6 text-text-secondary">{m.description}</Text>
            </Card>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenGradient>
  );
}
