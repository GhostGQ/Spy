import {router} from 'expo-router';
import {Minus, Play, Plus, Timer} from 'phosphor-react-native';
import {Pressable, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {PrimaryButton} from '@/components/PrimaryButton';
import {ScreenGradient} from '@/components/ScreenGradient';
import {ScreenHeader} from '@/components/ScreenHeader';
import {hapticImpact, hapticSelection} from '@/lib/haptics';
import {useGameStore} from '@/store/gameStore';
import {colors} from '@/theme/colors';
import {glow} from '@/theme/glow';

const QUICK = [1, 3, 5];
const MIN_MIN = 1;
const MAX_MIN = 10;

function pluralMin(n: number) {
  if (n === 1) return 'минута';
  if (n >= 2 && n <= 4) return 'минуты';
  return 'минут';
}

export default function TimerSetup() {
  const durationSec = useGameStore(s => s.durationSec);
  const setDuration = useGameStore(s => s.setDuration);

  const minutes = Math.round(durationSec / 60);
  const setMinutes = (m: number) => {
    hapticSelection();
    setDuration(m * 60);
  };

  const canDec = minutes > MIN_MIN;
  const canInc = minutes < MAX_MIN;

  const hex = colors.time;

  return (
    <ScreenGradient>
      <SafeAreaView className='flex-1' edges={['top', 'bottom']}>
        <View className='flex-1 px-6 pt-4'>
          <ScreenHeader
            title='Обсуждение'
            subtitle='Сколько длится раунд?'
            showBack={false}
          />

          <View className='flex-1 gap-8'>
            {/* Icon */}
            <View className='items-center'>
              <View
                style={[
                  {backgroundColor: `${hex}1F`, borderColor: `${hex}40`},
                  glow(hex, 'card'),
                ]}
                className='h-24 w-24 items-center justify-center rounded-full border'
              >
                <Timer size={44} color={hex} weight='bold' />
              </View>
            </View>

            <View className='gap-4 mb-8'>
              {/* Stepper */}
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.borderSubtle,
                }}
                className='rounded-3xl border p-6'
              >
                <View className='flex-row items-center justify-between'>
                  {/* Minus */}
                  <Pressable
                    disabled={!canDec}
                    onPress={() => setMinutes(minutes - 1)}
                    style={[
                      {
                        opacity: canDec ? 1 : 0.3,
                        backgroundColor: `${hex}22`,
                        borderColor: `${hex}40`,
                      },
                      canDec ? glow(hex, 'soft') : null,
                    ]}
                    className='h-14 w-14 items-center justify-center rounded-2xl border active:opacity-70'
                  >
                    <Minus size={26} color={hex} weight='bold' />
                  </Pressable>

                  {/* Value */}
                  <View className='items-center'>
                    <Text
                      style={{color: hex}}
                      className='font-display text-6xl leading-none'
                    >
                      {minutes}
                    </Text>
                    <Text className='mt-1 font-sans text-sm text-muted'>
                      {pluralMin(minutes)}
                    </Text>
                  </View>

                  {/* Plus */}
                  <Pressable
                    disabled={!canInc}
                    onPress={() => setMinutes(minutes + 1)}
                    style={[
                      {
                        opacity: canInc ? 1 : 0.3,
                        backgroundColor: `${hex}22`,
                        borderColor: `${hex}40`,
                      },
                      canInc ? glow(hex, 'soft') : null,
                    ]}
                    className='h-14 w-14 items-center justify-center rounded-2xl border active:opacity-70'
                  >
                    <Plus size={26} color={hex} weight='bold' />
                  </Pressable>
                </View>
              </View>

              {/* Quick presets */}
              <View>
                <Text className='mb-3 text-center font-display text-xs uppercase tracking-widest text-muted'>
                  Быстрый выбор
                </Text>
                <View className='flex-row justify-center gap-3'>
                  {QUICK.map(m => {
                    const active = minutes === m;
                    return (
                      <Pressable
                        key={m}
                        onPress={() => setMinutes(m)}
                        style={[
                          {
                            borderColor: active ? hex : colors.borderSubtle,
                            backgroundColor: active
                              ? `${hex}1A`
                              : colors.surface,
                          },
                          active ? glow(hex, 'soft') : null,
                        ]}
                        className='flex-1 items-center rounded-2xl border py-3 active:opacity-80'
                      >
                        <Text
                          style={{color: active ? hex : colors.textSecondary}}
                          className='font-sans-sb text-base'
                        >
                          {m} мин
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>

          <View className='pb-4'>
            <PrimaryButton
              label='Запустить обсуждение'
              iconNode={<Play size={22} color='#FFFFFF' weight='fill' />}
              size='lg'
              accent='time'
              onPress={() => {
                hapticImpact();
                router.replace('/game/timer');
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}
