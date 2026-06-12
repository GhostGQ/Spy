export type ModeId = 'classic' | 'chaos' | 'ghost' | 'syndicate' | 'detective';

export type RoleKind = 'civilian' | 'spy' | 'ghost';

/** Winner option keys used on the result screen. */
export type Winner = 'civilians' | 'spies' | 'majority' | 'ghosts' | 'skip' | 'detectiveCaught';

export interface Category {
  id: string;
  title: string;
  words: string[];
}

/** A single player's secret card produced by role assignment. */
export interface Role {
  id: number;
  /** Player order number shown on screen (1-based). */
  player: number;
  kind: RoleKind;
  /**
   * What the player is *told* they are (resolved to text at display time via
   * i18n `roles.<labelKey>`). In the pure ghost game a ghost is told it's a
   * civilian, so labelKey differs from `kind`.
   */
  labelKey: 'civilian' | 'spy' | 'detective';
  /** The word shown to this player, or null if none (spies). */
  word: string | null;
  /**
   * Syndicate mode only — the player numbers of this spy's teammates (the other
   * spies). Shown on the spy's own card so the syndicate can coordinate.
   */
  teammates?: number[];
  /**
   * Detective mode only — the detective's passive tip: another player's number
   * and whether that player is a spy.
   */
  detectiveTip?: { player: number; isSpy: boolean };
}

/** Configuration chosen on the setup + category screens. */
export interface GameConfig {
  mode: ModeId;
  /** One or more selected categories. The round picks a word from one of them. */
  categoryIds: string[];
  playerCount: number;
  /** Spies (classic) or ghosts (ghost). Ignored for chaos (randomized at start). */
  specialCount: number;
  /**
   * Ghost mode only. When false (default) it's the pure ghost game: no spies,
   * everyone is told they're a civilian, `specialCount` ghosts hold a fake word.
   * When true it's the "classic ghost" variant: `specialCount` spies (who know
   * they're spies) plus exactly one ghost.
   */
  ghostClassic: boolean;
}

export interface WinnerOption {
  key: Winner;
  label: string;
  /** Tailwind text/bg accent token, e.g. 'streak' | 'danger' | 'level'. */
  accent: 'streak' | 'danger' | 'level' | 'info' | 'muted';
}
