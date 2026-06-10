import { Fingerprint, User } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { SpyIcon } from '@/components/icons/ModeIcons';
import type { Role } from '@/game/types';
import { colors } from '@/theme/colors';
import { glow } from '@/theme/glow';

interface Props {
  /** Role shown on the FRONT (kept frozen by the parent while hiding). */
  role: Role;
  /** Player number shown on the BACK (the current player to act). */
  playerNumber: number;
  revealed: boolean;
}

// NativeWind className is NOT applied to Reanimated's Animated.View, so the
// face layout (centering, radius, border, padding) is set via inline styles.
const faceBase = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 28,
  paddingHorizontal: 24,
} as const;

/**
 * Near-fullscreen flip card. The parent makes the whole card tappable.
 * Back (face-down) when `revealed` is false; front (icon + word) when true.
 *
 * IMPORTANT: the front icon/accent are derived from what the player is *told*
 * (no word ⇒ "Шпион"), never from `role.kind`. In ghost mode a ghost holds a
 * fake word, so it looks identical to a civilian — otherwise the ghost would
 * see a different icon and realise it is the ghost.
 */
export function RoleCard({ role, playerNumber, revealed }: Props) {
  const { t } = useTranslation();
  const progress = useDerivedValue(
    () => withTiming(revealed ? 1 : 0, { duration: 450 }),
    [revealed]
  );

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(progress.value, [0, 1], [180, 360])}deg` },
    ],
    opacity: progress.value < 0.5 ? 0 : 1,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(progress.value, [0, 1], [0, 180])}deg` },
    ],
    opacity: progress.value < 0.5 ? 1 : 0,
  }));

  const shownSpy = role.word === null; // spies have no word; ghosts hold a fake one
  const accent = shownSpy ? colors.danger : colors.streak;

  return (
    <View style={{ flex: 1, width: '100%' }}>
      {/* Back (face down) */}
      <Animated.View
        style={[
          faceBase,
          backStyle,
          { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.borderSubtle },
        ]}
      >
        <View
          style={[
            { backgroundColor: `${colors.accent}1F`, borderColor: `${colors.accent}40` },
            glow(colors.accent, 'card'),
          ]}
          className="h-32 w-32 items-center justify-center rounded-full border"
        >
          <Fingerprint size={62} color={colors.accentBright} weight="duotone" />
        </View>
        <Text className="mt-8 font-display text-4xl uppercase tracking-wide text-white">
          {t('roles.player', { number: playerNumber })}
        </Text>
      </Animated.View>

      {/* Front (revealed) — only the word (or «Шпион») */}
      <Animated.View
        style={[
          faceBase,
          frontStyle,
          { backgroundColor: colors.surface, borderWidth: 2, borderColor: accent },
          glow(accent, 'card'),
        ]}
      >
        <View
          style={[
            { backgroundColor: `${accent}1F`, borderColor: `${accent}40` },
            glow(accent, 'soft'),
          ]}
          className="mb-10 h-28 w-28 items-center justify-center rounded-full border"
        >
          {shownSpy ? (
            <SpyIcon size={60} color={accent} />
          ) : (
            <User size={58} color={accent} weight="bold" />
          )}
        </View>

        <Text
          adjustsFontSizeToFit
          numberOfLines={3}
          style={{
            color: shownSpy ? accent : '#FFFFFF',
            fontFamily: 'Tektur_700Bold',
            fontSize: 38,
            lineHeight: 48,
            textAlign: 'center',
            letterSpacing: 1,
            // Large-radius text-shadow renders as a solid box behind the text
            // on react-native-web (Chrome), so the glow is iOS/Android only.
            ...(Platform.OS === 'web'
              ? null
              : {
                  textShadowColor: `${accent}AA`,
                  textShadowRadius: 20,
                  textShadowOffset: { width: 0, height: 0 },
                }),
          }}
        >
          {role.word ?? t('roles.spy')}
        </Text>
      </Animated.View>
    </View>
  );
}
