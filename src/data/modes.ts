import type { ModeIconKey } from '@/components/icons/ModeIcons';
import type { GameConfig, ModeId, Winner, WinnerOption } from '@/game/types';
import i18n from '@/i18n';

/** Structural (language-independent) mode metadata. Display text lives in i18n. */
export interface ModeMeta {
  id: ModeId;
  /** Custom SVG icon key (setup screen). */
  iconKey: ModeIconKey;
  /** Legacy emoji (still used by the rules screen until it is redesigned). */
  emoji: string;
  /** Whether the player configures the special-role count on setup. */
  configurableSpecialCount: boolean;
}

const MODES_DATA: ModeMeta[] = [
  { id: 'classic', iconKey: 'spy', emoji: '🕵️', configurableSpecialCount: true },
  { id: 'chaos', iconKey: 'chaos', emoji: '🌀', configurableSpecialCount: false },
  { id: 'ghost', iconKey: 'ghost', emoji: '👻', configurableSpecialCount: true },
  { id: 'syndicate', iconKey: 'syndicate', emoji: '🕶️', configurableSpecialCount: true },
  { id: 'detective', iconKey: 'detective', emoji: '🔍', configurableSpecialCount: true },
];

/** Winner button keys/accents per mode (labels are localized at read time). */
const MODE_WINNERS: Record<ModeId, { key: Winner; accent: WinnerOption['accent'] }[]> = {
  classic: [
    { key: 'civilians', accent: 'streak' },
    { key: 'spies', accent: 'danger' },
    { key: 'skip', accent: 'muted' },
  ],
  chaos: [
    { key: 'civilians', accent: 'streak' },
    { key: 'spies', accent: 'danger' },
    { key: 'skip', accent: 'muted' },
  ],
  ghost: [
    { key: 'majority', accent: 'info' },
    { key: 'ghosts', accent: 'level' },
    { key: 'skip', accent: 'muted' },
  ],
  syndicate: [
    { key: 'civilians', accent: 'streak' },
    { key: 'spies', accent: 'danger' },
    { key: 'skip', accent: 'muted' },
  ],
  detective: [
    { key: 'civilians', accent: 'streak' },
    { key: 'spies', accent: 'danger' },
    { key: 'skip', accent: 'muted' },
  ],
};

/** A mode with all display strings resolved in the active language. */
export interface LocalizedMode extends ModeMeta {
  title: string;
  short: string;
  description: string;
  /** Label for the special-role count stepper (when configurable). */
  specialCountLabel: string;
  /** Winner buttons shown on the result screen. */
  winners: WinnerOption[];
}

function localizeWinners(keys: { key: Winner; accent: WinnerOption['accent'] }[]): WinnerOption[] {
  return keys.map((w) => ({ key: w.key, accent: w.accent, label: i18n.t(`winners.${w.key}`) }));
}

export function getMode(id: ModeId): LocalizedMode {
  const meta = MODES_DATA.find((m) => m.id === id) ?? MODES_DATA[0];
  return {
    ...meta,
    title: i18n.t(`modes.${meta.id}.title`),
    short: i18n.t(`modes.${meta.id}.short`),
    description: i18n.t(`modes.${meta.id}.description`),
    specialCountLabel: i18n.t(`modes.${meta.id}.specialCount`),
    winners: localizeWinners(MODE_WINNERS[meta.id]),
  };
}

/** All modes, localized. */
export function getModes(): LocalizedMode[] {
  return MODES_DATA.map((m) => getMode(m.id));
}

/** Winner buttons shown on the result screen for a specific configuration. */
export function getWinners(config: GameConfig): WinnerOption[] {
  // The "classic ghost" variant plays like classic (spies vs civilians),
  // so it uses the classic winner options rather than majority/ghosts.
  if (config.mode === 'ghost' && config.ghostClassic) {
    return localizeWinners(MODE_WINNERS.classic);
  }
  return localizeWinners(MODE_WINNERS[config.mode]);
}
