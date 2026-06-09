import type { ModeIconKey } from '@/components/icons/ModeIcons';
import type { GameConfig, ModeId, WinnerOption } from '@/game/types';

export interface ModeMeta {
  id: ModeId;
  title: string;
  /** Custom SVG icon key (setup screen). */
  iconKey: ModeIconKey;
  /** Legacy emoji (still used by the rules screen until it is redesigned). */
  emoji: string;
  short: string;
  description: string;
  /** Whether the player configures the special-role count on setup. */
  configurableSpecialCount: boolean;
  /** Label for the special-role count stepper (when configurable). */
  specialCountLabel: string;
  /** Winner buttons shown on the result screen. */
  winners: WinnerOption[];
}

export const MODES: ModeMeta[] = [
  {
    id: 'classic',
    title: 'Классический',
    iconKey: 'spy',
    emoji: '🕵️',
    short: 'Мирные знают слово, шпионы — нет',
    description:
      'Все мирные видят одно секретное слово. Шпионы слова не знают и пытаются не выдать себя в обсуждении. Количество шпионов вы задаёте сами.',
    configurableSpecialCount: true,
    specialCountLabel: 'Шпионы',
    winners: [
      { key: 'civilians', label: 'Победили гражданские', accent: 'streak' },
      { key: 'spies', label: 'Победили шпионы', accent: 'danger' },
      { key: 'skip', label: 'Пропустить', accent: 'muted' },
    ],
  },
  {
    id: 'chaos',
    title: 'Хаос',
    iconKey: 'chaos',
    emoji: '🌀',
    short: 'Число шпионов скрыто и случайно',
    description:
      'Как классический, но количество шпионов не известно заранее — оно случайно определяется при старте. Шпионов может оказаться даже больше, чем мирных.',
    configurableSpecialCount: false,
    specialCountLabel: 'Шпионы',
    winners: [
      { key: 'civilians', label: 'Победили гражданские', accent: 'streak' },
      { key: 'spies', label: 'Победили шпионы', accent: 'danger' },
      { key: 'skip', label: 'Пропустить', accent: 'muted' },
    ],
  },
  {
    id: 'ghost',
    title: 'Призрак',
    iconKey: 'ghost',
    emoji: '👻',
    short: 'Призраки не знают, что они призраки',
    description:
      'Все думают, что они мирные. Призраки видят похожее, но другое слово — и сами не знают, что они призраки. Задача большинства — вычислить тех, кто говорит «не о том».\n\nРежим «Классический призрак»: включается переключателем в настройках. К обычным шпионам (которые знают свою роль, но не знают слова) добавляется один тайный призрак с фейк-словом. Мирные ищут и шпионов, и призрака одновременно.',
    configurableSpecialCount: true,
    specialCountLabel: 'Призраки',
    winners: [
      { key: 'majority', label: 'Победило большинство', accent: 'info' },
      { key: 'ghosts', label: 'Победили призраки', accent: 'level' },
      { key: 'skip', label: 'Пропустить', accent: 'muted' },
    ],
  },
];

export function getMode(id: ModeId): ModeMeta {
  return MODES.find((m) => m.id === id) ?? MODES[0];
}

/** Winner buttons shown on the result screen for a specific configuration. */
export function getWinners(config: GameConfig): WinnerOption[] {
  // The "classic ghost" variant plays like classic (spies vs civilians),
  // so it uses the classic winner options rather than majority/ghosts.
  if (config.mode === 'ghost' && config.ghostClassic) {
    return getMode('classic').winners;
  }
  return getMode(config.mode).winners;
}
