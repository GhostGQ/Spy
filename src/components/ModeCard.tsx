import { CheckCircle, Lock } from 'phosphor-react-native';
import { useEffect } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ComingSoonOverlay } from '@/components/ComingSoonOverlay';
import { ModeIcon, type ModeIconKey } from '@/components/icons/ModeIcons';
import { hapticSelection } from '@/lib/haptics';
import type { ModeFxKey } from '@/theme/modeTheme';
import { colors } from '@/theme/colors';

interface Props {
  title: string;
  iconKey: ModeIconKey;
  iconSize?: number;
  selected: boolean;
  onPress: () => void;
  /** Dominant hex of the mode's color world. */
  hex: string;
  /** Signature selected-state effect. */
  fxKey: ModeFxKey;
  locked?: boolean;
  comingSoon?: boolean;
  comingSoonLabel?: string;
}

const isAndroid = Platform.OS === 'android';

/**
 * Expressive, animated mode card for the setup screen. When selected it lifts
 * (scale), pulses a colored glow, and plays a per-mode signature micro-effect
 * behind the icon. Effects are opacity/scale/rotation based so Android (no
 * colored shadow) still degrades gracefully.
 */
export function ModeCard({
  title,
  iconKey,
  iconSize = 34,
  selected,
  onPress,
  hex,
  fxKey,
  locked = false,
  comingSoon = false,
  comingSoonLabel,
}: Props) {
  const lift = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    lift.value = withTiming(selected ? 1 : 0, { duration: 260 });
    if (selected) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(0, { duration: 200 });
    }
    return () => cancelAnimation(pulse);
  }, [selected, lift, pulse]);

  const animStyle = useAnimatedStyle(() => {
    // Lift the card with a small upward translate only — NOT scale. Scaling grew
    // the card past its layout slot, so the border was clipped by the row /
    // ScrollView edges. translateY stays within the layout box.
    const translateY = lift.value * -4;
    if (isAndroid) {
      return { transform: [{ translateY: translateY - pulse.value * 1.5 }] };
    }
    return {
      transform: [{ translateY }],
      shadowColor: hex,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 18 + pulse.value * 14,
      shadowOpacity: selected ? 0.35 + pulse.value * 0.35 : 0,
    };
  }, [selected, hex]);

  return (
    <Pressable
      onPress={() => {
        if (comingSoon) return;
        hapticSelection();
        onPress();
      }}
      style={{ opacity: locked ? 0.6 : 1 }}
    >
      <Animated.View
        style={[
          animStyle,
          {
            borderWidth: 2,
            borderColor: selected ? hex : colors.borderSubtle,
            backgroundColor: selected ? colors.surface2 : colors.surface,
            borderRadius: 18,
            paddingVertical: 16,
            paddingHorizontal: 12,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          },
        ]}
      >
        {/* Signature effect behind the icon — clipped on its own layer so the
            card's border is never cut by overflow:hidden on a scaled view. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 30,
            borderRadius: 16,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {selected ? <ModeCardFX fxKey={fxKey} hex={hex} /> : null}
        </View>

        {/* Icon chip */}
        <View
          style={{
            backgroundColor: selected ? `${hex}24` : colors.surface3,
            borderColor: selected ? `${hex}55` : colors.borderSubtle,
            borderWidth: 1,
            height: 56,
            width: 56,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16,
          }}
        >
          <ModeIcon
            name={iconKey}
            size={iconSize}
            color={selected ? hex : colors.textSecondary}
          />
        </View>

        <Text className="font-sans-sb text-base text-white">{title}</Text>

        {/* Status badge */}
        {comingSoon ? (
          <ComingSoonOverlay label={comingSoonLabel ?? ''} radius={18} />
        ) : locked ? (
          <Lock
            size={22}
            color={colors.muted}
            weight="fill"
            style={{ position: 'absolute', top: 8, right: 8 }}
          />
        ) : selected ? (
          <CheckCircle
            size={24}
            color={hex}
            weight="fill"
            style={{ position: 'absolute', top: 8, right: 8 }}
          />
        ) : (
          <View
            style={{
              borderColor: colors.surface3,
              borderWidth: 2,
              height: 22,
              width: 22,
              borderRadius: 11,
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          />
        )}
      </Animated.View>
    </Pressable>
  );
}

/** Signature per-mode micro-animation, rendered only while the card is selected. */
function ModeCardFX({ fxKey, hex }: { fxKey: ModeFxKey; hex: string }) {
  switch (fxKey) {
    case 'swirl':
      return <SwirlFX hex={hex} />;
    case 'spectral':
      return <SpectralFX hex={hex} />;
    case 'nodes':
      return <NodesFX hex={hex} />;
    case 'scan':
      return <ScanFX hex={hex} />;
    case 'ring':
    default:
      return <RingFX hex={hex} />;
  }
}

/** classic — concentric rings expanding outward. */
function RingFX({ hex }: { hex: string }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.out(Easing.ease) }), -1, false);
    return () => cancelAnimation(t);
  }, [t]);
  const ringStyle = (delay: number) =>
    useAnimatedStyle(() => {
      const p = (t.value + delay) % 1;
      return { transform: [{ scale: 0.6 + p * 0.9 }], opacity: 0.5 * (1 - p) };
    });
  return (
    <>
      <Animated.View
        style={[
          { position: 'absolute', height: 70, width: 70, borderRadius: 35, borderWidth: 2, borderColor: hex },
          ringStyle(0),
        ]}
      />
      <Animated.View
        style={[
          { position: 'absolute', height: 70, width: 70, borderRadius: 35, borderWidth: 2, borderColor: hex },
          ringStyle(0.5),
        ]}
      />
    </>
  );
}

/** chaos — a dashed ring spinning continuously. */
function SwirlFX({ hex }: { hex: string }) {
  const r = useSharedValue(0);
  useEffect(() => {
    r.value = withRepeat(withTiming(1, { duration: 5000, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(r);
  }, [r]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value * 360}deg` }] }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          height: 78,
          width: 78,
          borderRadius: 39,
          borderWidth: 2,
          borderColor: `${hex}66`,
          borderTopColor: hex,
          borderRightColor: hex,
        },
        style,
      ]}
    />
  );
}

/** ghost — soft spectral blobs gently bobbing + shimmering. */
function SpectralFX({ hex }: { hex: string }) {
  const b = useSharedValue(0);
  useEffect(() => {
    b.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    return () => cancelAnimation(b);
  }, [b]);
  const blob = (dx: number, baseOpacity: number, phase: number) =>
    useAnimatedStyle(() => {
      const p = (b.value + phase) % 1;
      return {
        transform: [{ translateX: dx }, { translateY: -6 + p * 12 }],
        opacity: baseOpacity * (0.4 + 0.6 * Math.abs(0.5 - p) * 2),
      };
    });
  return (
    <>
      <Animated.View
        style={[
          { position: 'absolute', height: 30, width: 30, borderRadius: 15, backgroundColor: hex },
          blob(-22, 0.22, 0),
        ]}
      />
      <Animated.View
        style={[
          { position: 'absolute', height: 24, width: 24, borderRadius: 12, backgroundColor: colors.spectral },
          blob(24, 0.2, 0.5),
        ]}
      />
    </>
  );
}

/** syndicate — two nodes joined by a line, pulsing. */
function NodesFX({ hex }: { hex: string }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    return () => cancelAnimation(t);
  }, [t]);
  const style = useAnimatedStyle(() => ({ opacity: 0.3 + t.value * 0.5 }));
  const dot = { position: 'absolute' as const, height: 12, width: 12, borderRadius: 6, backgroundColor: hex };
  return (
    <Animated.View style={[{ position: 'absolute', height: 80, width: 80, alignItems: 'center', justifyContent: 'center' }, style]}>
      <View style={{ position: 'absolute', height: 2, width: 56, backgroundColor: hex, transform: [{ rotate: '24deg' }] }} />
      <View style={[dot, { left: 8, top: 26 }]} />
      <View style={[dot, { right: 8, bottom: 26 }]} />
    </Animated.View>
  );
}

/** detective — an amber scan line sweeping vertically. */
function ScanFX({ hex }: { hex: string }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    return () => cancelAnimation(y);
  }, [y]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -28 + y.value * 56 }],
    opacity: 0.3 + (1 - Math.abs(0.5 - y.value) * 2) * 0.6,
  }));
  return (
    <Animated.View
      style={[
        { position: 'absolute', height: 2, width: 64, backgroundColor: hex, borderRadius: 1 },
        style,
      ]}
    />
  );
}
