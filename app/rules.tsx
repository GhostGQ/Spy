import { router } from 'expo-router';
import { User, X } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { ScreenGradient } from '@/components/ScreenGradient';
import { ModeIcon, SpyIcon } from '@/components/icons/ModeIcons';
import { IAP_ENABLED, PREMIUM_MODE_IDS, TESTING_FULL_ACCESS } from '@/config/iap';
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

function Body({ children }: { children: string }) {
  return <Text className="font-sans text-sm leading-6 text-text-secondary">{children}</Text>;
}

/** A role explainer: colored icon chip + name + what the role does. */
function RoleRow({
  icon,
  color,
  name,
  body,
}: {
  icon: ReactNode;
  color: string;
  name: string;
  body: string;
}) {
  return (
    <View className="flex-row py-2.5">
      <View
        style={{ backgroundColor: `${color}1F`, borderColor: `${color}40` }}
        className="mr-3 h-10 w-10 items-center justify-center rounded-2xl border"
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text style={{ color }} className="font-sans-b text-base">
          {name}
        </Text>
        <Text className="mt-0.5 font-sans text-sm leading-6 text-text-secondary">{body}</Text>
      </View>
    </View>
  );
}

export default function Rules() {
  const { t } = useTranslation();
  // Premium modes' rules are hidden until access is unlocked.
  const premiumIds = PREMIUM_MODE_IDS as readonly string[];
  const visibleModes = getModes().filter(
    (m) => !premiumIds.includes(m.id) || IAP_ENABLED || TESTING_FULL_ACCESS
  );
  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-row items-center px-4 pb-2 pt-4">
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

        <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: 32 }}>
          <Section title={t('rules.goalTitle')}>
            <Body>{t('rules.goalBody')}</Body>
          </Section>

          <Section title={t('rules.howToPlayTitle')}>
            <Body>{t('rules.howToPlayBody')}</Body>
          </Section>

          <Section title={t('rules.rolesTitle')}>
            <RoleRow
              icon={<User size={20} color={colors.streak} weight="bold" />}
              color={colors.streak}
              name={t('rules.roleCivilianTitle')}
              body={t('rules.roleCivilianBody')}
            />
            <View style={{ backgroundColor: colors.divider }} className="h-px" />
            <RoleRow
              icon={<SpyIcon size={20} color={colors.danger} />}
              color={colors.danger}
              name={t('rules.roleSpyTitle')}
              body={t('rules.roleSpyBody')}
            />
          </Section>

          <Section title={t('rules.stagesTitle')}>
            <Body>{t('rules.stagesBody')}</Body>
          </Section>

          <Section title={t('rules.constraintsTitle')}>
            <Body>{t('rules.constraintsBody')}</Body>
          </Section>

          <Text className="mb-2 mt-2 px-1 font-sans-b text-lg text-white">{t('rules.modesTitle')}</Text>
          {visibleModes.map((m) => (
            <Card key={m.id} className="mb-3">
              <View className="mb-2 flex-row items-center">
                <View
                  style={{ backgroundColor: `${colors.steel}1F`, borderColor: `${colors.steel}40` }}
                  className="mr-3 h-10 w-10 items-center justify-center rounded-2xl border"
                >
                  <ModeIcon name={m.iconKey} size={22} color={colors.steelBright} />
                </View>
                <Text className="font-sans-b text-base text-white">{m.title}</Text>
              </View>
              <Text className="font-sans text-sm leading-6 text-text-secondary">{m.description}</Text>
              <Text className="mt-2 font-sans-sb text-xs uppercase tracking-wide text-muted">
                {t('rules.minPlayers', { count: m.minPlayers })}
              </Text>
            </Card>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenGradient>
  );
}
