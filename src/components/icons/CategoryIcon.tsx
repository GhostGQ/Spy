import {
  Briefcase,
  Buildings,
  FilmSlate,
  ForkKnife,
  type Icon,
  type IconProps,
  GameControllerIcon,
  MapPinLineIcon,
  SoccerBall,
  Heart,
  TrademarkRegistered,
  Sparkle,
  Sword,
  Scroll,
  Star,
} from 'phosphor-react-native';

import {colors} from '@/theme/colors';

const MAP: Record<string, Icon> = {
  locations: MapPinLineIcon,
  food: ForkKnife,
  cities: Buildings,
  professions: Briefcase,
  relationships: Heart,
  games: GameControllerIcon,
  movies: FilmSlate,

  brands: TrademarkRegistered,
  anime: Sparkle,
  game_characters: Sword,
  historical_figures: Scroll,
  celebrities: Star,
};

interface Props {
  id: string;
  size?: number;
  color?: string;
  weight?: IconProps['weight'];
}

/** Category icon (Phosphor) resolved by category id. */
export function CategoryIcon({
  id,
  size = 26,
  color = colors.accent,
  weight = 'bold',
}: Props) {
  const Cmp = MAP[id] ?? SoccerBall;
  return <Cmp size={size} color={color} weight={weight} />;
}
