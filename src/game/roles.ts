import { getCategory } from '@/data/categories';
import type { GameConfig, Role } from '@/game/types';

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
  return Math.max(1, Math.ceil(playerCount / 2) - 1);
}

/**
 * Core role assignment. Pure function of config (+ Math.random).
 */
export function assignRoles(config: GameConfig): AssignResult {
  // Pick one category at random from the selected ones, then a word from it.
  const ids = config.categoryIds.length ? config.categoryIds : ['food'];
  const categoryId = ids[Math.floor(Math.random() * ids.length)];
  const category = getCategory(categoryId);
  const word = pickWord(category.words);
  const n = config.playerCount;

  let specialCount: number;
  let fakeWord: string | null = null;

  if (config.mode === 'chaos') {
    // Hidden, randomized at start. Can exceed civilians, but at least 1 civilian.
    specialCount = randomInt(1, n - 1);
  } else if (config.mode === 'ghost') {
    fakeWord = pickDifferentWord(category.words, word);
    specialCount = Math.min(Math.max(1, config.specialCount), maxSpecialMajority(n));
  } else {
    // classic
    specialCount = Math.min(Math.max(1, config.specialCount), maxSpecialMajority(n));
  }

  // Build kind array, then shuffle the assignment.
  const kinds: Role['kind'][] = [];
  const specialKind: Role['kind'] = config.mode === 'ghost' ? 'ghost' : 'spy';
  for (let i = 0; i < specialCount; i++) kinds.push(specialKind);
  for (let i = specialCount; i < n; i++) kinds.push('civilian');

  const shuffledKinds = shuffle(kinds);

  const roles: Role[] = shuffledKinds.map((kind, index) => {
    if (config.mode === 'ghost') {
      // Everyone is told they are a civilian. Ghosts secretly get the fake word.
      return {
        id: index,
        player: index + 1,
        kind,
        label: 'Мирный',
        word: kind === 'ghost' ? (fakeWord as string) : word,
      };
    }
    // classic / chaos
    if (kind === 'spy') {
      return { id: index, player: index + 1, kind, label: 'Шпион', word: null };
    }
    return { id: index, player: index + 1, kind, label: 'Мирный', word };
  });

  return { roles, word, fakeWord, specialCount, categoryId };
}
