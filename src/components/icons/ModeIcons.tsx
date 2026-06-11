import type { ReactNode } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '@/theme/colors';

export type ModeIconKey = 'spy' | 'chaos' | 'ghost' | 'syndicate' | 'detective';

interface IconProps {
  size?: number;
  color?: string;
}

const base = (color: string) => ({
  fill: 'none' as const,
  stroke: color,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

/** Secret agent — fedora hat + domino mask. */
export function SpyIcon({ size = 28, color = colors.accent }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path {...base(color)} d="M6.5 10 C6.5 5.5 17.5 5.5 17.5 10" />
      <Path {...base(color)} d="M3.5 10.5 H20.5" />
      <Path
        {...base(color)}
        d="M5 15 C5 13.4 8 13 9.6 14 C11 14.8 13 14.8 14.4 14 C16 13 19 13.4 19 15 C19 17 16 17.8 14 16.8 C12.4 16 11.6 16 10 16.8 C8 17.8 5 17 5 15 Z"
      />
      <Circle cx="9" cy="15.2" r="0.9" fill={color} />
      <Circle cx="15" cy="15.2" r="0.9" fill={color} />
    </Svg>
  );
}

/** Chaos — tornado / funnel. */
export function ChaosIcon({ size = 28, color = colors.accent }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path {...base(color)} d="M3.5 5.5 H20.5" />
      <Path {...base(color)} d="M5.5 9.5 H17.5" />
      <Path {...base(color)} d="M8 13.5 H15" />
      <Path {...base(color)} d="M10.5 17.5 H13.5" />
      <Path {...base(color)} d="M12 17.5 C12 19.6 10 20.4 8.7 21" />
    </Svg>
  );
}

/** Ghost — rounded body with wavy hem and two eyes. */
export function GhostIcon({ size = 28, color = colors.accent }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        {...base(color)}
        d="M5 20.5 V11 a7 7 0 0 1 14 0 V20.5 l-2.3 -1.7 l-2.3 1.7 l-2.4 -1.7 l-2.4 1.7 l-2.3 -1.7 Z"
      />
      <Circle cx="9.5" cy="11" r="1.1" fill={color} />
      <Circle cx="14.5" cy="11" r="1.1" fill={color} />
    </Svg>
  );
}

/** Syndicate — two masked figures connected (a spy team / network). */
export function SyndicateIcon({ size = 28, color = colors.accent }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* link between the two heads */}
      <Path {...base(color)} d="M9.2 7.4 L14.8 7.4" />
      {/* left figure */}
      <Circle {...base(color)} cx="7" cy="7" r="3" />
      <Path {...base(color)} d="M2.5 19 C2.5 14.8 11.5 14.8 11.5 19" />
      {/* right figure */}
      <Circle {...base(color)} cx="17" cy="7" r="3" />
      <Path {...base(color)} d="M12.5 19 C12.5 14.8 21.5 14.8 21.5 19" />
    </Svg>
  );
}

/** Detective — magnifying glass. */
export function DetectiveIcon({ size = 28, color = colors.accent }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle {...base(color)} cx="10.5" cy="10.5" r="6" />
      <Path {...base(color)} d="M15 15 L20.5 20.5" />
    </Svg>
  );
}

const REGISTRY: Record<ModeIconKey, (props: IconProps) => ReactNode> = {
  spy: SpyIcon,
  chaos: ChaosIcon,
  ghost: GhostIcon,
  syndicate: SyndicateIcon,
  detective: DetectiveIcon,
};

/** Dispatch a mode icon by key. */
export function ModeIcon({ name, ...props }: IconProps & { name: ModeIconKey }) {
  const Cmp = REGISTRY[name] ?? SpyIcon;
  return <Cmp {...props} />;
}
