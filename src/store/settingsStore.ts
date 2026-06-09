import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  /** Remembered last selections to pre-fill the setup screen. */
  lastMode: string | null;
  lastCategories: string[];
  /** Per-category list of DISABLED words (off). Absent/empty ⇒ all words on. */
  disabledWords: Record<string, string[]>;
  /** Hydration flag so UI can wait for persisted values if needed. */
  _hydrated: boolean;

  setSound: (v: boolean) => void;
  setHaptics: (v: boolean) => void;
  rememberSetup: (mode: string, categories: string[]) => void;
  /** Toggle a single word on/off within a category. */
  toggleWord: (categoryId: string, word: string) => void;
  /** Turn every word in a category on (enable all) or off (disable all). */
  setAllWords: (categoryId: string, allWords: string[], enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      hapticsEnabled: true,
      lastMode: null,
      lastCategories: [],
      disabledWords: {},
      _hydrated: false,

      setSound: (v) => set({ soundEnabled: v }),
      setHaptics: (v) => set({ hapticsEnabled: v }),
      rememberSetup: (mode, categories) => set({ lastMode: mode, lastCategories: categories }),

      toggleWord: (categoryId, word) =>
        set((s) => {
          const current = s.disabledWords[categoryId] ?? [];
          const next = current.includes(word)
            ? current.filter((w) => w !== word)
            : [...current, word];
          return { disabledWords: { ...s.disabledWords, [categoryId]: next } };
        }),

      setAllWords: (categoryId, allWords, enabled) =>
        set((s) => ({
          disabledWords: { ...s.disabledWords, [categoryId]: enabled ? [] : [...allWords] },
        })),
    }),
    {
      name: 'spy-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        soundEnabled: s.soundEnabled,
        hapticsEnabled: s.hapticsEnabled,
        lastMode: s.lastMode,
        lastCategories: s.lastCategories,
        disabledWords: s.disabledWords,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    }
  )
);

/** Words of a category that are currently enabled (not disabled). */
export function enabledWords(allWords: string[], disabled: string[] | undefined): string[] {
  if (!disabled || disabled.length === 0) return allWords;
  const off = new Set(disabled);
  return allWords.filter((w) => !off.has(w));
}
