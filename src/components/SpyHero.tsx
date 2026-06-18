import Svg, {
  Circle,
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
 * Neon "spy" hero emblem — a glowing HUD ring around a detective (fedora +
 * domino mask) rendered with blue/cyan/purple gradients. Pure vector (crisp at
 * any size). Replace with a custom raster asset later if desired.
 */
export function SpyHero({ size = 240 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 240 240">
      <Defs>
        <RadialGradient id="halo" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#A6ADBE" stopOpacity={0.28} />
          <Stop offset="55%" stopColor="#6E7689" stopOpacity={0.1} />
          <Stop offset="100%" stopColor="#6E7689" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="disc" cx="50%" cy="42%" r="70%">
          <Stop offset="0%" stopColor="#22232B" />
          <Stop offset="100%" stopColor="#101015" />
        </RadialGradient>
        <LinearGradient id="hat" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#2A2B33" />
          <Stop offset="100%" stopColor="#17171C" />
        </LinearGradient>
        <LinearGradient id="band" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#6E7689" />
          <Stop offset="100%" stopColor="#A6ADBE" />
        </LinearGradient>
        <LinearGradient id="mask" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#6E7689" />
          <Stop offset="100%" stopColor="#A6ADBE" />
        </LinearGradient>
      </Defs>

      {/* glow halo */}
      <Circle cx={120} cy={120} r={120} fill="url(#halo)" />

      {/* HUD rings */}
      <Circle cx={120} cy={120} r={100} stroke="#A6ADBE" strokeOpacity={0.16} strokeWidth={1.5} fill="none" strokeDasharray="2 12" />
      <Circle cx={120} cy={120} r={92} stroke="#A6ADBE" strokeOpacity={0.18} strokeWidth={2} fill="none" />
      <Circle
        cx={120}
        cy={120}
        r={92}
        stroke="#C2C8D6"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="150 140"
        transform="rotate(-35 120 120)"
      />

      {/* badge disc */}
      <Circle cx={120} cy={120} r={78} fill="url(#disc)" stroke="#6E7689" strokeOpacity={0.45} strokeWidth={1.5} />

      {/* spy emblem */}
      <G>
        {/* hat brim */}
        <Ellipse cx={120} cy={116} rx={56} ry={12} fill="#101015" />
        <Ellipse cx={120} cy={112} rx={56} ry={12} fill="url(#hat)" />
        {/* hat crown */}
        <Path d="M86 112 C86 76 154 76 154 112 Z" fill="url(#hat)" />
        {/* hat band (neon) */}
        <Rect x={88} y={103} width={64} height={9} rx={3} fill="url(#band)" />

        {/* face */}
        <Path d="M94 116 H146 V150 a26 26 0 0 1 -52 0 Z" fill="#0E0E13" />

        {/* domino mask */}
        <Path
          d="M96 132 C96 124 109 121 117 126 C120 128 122 128 125 126 C133 121 146 124 146 132 C146 142 133 145 125 139.5 C121.5 137 120.5 137 117 139.5 C109 145 96 142 96 132 Z"
          fill="url(#mask)"
        />
        {/* eyes */}
        <Circle cx={110} cy={132} r={3} fill="#0E0E13" />
        <Circle cx={132} cy={132} r={3} fill="#0E0E13" />
      </G>
    </Svg>
  );
}
