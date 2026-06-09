import { create } from 'zustand';

import { assignRoles } from '@/game/roles';
import type { GameConfig, ModeId, Role, Winner } from '@/game/types';

const DEFAULT_CONFIG: GameConfig = {
  mode: 'classic',
  categoryIds: ['food'],
  playerCount: 4,
  specialCount: 1,
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
  patchConfig: (patch) => set((s) => ({ config: { ...s.config, ...patch } })),

  startGame: () => {
    const { config } = get();
    const result = assignRoles(config);
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
    const result = assignRoles(config);
    set({
      roles: result.roles,
      word: result.word,
      fakeWord: result.fakeWord,
      roundCategoryId: result.categoryId,
      effectiveSpecialCount: result.specialCount,
      winner: null,
    });
  },

  reset: () =>
    set({
      config: DEFAULT_CONFIG,
      roles: [],
      word: '',
      fakeWord: null,
      roundCategoryId: '',
      effectiveSpecialCount: 0,
      durationSec: 180,
      winner: null,
    }),
}));
