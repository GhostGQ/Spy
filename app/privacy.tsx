import { router } from 'expo-router';
import { X } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { ScreenGradient } from '@/components/ScreenGradient';
import { colors } from '@/theme/colors';

// TODO(production): заполнить реальными реквизитами перед релизом.
const DEVELOPER = 'GHostGQ Studio';
const CONTACT_EMAIL = 'borisov.damir.2803@gmail.com';
const EFFECTIVE_DATE = '15.06.2026';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-3">
      <Text className="mb-2 font-sans-b text-lg text-white">{title}</Text>
      {children}
    </Card>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <Text className="font-sans text-sm leading-6 text-text-secondary">{children}</Text>;
}

export default function Privacy() {
  const { t } = useTranslation();
  const vars = {
    app: t('legal.appName'),
    developer: DEVELOPER,
    email: CONTACT_EMAIL,
  };

  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-row items-center px-3 pb-2 pt-4">
          <Text className="flex-1 font-display text-2xl uppercase text-white">
            {t('legal.privacy.title')}
          </Text>
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
          <Text className="mb-4 px-1 font-sans text-xs text-muted">
            {t('legal.privacy.intro', vars)}
          </Text>

          <Section title={t('legal.privacy.s1title')}>
            <Body>{t('legal.privacy.s1body', vars)}</Body>
          </Section>
          <Section title={t('legal.privacy.s2title')}>
            <Body>{t('legal.privacy.s2body', vars)}</Body>
          </Section>
          <Section title={t('legal.privacy.s3title')}>
            <Body>{t('legal.privacy.s3body', vars)}</Body>
          </Section>
          <Section title={t('legal.privacy.s4title')}>
            <Body>{t('legal.privacy.s4body', vars)}</Body>
          </Section>
          <Section title={t('legal.privacy.s5title')}>
            <Body>{t('legal.privacy.s5body', vars)}</Body>
          </Section>
          <Section title={t('legal.privacy.s6title')}>
            <Body>{t('legal.privacy.s6body', vars)}</Body>
          </Section>
          <Section title={t('legal.privacy.s7title')}>
            <Body>{t('legal.privacy.s7body', vars)}</Body>
          </Section>
          <Section title={t('legal.privacy.s8title')}>
            <Body>{t('legal.privacy.s8body', vars)}</Body>
          </Section>
          <Section title={t('legal.privacy.s9title')}>
            <Body>{t('legal.privacy.s9body', vars)}</Body>
          </Section>

          <Text className="mt-2 px-1 font-sans text-xs text-muted">
            {t('legal.effectiveDate', { date: EFFECTIVE_DATE })}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </ScreenGradient>
  );
}
