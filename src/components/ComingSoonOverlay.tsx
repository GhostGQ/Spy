import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

/**
 * Frosted overlay for "coming soon" cards: blurs whatever the card renders
 * underneath (icon + title) so the upcoming content stays a mystery, with a
 * sharp "Скоро" badge floating on top. A dark scrim is layered over the blur so
 * the content is obscured even where the native blur is weak (Android).
 */
export function ComingSoonOverlay({ label, radius = 16 }: { label: string; radius?: number }) {
  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        { borderRadius: radius, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <BlurView
        intensity={Platform.OS === 'android' ? 25 : 30}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: `${colors.bg}73` }]} />
      <View
        style={{ backgroundColor: colors.surface3, borderColor: colors.borderSubtle }}
        className="rounded-full border px-3.5 py-1.5"
      >
        <Text className="font-sans-b text-xs uppercase tracking-widest text-white">{label}</Text>
      </View>
    </View>
  );
}
