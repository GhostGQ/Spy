export type ModeId = 'classic' | 'chaos' | 'ghost';

export type RoleKind = 'civilian' | 'spy' | 'ghost';

/** Winner option keys used on the result screen. */
export type Winner = 'civilians' | 'spies' | 'majority' | 'ghosts' | 'skip';

export interface Category {
  id: string;
  title: string;
  emoji: string;
  words: string[];
}

/** A single player's secret card produced by role assignment. */
export interface Role {
  id: number;
  /** Player order number shown on screen (1-based). */
  player: number;
  kind: RoleKind;
  /** What the player is told they are, e.g. «Мирный» / «Шпион». */
  label: string;
  /** The word shown to this player, or null if none (spies). */
  word: string | null;
}

/** Configuration chosen on the setup + category screens. */
export interface GameConfig {
  mode: ModeId;
  /** One or more selected categories. The round picks a word from one of them. */
  categoryIds: string[];
  playerCount: number;
  /** Spies (classic) or ghosts (ghost). Ignored for chaos (randomized at start). */
  specialCount: number;
}

export interface WinnerOption {
  key: Winner;
  label: string;
  /** Tailwind text/bg accent token, e.g. 'streak' | 'danger' | 'level'. */
  accent: 'streak' | 'danger' | 'level' | 'info' | 'muted';
}
