import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

interface Props {
  size?: number;
}

/**
 * Film-noir emblem — a fedora-hatted detective bust lit from one side
 * (chiaroscuro), crossed by venetian-blind light bars, in monochrome steel on
 * near-black. Pure vector (crisp at any size); the menu sits it over the rain.
 */
export function SpyHero({ size = 240 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 240 240">
      <Defs>
        {/* soft ambient vignette behind the figure */}
        <RadialGradient id="vig" cx="50%" cy="44%" r="58%">
          <Stop offset="0%" stopColor="#A6ADBE" stopOpacity={0.16} />
          <Stop offset="60%" stopColor="#6E7689" stopOpacity={0.05} />
          <Stop offset="100%" stopColor="#6E7689" stopOpacity={0} />
        </RadialGradient>
        {/* key light: bright steel on the left fading to shadow on the right */}
        <LinearGradient id="lit" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#C8CEDA" />
          <Stop offset="48%" stopColor="#7A8294" />
          <Stop offset="100%" stopColor="#26272E" />
        </LinearGradient>
        <LinearGradient id="hat" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#43454F" />
          <Stop offset="100%" stopColor="#15161A" />
        </LinearGradient>

        {/* the figure silhouette — used to clip the shadow half + light bars */}
        <ClipPath id="figure">
          <Path d="M91,104 C91,142 101,159 120,159 C139,159 149,142 149,104 Z" />
          <Path d="M58,214 C60,176 90,163 120,163 C150,163 180,176 182,214 Z" />
        </ClipPath>
      </Defs>

      {/* ambient glow */}
      <Circle cx={120} cy={112} r={112} fill="url(#vig)" />

      {/* trench-coat shoulders + raised collar */}
      <Path d="M58,214 C60,176 90,163 120,163 C150,163 180,176 182,214 Z" fill="url(#lit)" />
      <Path d="M120,163 L101,206 L120,196 L139,206 Z" fill="#1A1B20" opacity={0.9} />

      {/* head / jaw */}
      <Path d="M91,104 C91,142 101,159 120,159 C139,159 149,142 149,104 Z" fill="url(#lit)" />

      {/* shadow half + venetian-blind light bars, clipped to the figure */}
      <G clipPath="url(#figure)">
        <Rect x={120} y={60} width={120} height={170} fill="#0C0C10" opacity={0.82} />
        <G opacity={0.18}>
          <Rect x={28} y={104} width={200} height={6} fill="#C8CEDA" transform="rotate(-16 120 120)" />
          <Rect x={28} y={132} width={200} height={6} fill="#C8CEDA" transform="rotate(-16 120 120)" />
          <Rect x={28} y={160} width={200} height={6} fill="#C8CEDA" transform="rotate(-16 120 120)" />
          <Rect x={28} y={188} width={200} height={6} fill="#C8CEDA" transform="rotate(-16 120 120)" />
        </G>
      </G>

      {/* hat brim */}
      <Ellipse cx={120} cy={100} rx={82} ry={17} fill="url(#hat)" />
      <Ellipse cx={120} cy={98} rx={82} ry={16} fill="none" stroke="#6E7689" strokeOpacity={0.5} strokeWidth={1} />
      {/* hat crown */}
      <Path d="M80,100 C80,71 89,59 120,59 C151,59 160,71 160,100 Z" fill="url(#hat)" />
      {/* hat band */}
      <Path d="M81,91 C100,98 140,98 159,91 L159,97 C140,104 100,104 81,97 Z" fill="#0E0E13" />
      {/* crown rim highlight (catch light on the left) */}
      <Path d="M82,98 C84,74 92,62 118,61" fill="none" stroke="#C8CEDA" strokeOpacity={0.4} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
