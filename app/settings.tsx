import {router} from 'expo-router';
import {
  ArrowsClockwise,
  CaretRight,
  Check,
  FileText,
  Lightbulb,
  ShieldCheck,
  SpeakerHigh,
  Translate,
  Vibrate,
  X,
} from 'phosphor-react-native';
import type {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Pressable, ScrollView, Switch, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Card} from '@/components/Card';
import {ScreenGradient} from '@/components/ScreenGradient';
import {IAP_ENABLED} from '@/config/iap';
import i18n, {type AppLanguage} from '@/i18n';
import {hapticSelection} from '@/lib/haptics';
import {colors} from '@/theme/colors';
import {usePurchaseStore} from '@/store/purchaseStore';
import {useSettingsStore} from '@/store/settingsStore';

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
    <View className='flex-row items-center py-3'>
      <View
        style={{
          backgroundColor: colors.surface3,
          borderColor: colors.borderSubtle,
        }}
        className='mr-3 h-10 w-10 items-center justify-center rounded-2xl border'
      >
        {icon}
      </View>
      <Text className='flex-1 font-sans-sb text-base text-white'>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{true: colors.steel, false: colors.surface3}}
        thumbColor='#FFFFFF'
      />
    </View>
  );
}

function LinkRow({
  icon,
  label,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
}) {
  const handlePress = () => {
    hapticSelection();
    onPress();
  };
  return (
    <Pressable
      onPress={handlePress}
      className='flex-row items-center py-3 active:opacity-70'
    >
      <View
        style={{
          backgroundColor: colors.surface3,
          borderColor: colors.borderSubtle,
        }}
        className='mr-3 h-10 w-10 items-center justify-center rounded-2xl border'
      >
        {icon}
      </View>
      <Text className='flex-1 font-sans-sb text-base text-white'>{label}</Text>
      <CaretRight size={18} color={colors.textSecondary} weight='bold' />
    </Pressable>
  );
}

function LanguageRow({
  icon,
  label,
  selected,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const handlePress = () => {
    hapticSelection();
    onPress();
  };
  return (
    <Pressable
      onPress={handlePress}
      className='flex-row items-center py-3 active:opacity-70'
    >
      <View
        style={{
          backgroundColor: colors.surface3,
          borderColor: colors.borderSubtle,
        }}
        className='mr-3 h-10 w-10 items-center justify-center rounded-2xl border'
      >
        {icon}
      </View>
      <Text className='flex-1 font-sans-sb text-base text-white'>{label}</Text>
      {selected ? (
        <Check size={20} color={colors.steelBright} weight='bold' />
      ) : null}
    </Pressable>
  );
}

export default function Settings() {
  const {t} = useTranslation();
  const {soundEnabled, hapticsEnabled, hintsEnabled, setSound, setHaptics, setHints, setLanguage} =
    useSettingsStore();
  const restorePurchases = usePurchaseStore((s) => s.restorePurchases);

  const handleRestorePurchases = async () => {
    await restorePurchases();
    const {error} = usePurchaseStore.getState();
    Alert.alert(error ? t('purchase.restoreError') : t('purchase.restoreSuccess'));
  };
  // Reflects the live i18n language (covers the device-locale default before the
  // user has explicitly picked one).
  const activeLang: AppLanguage = i18n.language === 'ru' ? 'ru' : 'en';

  return (
    <ScreenGradient>
      <SafeAreaView className='flex-1' edges={['top', 'bottom']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
          <View className='flex-row items-center px-4 pb-2 pt-4'>
            <Text className='flex-1 font-display text-2xl uppercase text-white'>
              {t('settings.title')}
            </Text>
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.borderSubtle,
              }}
              className='h-11 w-11 items-center justify-center rounded-full border active:opacity-80'
            >
              <X size={22} color={colors.textSecondary} weight='bold' />
            </Pressable>
          </View>

          <View className='px-4 pt-2'>
            <Card>
              <Row
                icon={
                  <SpeakerHigh
                    size={20}
                    color={colors.steelBright}
                    weight='bold'
                  />
                }
                label={t('settings.sound')}
                value={soundEnabled}
                onValueChange={setSound}
              />
              <View
                style={{backgroundColor: colors.divider}}
                className='h-px'
              />
              <Row
                icon={
                  <Vibrate
                    size={20}
                    color={colors.steelBright}
                    weight='bold'
                  />
                }
                label={t('settings.haptics')}
                value={hapticsEnabled}
                onValueChange={setHaptics}
              />
              <View
                style={{backgroundColor: colors.divider}}
                className='h-px'
              />
              <Row
                icon={
                  <Lightbulb
                    size={20}
                    color={colors.steelBright}
                    weight='bold'
                  />
                }
                label={t('settings.hints')}
                value={hintsEnabled}
                onValueChange={setHints}
              />
            </Card>

            <Text className='mb-2 mt-5 px-1 font-display text-xs uppercase tracking-widest text-muted'>
              {t('settings.language')}
            </Text>
            <Card>
              <LanguageRow
                icon={
                  <Translate
                    size={20}
                    color={colors.steelBright}
                    weight='bold'
                  />
                }
                label={t('settings.languageRu')}
                selected={activeLang === 'ru'}
                onPress={() => setLanguage('ru')}
              />
              <View
                style={{backgroundColor: colors.divider}}
                className='h-px'
              />
              <LanguageRow
                icon={
                  <Translate
                    size={20}
                    color={colors.steelBright}
                    weight='bold'
                  />
                }
                label={t('settings.languageEn')}
                selected={activeLang === 'en'}
                onPress={() => setLanguage('en')}
              />
            </Card>

            <Text className='mb-2 mt-5 px-1 font-display text-xs uppercase tracking-widest text-muted'>
              {t('settings.legalSection')}
            </Text>
            <Card>
              <LinkRow
                icon={
                  <FileText
                    size={20}
                    color={colors.steelBright}
                    weight='bold'
                  />
                }
                label={t('settings.terms')}
                onPress={() => router.push('/terms')}
              />
              <View
                style={{backgroundColor: colors.divider}}
                className='h-px'
              />
              <LinkRow
                icon={
                  <ShieldCheck
                    size={20}
                    color={colors.steelBright}
                    weight='bold'
                  />
                }
                label={t('settings.privacy')}
                onPress={() => router.push('/privacy')}
              />
              {IAP_ENABLED ? (
                <>
                  <View
                    style={{backgroundColor: colors.divider}}
                    className='h-px'
                  />
                  <LinkRow
                    icon={
                      <ArrowsClockwise
                        size={20}
                        color={colors.steelBright}
                        weight='bold'
                      />
                    }
                    label={t('purchase.restorePurchases')}
                    onPress={() => void handleRestorePurchases()}
                  />
                </>
              ) : null}
            </Card>

            <Card className='mt-4'>
              <Text className='font-sans-b text-base text-white'>
                {t('settings.aboutTitle')}
              </Text>
              <Text className='mt-2 font-sans text-sm leading-6 text-text-secondary'>
                {t('settings.aboutBody')}
              </Text>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenGradient>
  );
}
