import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import i18n, { type AppLanguage } from '@/i18n';

/** Native in-app review dialog. Best-effort: unsupported platforms just no-op. */
async function requestReview() {
  try {
    const StoreReview = await import('expo-store-review');
    if (await StoreReview.hasAction()) await StoreReview.requestReview();
  } catch {
    // no store review available (web/dev client) — ignore
  }
}

interface SettingsState {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  /** Chosen UI language. `null` ⇒ follow the device locale (initial state). */
  language: AppLanguage | null;
  /** Remembered last selections to pre-fill the setup screen. */
  lastMode: string | null;
  lastCategories: string[];
  /** Per-category list of DISABLED words (off). Absent/empty ⇒ all words on. */
  disabledWords: Record<string, string[]>;
  /** Show spy-helping question hints on the discussion timer screen. */
  hintsEnabled: boolean;
  /** Rounds finished, and whether the store-review prompt was already fired. */
  roundsPlayed: number;
  reviewAsked: boolean;
  /** Hydration flag so UI can wait for persisted values if needed. */
  _hydrated: boolean;

  setSound: (v: boolean) => void;
  setHaptics: (v: boolean) => void;
  setHints: (v: boolean) => void;
  setLanguage: (lang: AppLanguage) => void;
  rememberSetup: (mode: string, categories: string[]) => void;
  /** Count a finished round and ask for a store review once, at the 3rd one. */
  finishRound: () => void;
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
      language: null,
      lastMode: null,
      lastCategories: [],
      disabledWords: {},
      hintsEnabled: true,
      roundsPlayed: 0,
      reviewAsked: false,
      _hydrated: false,

      setSound: (v) => set({ soundEnabled: v }),
      setHaptics: (v) => set({ hapticsEnabled: v }),
      setHints: (v) => set({ hintsEnabled: v }),
      setLanguage: (lang) => {
        set({ language: lang });
        i18n.changeLanguage(lang);
      },
      rememberSetup: (mode, categories) => set({ lastMode: mode, lastCategories: categories }),

      finishRound: () =>
        set((s) => {
          const roundsPlayed = s.roundsPlayed + 1;
          if (s.reviewAsked || roundsPlayed < 3) return { roundsPlayed };
          // Fire-and-forget: the OS decides whether to actually show the dialog
          // (and silently ignores it past its own quota), so there's nothing to
          // react to — we just never ask again.
          void requestReview();
          return { roundsPlayed, reviewAsked: true };
        }),

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
        language: s.language,
        lastMode: s.lastMode,
        lastCategories: s.lastCategories,
        disabledWords: s.disabledWords,
        hintsEnabled: s.hintsEnabled,
        roundsPlayed: s.roundsPlayed,
        reviewAsked: s.reviewAsked,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hydrated = true;
          // Apply the persisted language (if the user picked one) over the
          // device-locale default that i18n initialized with.
          if (state.language) i18n.changeLanguage(state.language);
        }
      },
    }
  )
);
