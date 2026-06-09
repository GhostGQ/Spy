import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { useSettingsStore } from '@/store/settingsStore';

/** Whether haptics should fire right now (user setting + platform support). */
function enabled(): boolean {
  return Platform.OS !== 'web' && useSettingsStore.getState().hapticsEnabled;
}

/** Light tap — for selectable cards, tiles, toggles. */
export function hapticSelection(): void {
  if (!enabled()) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** Medium tap — for primary actions like starting the timer. */
export function hapticImpact(): void {
  if (!enabled()) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

/** Success / warning / error notification feedback. */
export function hapticNotify(
  type: 'success' | 'warning' | 'error' = 'success'
): void {
  if (!enabled()) return;
  const map = {
    success: Haptics.NotificationFeedbackType.Success,
    warning: Haptics.NotificationFeedbackType.Warning,
    error: Haptics.NotificationFeedbackType.Error,
  } as const;
  Haptics.notificationAsync(map[type]).catch(() => {});
}
