import {
  Briefcase,
  Buildings,
  Car,
  FilmSlate,
  ForkKnife,
  GlobeHemisphereWest,
  type Icon,
  type IconProps,
  MusicNotes,
  PawPrint,
  SoccerBall,
  Trophy,
} from 'phosphor-react-native';

import { colors } from '@/theme/colors';

const MAP: Record<string, Icon> = {
  food: ForkKnife,
  cities: Buildings,
  animals: PawPrint,
  professions: Briefcase,
  sport: Trophy,
  movies: FilmSlate,
  transport: Car,
  music: MusicNotes,
  countries: GlobeHemisphereWest,
};

interface Props {
  id: string;
  size?: number;
  color?: string;
  weight?: IconProps['weight'];
}

/** Category icon (Phosphor) resolved by category id. */
export function CategoryIcon({ id, size = 26, color = colors.accent, weight = 'bold' }: Props) {
  const Cmp = MAP[id] ?? SoccerBall;
  return <Cmp size={size} color={color} weight={weight} />;
}
