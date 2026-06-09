import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import type { Role } from '@/game/types';
import { SpyIllustration } from '@/components/SpyIllustration';
import { colors } from '@/theme/colors';

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
 * Back (face-down) when `revealed` is false; front (role + word) when true.
 */
export function RoleCard({ role, playerNumber, revealed }: Props) {
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

  const isSpy = role.kind === 'spy';
  const accent = isSpy ? colors.danger : colors.streak;

  return (
    <View style={{ flex: 1, width: '100%' }}>
      {/* Back (face down) */}
      <Animated.View
        style={[
          faceBase,
          backStyle,
          { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
        ]}
      >
        <SpyIllustration size={180} />
        <Text className="mt-6 text-4xl font-extrabold text-white">Игрок {playerNumber}</Text>
        <View className="mt-4 flex-row items-center">
          <Ionicons name="finger-print-outline" size={18} color={colors.muted} />
          <Text className="ml-2 text-base text-muted">Нажмите, чтобы открыть</Text>
        </View>
      </Animated.View>

      {/* Front (revealed) */}
      <Animated.View
        style={[
          faceBase,
          frontStyle,
          { backgroundColor: colors.surface, borderWidth: 2, borderColor: accent },
        ]}
      >
        {/* picture */}
        <View
          style={{ backgroundColor: `${accent}1A` }}
          className="mb-6 h-28 w-28 items-center justify-center rounded-full"
        >
          <Ionicons
            name={isSpy ? 'eye-off' : role.kind === 'ghost' ? 'sparkles' : 'happy'}
            size={56}
            color={accent}
          />
        </View>

        <Text className="text-sm font-medium uppercase tracking-widest text-muted">Вы —</Text>
        <Text style={{ color: accent }} className="mt-1 text-5xl font-extrabold">
          {role.label}
        </Text>

        {role.word ? (
          <View className="mt-8 items-center">
            <Text className="text-sm uppercase tracking-widest text-muted">Загаданное слово</Text>
            <Text className="mt-2 text-center text-4xl font-extrabold text-white">{role.word}</Text>
          </View>
        ) : (
          <View className="mt-8 px-6">
            <Text className="text-center text-base leading-6 text-muted">
              Вы не знаете слова. Слушайте других и постарайтесь не выдать себя.
            </Text>
          </View>
        )}

        <View style={{ position: 'absolute', bottom: 24 }} className="flex-row items-center">
          <Ionicons name="eye-off-outline" size={16} color={colors.muted} />
          <Text className="ml-2 text-sm text-muted">Нажмите, чтобы скрыть</Text>
        </View>
      </Animated.View>
    </View>
  );
}
