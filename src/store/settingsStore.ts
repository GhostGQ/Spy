import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  /** Remembered last selections to pre-fill the setup screen. */
  lastMode: string | null;
  lastCategories: string[];
  /** Hydration flag so UI can wait for persisted values if needed. */
  _hydrated: boolean;

  setSound: (v: boolean) => void;
  setHaptics: (v: boolean) => void;
  rememberSetup: (mode: string, categories: string[]) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      hapticsEnabled: true,
      lastMode: null,
      lastCategories: [],
      _hydrated: false,

      setSound: (v) => set({ soundEnabled: v }),
      setHaptics: (v) => set({ hapticsEnabled: v }),
      rememberSetup: (mode, categories) => set({ lastMode: mode, lastCategories: categories }),
    }),
    {
      name: 'spy-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        soundEnabled: s.soundEnabled,
        hapticsEnabled: s.hapticsEnabled,
        lastMode: s.lastMode,
        lastCategories: s.lastCategories,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    }
  )
);
