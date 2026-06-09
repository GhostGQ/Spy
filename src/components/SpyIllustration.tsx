import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme/colors';

interface Props {
  size?: number;
}

/**
 * Заглушка-иллюстрация: шляпа-федора и маска шпиона.
 * Замените на свой ассет в assets/ при желании.
 */
export function SpyIllustration({ size = 200 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {/* glow */}
      <Circle cx={100} cy={104} r={78} fill={`${colors.accent}14`} />
      {/* hat brim */}
      <Ellipse cx={100} cy={92} rx={74} ry={16} fill="#15171D" />
      <Ellipse cx={100} cy={88} rx={74} ry={16} fill="#202430" />
      {/* hat crown */}
      <Path
        d="M52 90 C52 56 66 40 100 40 C134 40 148 56 148 90 Z"
        fill="#2A2F3D"
      />
      {/* hat band */}
      <Path d="M54 84 H146 V92 H54 Z" fill={colors.accent} />
      {/* face area */}
      <Rect x={58} y={96} width={84} height={56} rx={26} fill="#13151B" />
      {/* eye mask */}
      <Path
        d="M64 118 C64 108 76 104 84 108 C90 111 96 111 100 109 C104 111 110 111 116 108 C124 104 136 108 136 118 C136 130 122 134 112 128 C106 124 94 124 88 128 C78 134 64 130 64 118 Z"
        fill={colors.accent}
      />
      {/* eyes */}
      <Circle cx={82} cy={118} r={5} fill="#0E0F13" />
      <Circle cx={118} cy={118} r={5} fill="#0E0F13" />
    </Svg>
  );
}
