import { getCategory } from '@/data/categories';
import type { GameConfig, Role } from '@/game/types';

/** A selected category paired with its currently enabled words. */
export interface WordPool {
  categoryId: string;
  words: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWord(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)];
}

/** Pick a second word that differs from `exclude`. */
function pickDifferentWord(words: string[], exclude: string): string {
  const pool = words.filter((w) => w !== exclude);
  if (pool.length === 0) return exclude;
  return pool[Math.floor(Math.random() * pool.length)];
}

export interface AssignResult {
  roles: Role[];
  /** The real secret word for the round (shown in summary). */
  word: string;
  /** Ghost mode only — the fake word given to ghosts. */
  fakeWord: string | null;
  /** Effective number of special roles (after randomization/clamping). */
  specialCount: number;
  /** The category actually used for this round (chosen from the selected ones). */
  categoryId: string;
}

/**
 * Clamp the configured special-role count so civilians remain the majority.
 * Used for classic & ghost. Range: 1..(playerCount-1) but never >= civilians,
 * i.e. max = floor((playerCount - 1) / 2) is too strict; we keep civilians
 * strictly greater, so max special = playerCount - civiliansMin where
 * civiliansMin = special + 1  ->  special <= (playerCount - 1).
 * Requirement: civilians > special  =>  special < playerCount/2.
 */
export function maxSpecialMajority(playerCount: number): number {
  // civilians must be strictly greater than special roles
  return Math.max(1, playerCount - 1);
}

/**
 * Core role assignment. Pure function of config + the enabled word pools
 * (+ Math.random). `pools` are the selected categories with their enabled words.
 */
export function assignRoles(config: GameConfig, pools: WordPool[]): AssignResult {
  // Pick one (non-empty) pool at random, then a word from it. Fall back to the
  // full word list of the first selected category if nothing is enabled.
  const usable = pools.filter((p) => p.words.length > 0);
  const pool: WordPool =
    usable.length > 0
      ? usable[Math.floor(Math.random() * usable.length)]
      : (() => {
          const id = config.categoryIds[0] ?? 'food';
          return { categoryId: id, words: getCategory(id).words };
        })();

  const categoryId = pool.categoryId;
  const word = pickWord(pool.words);
  const n = config.playerCount;

  let specialCount: number;
  let fakeWord: string | null = null;
  // Ghost mode "classic" variant: spies + exactly one ghost.
  const ghostClassic = config.mode === 'ghost' && config.ghostClassic;

  // Build kind array, then shuffle the assignment.
  const kinds: Role['kind'][] = [];

  if (config.mode === 'chaos') {
    // Hidden, randomized at start. Can exceed civilians, but at least 1 civilian.
    specialCount = randomInt(1, n - 1);
    for (let i = 0; i < specialCount; i++) kinds.push('spy');
  } else if (ghostClassic) {
    // Spies (who know they're spies) + exactly one ghost. Keep civilians the
    // majority over all special roles, so the spy count leaves room for the ghost.
    fakeWord = pickDifferentWord(pool.words, word);
    const maxSpies = Math.max(1, maxSpecialMajority(n) - 1);
    const spyCount = Math.min(Math.max(1, config.specialCount), maxSpies);
    specialCount = spyCount + 1; // spies + the single ghost
    for (let i = 0; i < spyCount; i++) kinds.push('spy');
    kinds.push('ghost');
  } else if (config.mode === 'ghost') {
    // Pure ghost game: no spies, everyone told they're a civilian.
    fakeWord = pickDifferentWord(pool.words, word);
    specialCount = Math.min(Math.max(1, config.specialCount), maxSpecialMajority(n));
    for (let i = 0; i < specialCount; i++) kinds.push('ghost');
  } else {
    // classic
    specialCount = Math.min(Math.max(1, config.specialCount), maxSpecialMajority(n));
    for (let i = 0; i < specialCount; i++) kinds.push('spy');
  }

  while (kinds.length < n) kinds.push('civilian');

  const shuffledKinds = shuffle(kinds);

  const roles: Role[] = shuffledKinds.map((kind, index) => {
    // Pure ghost game: everyone is told they're a civilian; ghosts secretly
    // hold the fake word. (Classic-ghost spies are still told they're spies.)
    if (config.mode === 'ghost' && !ghostClassic) {
      return {
        id: index,
        player: index + 1,
        kind,
        labelKey: 'civilian',
        word: kind === 'ghost' ? (fakeWord as string) : word,
      };
    }
    if (kind === 'spy') {
      return { id: index, player: index + 1, kind, labelKey: 'spy', word: null };
    }
    if (kind === 'ghost') {
      // Ghost thinks it's a civilian but holds the fake word.
      return { id: index, player: index + 1, kind, labelKey: 'civilian', word: fakeWord as string };
    }
    return { id: index, player: index + 1, kind, labelKey: 'civilian', word };
  });

  return { roles, word, fakeWord, specialCount, categoryId };
}
