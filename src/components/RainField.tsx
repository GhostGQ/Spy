import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface Props {
  /** Number of rain streaks. */
  count?: number;
  /** Streak color (keep low alpha). */
  color?: string;
  /** Overall opacity of the field. */
  opacity?: number;
}

interface Drop {
  left: number; // %
  len: number;
  width: number;
  duration: number;
  delay: number;
  alpha: number;
}

/**
 * Subtle noir rain — thin translucent streaks falling on a slight slant. Pure
 * transform/opacity animation, decorative only, sits behind content.
 */
export function RainField({ count = 22, color = '#C2C4CE', opacity = 0.5 }: Props) {
  const { height } = useWindowDimensions();
  const drops = useMemo<Drop[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        len: 50 + Math.random() * 90,
        width: Math.random() < 0.3 ? 2 : 1,
        duration: 900 + Math.random() * 1100,
        delay: Math.random() * 2000,
        alpha: 0.12 + Math.random() * 0.3,
      })),
    [count]
  );

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity, overflow: 'hidden' }]}>
      {drops.map((d, i) => (
        <RainDrop key={i} drop={d} travel={height} color={color} />
      ))}
    </View>
  );
}

function RainDrop({ drop, travel, color }: { drop: Drop; travel: number; color: string }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(
      drop.delay,
      withRepeat(withTiming(1, { duration: drop.duration, easing: Easing.linear }), -1, false)
    );
    return () => cancelAnimation(p);
  }, [p, drop.delay, drop.duration]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -drop.len + p.value * (travel + drop.len) }],
    // fade in at the top and out near the bottom so streaks don't pop
    opacity: drop.alpha * (p.value < 0.1 ? p.value / 0.1 : p.value > 0.85 ? (1 - p.value) / 0.15 : 1),
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: `${drop.left}%`,
          width: drop.width,
          height: drop.len,
          borderRadius: drop.width,
          backgroundColor: color,
          transform: [{ rotate: '8deg' }],
        },
        style,
      ]}
    />
  );
}
