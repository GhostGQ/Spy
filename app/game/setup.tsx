import {router} from 'expo-router';
import {ArrowRight, Sparkle} from 'phosphor-react-native';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, Switch, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {FullAccessSheet} from '@/components/FullAccessSheet';
import {PrimaryButton} from '@/components/PrimaryButton';
import {ScreenGradient} from '@/components/ScreenGradient';
import {ScreenHeader} from '@/components/ScreenHeader';
import {SelectableCard} from '@/components/SelectableCard';
import {Stepper} from '@/components/Stepper';
import {ChaosIcon, ModeIcon} from '@/components/icons/ModeIcons';
import {getModes, getMode} from '@/data/modes';
import {maxSpecialMajority, maxSpecialStrictMajority, SYNDICATE_MIN_PLAYERS} from '@/game/roles';
import type {ModeId} from '@/game/types';
import {useGameStore} from '@/store/gameStore';
import {usePurchaseStore} from '@/store/purchaseStore';
import {accentHex, colors, type AccentToken} from '@/theme/colors';
import {IAP_ENABLED, PREMIUM_MODE_IDS, TESTING_FULL_ACCESS} from '@/config/iap';

/** Distinct accent per mode for a livelier, gaming feel. */
const MODE_ACCENT: Record<ModeId, AccentToken> = {
  classic: 'accent',
  chaos: 'cyan',
  ghost: 'level',
  syndicate: 'danger',
  detective: 'purple',
};

/** Modes shown under the "basic" / "exclusive" (premium) section headers. */
const BASIC_MODE_IDS: ModeId[] = ['classic', 'chaos'];
const EXCLUSIVE_MODE_IDS: ModeId[] = ['ghost', 'syndicate', 'detective'];

function Label({children}: {children: string}) {
  return (
    <Text className='mb-2 mt-5 font-display text-[13px] uppercase tracking-widest text-muted'>
      {children}
    </Text>
  );
}

function GlassCard({children}: {children: React.ReactNode}) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.borderSubtle,
      }}
      className='rounded-2xl border p-4'
    >
      {children}
    </View>
  );
}

export default function Setup() {
  const {t} = useTranslation();
  const config = useGameStore(s => s.config);
  const setMode = useGameStore(s => s.setMode);
  const setPlayerCount = useGameStore(s => s.setPlayerCount);
  const setSpecialCount = useGameStore(s => s.setSpecialCount);
  const setGhostClassic = useGameStore(s => s.setGhostClassic);
  const isModeLocked = usePurchaseStore(s => s.isModeLocked);
  const [fullAccessOpen, setFullAccessOpen] = useState(false);

  const onPressMode = (id: ModeId) => {
    if (isModeLocked(id)) {
      setFullAccessOpen(true);
      return;
    }
    setMode(id);
    // A syndicate needs at least two spies, so the stepper starts at 2.
    if (id === 'syndicate' && config.specialCount < 2) setSpecialCount(2);
  };

  const mode = getMode(config.mode);
  const modes = getModes();
  const byId = (id: ModeId) => modes.find(m => m.id === id)!;

  const isGhost = config.mode === 'ghost';
  const isSyndicate = config.mode === 'syndicate';
  const ghostClassic = isGhost && config.ghostClassic;
  // Ghost and Syndicate keep civilians ahead of the special roles by at least
  // one, which is a tighter cap than the general majority rule.
  const maxSpecial =
    isGhost || isSyndicate
      ? maxSpecialStrictMajority(config.playerCount)
      : maxSpecialMajority(config.playerCount);
  // Classic-ghost reserves one slot for the single ghost, so spies cap lower.
  const stepMax = ghostClassic ? Math.max(1, maxSpecial) : maxSpecial;
  const stepMin = isSyndicate ? 2 : 1;
  const playersMin = isSyndicate ? SYNDICATE_MIN_PLAYERS : 3;
  const stepLabel = ghostClassic ? t('setup.spies') : mode.specialCountLabel;
  const modeAccentHex = accentHex[MODE_ACCENT[config.mode]];

  const renderMode = (m: ReturnType<typeof getMode>, iconSize: number) => {
    const selected = config.mode === m.id;
    const acc = MODE_ACCENT[m.id];
    const isPremium = (PREMIUM_MODE_IDS as readonly string[]).includes(m.id);
    const comingSoon = !IAP_ENABLED && !TESTING_FULL_ACCESS && isPremium;
    return (
      <SelectableCard
        title={m.title}
        selected={selected}
        locked={isModeLocked(m.id)}
        comingSoon={comingSoon}
        comingSoonLabel={t('categories.comingSoon')}
        onPress={() => onPressMode(m.id)}
        accent={acc}
        icon={
          <ModeIcon
            name={m.iconKey}
            size={iconSize}
            color={selected ? accentHex[acc] : colors.textSecondary}
          />
        }
      />
    );
  };

  return (
    <ScreenGradient>
      <SafeAreaView className='flex-1' edges={['top', 'bottom']}>
        <View className='flex-1 px-3 pt-4'>
          <ScreenHeader
            title={t('setup.title')}
            subtitle={t('setup.subtitle')}
            onBack={() => router.back()}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 16}}
          >
            <View className='flex-1'>
              <Label>{t('setup.basicModesLabel')}</Label>
              <View className='gap-2.5 flex flex-row'>
                {BASIC_MODE_IDS.map(id => (
                  <View key={id} className='flex-1'>{renderMode(byId(id), 38)}</View>
                ))}
              </View>

              {/* Premium-mode divider (teaser header). */}
              <View className='my-5 flex-row items-center'>
                <View
                  className='h-px flex-1'
                  style={{backgroundColor: colors.divider}}
                />
                <View
                  className='mx-3 flex-row items-center rounded-full border px-3 py-1.5'
                  style={{
                    backgroundColor: `${colors.purple}1F`,
                    borderColor: `${colors.purple}40`,
                  }}
                >
                  <Sparkle size={15} color={colors.purple} weight='fill' />
                  <Text
                    className='ml-1.5 font-display text-[12px] uppercase tracking-widest'
                    style={{color: colors.purple}}
                  >
                    {t('setup.exclusiveModesLabel')}
                  </Text>
                </View>
                <View
                  className='h-px flex-1'
                  style={{backgroundColor: colors.divider}}
                />
              </View>

              <View className='flex-1 gap-2.5'>
                {(() => {
                  const fullWidth = EXCLUSIVE_MODE_IDS.filter(
                    item => item === 'ghost',
                  );
                  const halfWidth = EXCLUSIVE_MODE_IDS.filter(
                    item => item !== 'ghost',
                  );

                  return (
                    <>
                      {fullWidth.map(id => (
                        <View key={id}>
                          {renderMode(byId(id), 32)}
                        </View>
                      ))}
                      <View className='flex-row gap-2.5'>
                        {halfWidth.map(id => (
                          <View key={id} style={{width: '48.5%'}}>
                            {renderMode(byId(id), 32)}
                          </View>
                        ))}
                      </View>
                    </>
                  );
                })()}
              </View>

              <Label>{t('setup.playersLabel')}</Label>
              <GlassCard>
                <Stepper
                  label={t('setup.playersCount')}
                  value={config.playerCount}
                  onChange={setPlayerCount}
                  min={playersMin}
                  max={12}
                  accent='level'
                />
              </GlassCard>

              <Label>{t('setup.additionalLabel')}</Label>
              {isGhost || isSyndicate ? (
                <>
                  <GlassCard>
                    <View className='flex-row items-center'>
                      <View
                        style={{
                          backgroundColor: `${modeAccentHex}1F`,
                          borderColor: `${modeAccentHex}33`,
                        }}
                        className='mr-3 h-11 w-11 items-center justify-center rounded-2xl border'
                      >
                        <ModeIcon name={mode.iconKey} size={24} color={modeAccentHex} />
                      </View>
                      <Text className='flex-1 font-sans text-sm leading-6 text-text-secondary'>
                        {mode.short}
                      </Text>
                    </View>
                  </GlassCard>
                  <View className='h-2.5' />
                </>
              ) : null}
              {mode.configurableSpecialCount ? (
                <GlassCard>
                  <Stepper
                    label={stepLabel}
                    value={Math.max(
                      stepMin,
                      Math.min(config.specialCount, stepMax),
                    )}
                    onChange={setSpecialCount}
                    min={stepMin}
                    max={stepMax}
                    accent='accent'
                  />
                </GlassCard>
              ) : (
                <GlassCard>
                  <View className='flex-row items-center'>
                    <View
                      style={{
                        backgroundColor: `${colors.cyan}1F`,
                        borderColor: `${colors.cyan}33`,
                      }}
                      className='mr-3 h-11 w-11 items-center justify-center rounded-2xl border'
                    >
                      <ChaosIcon size={24} color={colors.cyan} />
                    </View>
                    <Text className='flex-1 font-sans text-sm leading-6 text-text-secondary'>
                      {t('setup.chaosNote')}
                    </Text>
                  </View>
                </GlassCard>
              )}
              {isGhost ? <View className='h-2.5' /> : null}
              {isGhost ? (
                <GlassCard>
                  <View className='flex-row items-center'>
                    <View className='flex-1 pr-3'>
                      <Text className='font-sans-sb text-base text-white'>
                        {t('setup.ghostClassic')}
                      </Text>
                    </View>
                    <Switch
                      value={config.ghostClassic}
                      onValueChange={setGhostClassic}
                      trackColor={{
                        true: accentHex.level,
                        false: colors.surface3,
                      }}
                      thumbColor='#FFFFFF'
                    />
                  </View>
                </GlassCard>
              ) : null}
            </View>
          </ScrollView>

          <View className='pb-4 pt-3'>
            <PrimaryButton
              label={t('setup.next')}
              iconNode={<ArrowRight size={22} color='#FFFFFF' weight='bold' />}
              size='lg'
              onPress={() => router.push('/game/categories')}
            />
          </View>
        </View>
      </SafeAreaView>
      <FullAccessSheet
        visible={fullAccessOpen}
        onClose={() => setFullAccessOpen(false)}
      />
    </ScreenGradient>
  );
}
