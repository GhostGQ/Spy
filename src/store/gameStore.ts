import { create } from 'zustand';

import { IAP_ENABLED, TESTING_FULL_ACCESS } from '@/config/iap';
import { CATEGORIES_DATA, enabledLocalizedWords } from '@/data/categories';
import { assignRoles, type WordPool } from '@/game/roles';
import type { GameConfig, ModeId, Role, Winner } from '@/game/types';
import { usePurchaseStore } from '@/store/purchaseStore';
import { useSettingsStore } from '@/store/settingsStore';

/** Build the enabled-word pools for the currently selected categories. */
function buildPools(config: GameConfig): WordPool[] {
  const disabled = useSettingsStore.getState().disabledWords;
  return config.categoryIds.map((id) => ({
    categoryId: id,
    words: enabledLocalizedWords(id, disabled[id]),
  }));
}

const DEFAULT_CONFIG: GameConfig = {
  mode: 'classic',
  categoryIds: [],
  playerCount: 4,
  specialCount: 1,
  ghostClassic: false,
};

interface GameState {
  config: GameConfig;
  roles: Role[];
  word: string;
  fakeWord: string | null;
  /** Category actually used for the dealt round (for the summary screen). */
  roundCategoryId: string;
  /** Effective special count after randomization (chaos) / clamping. */
  effectiveSpecialCount: number;
  /** Chosen discussion duration in seconds. */
  durationSec: number;
  winner: Winner | null;

  // --- setup actions ---
  setMode: (mode: ModeId) => void;
  toggleCategory: (categoryId: string) => void;
  setPlayerCount: (n: number) => void;
  setSpecialCount: (n: number) => void;
  setGhostClassic: (on: boolean) => void;
  patchConfig: (patch: Partial<GameConfig>) => void;

  // --- flow actions ---
  /** Deal roles from the current config. Call before navigating to /game/roles. */
  startGame: () => void;
  setDuration: (sec: number) => void;
  setWinner: (winner: Winner) => void;
  /** Re-deal roles keeping the same config (Сыграть ещё раз). */
  playAgain: () => void;
  /** Full reset to defaults (Главное меню / new game). */
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  config: DEFAULT_CONFIG,
  roles: [],
  word: '',
  fakeWord: null,
  roundCategoryId: '',
  effectiveSpecialCount: 0,
  durationSec: 180,
  winner: null,

  setMode: (mode) => set((s) => ({ config: { ...s.config, mode } })),
  toggleCategory: (categoryId) =>
    set((s) => {
      const has = s.config.categoryIds.includes(categoryId);
      // Don't allow removing the last remaining category.
      const next = has
        ? s.config.categoryIds.filter((id) => id !== categoryId)
        : [...s.config.categoryIds, categoryId];
      const categoryIds = next.length ? next : s.config.categoryIds;
      return { config: { ...s.config, categoryIds } };
    }),
  setPlayerCount: (n) =>
    set((s) => {
      const playerCount = Math.max(3, Math.min(12, n));
      // keep specialCount valid (< playerCount)
      const specialCount = Math.min(s.config.specialCount, playerCount - 1);
      return { config: { ...s.config, playerCount, specialCount } };
    }),
  setSpecialCount: (n) =>
    set((s) => ({
      config: { ...s.config, specialCount: Math.max(1, Math.min(n, s.config.playerCount - 1)) },
    })),
  setGhostClassic: (on) => set((s) => ({ config: { ...s.config, ghostClassic: on } })),
  patchConfig: (patch) => set((s) => ({ config: { ...s.config, ...patch } })),

  startGame: () => {
    const { config } = get();
    useSettingsStore.getState().rememberSetup(config.mode, config.categoryIds);
    const result = assignRoles(config, buildPools(config));
    set({
      roles: result.roles,
      word: result.word,
      fakeWord: result.fakeWord,
      roundCategoryId: result.categoryId,
      effectiveSpecialCount: result.specialCount,
      winner: null,
    });
  },

  setDuration: (sec) => set({ durationSec: sec }),
  setWinner: (winner) => set({ winner }),

  playAgain: () => {
    const { config } = get();
    const result = assignRoles(config, buildPools(config));
    set({
      roles: result.roles,
      word: result.word,
      fakeWord: result.fakeWord,
      roundCategoryId: result.categoryId,
      effectiveSpecialCount: result.specialCount,
      winner: null,
    });
  },

  reset: () => {
    const { lastCategories, lastMode } = useSettingsStore.getState();
    // Keep only ids that still exist in the current category data — stale ids
    // from older app versions would otherwise inflate the selected count.
    // While IAP is disabled, premium categories aren't shown, so drop them too.
    const validIds = new Set(
      CATEGORIES_DATA.filter((c) => IAP_ENABLED || TESTING_FULL_ACCESS || !c.premium).map((c) => c.id)
    );
    const restored = lastCategories.filter((id) => validIds.has(id));
    const categoryIds = restored.length ? restored : DEFAULT_CONFIG.categoryIds;
    const restoredMode = (lastMode as GameConfig['mode']) ?? DEFAULT_CONFIG.mode;
    // Don't restore a premium mode the user no longer has access to.
    const mode = usePurchaseStore.getState().isModeLocked(restoredMode)
      ? DEFAULT_CONFIG.mode
      : restoredMode;
    set({
      config: { ...DEFAULT_CONFIG, mode, categoryIds },
      roles: [],
      word: '',
      fakeWord: null,
      roundCategoryId: '',
      effectiveSpecialCount: 0,
      durationSec: 180,
      winner: null,
    });
  },
}));
