import { Clock } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { colors } from '@/theme/colors';

interface Props {
  /** Regular price label. Shown struck-through when `discounted` is set. */
  regular: string;
  /** Optional sale price. When present it becomes the highlighted price. */
  discounted?: string;
  /** Optional ISO deadline for `discounted`. Renders a live countdown while in the future. */
  saleEndsAt?: string;
  size?: 'sm' | 'lg';
  /** Color of the active (payable) price. */
  color?: string;
  /** Color of the struck-through regular price. */
  strikeColor?: string;
  align?: 'center' | 'left';
}

function formatCountdown(msLeft: number): string {
  const totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  if (days > 0) return `${days}д ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** Live-updating "time left" countdown, ticking once per second. */
function Countdown({ saleEndsAt, color }: { saleEndsAt: string; color: string }) {
  const { t } = useTranslation();
  const deadline = Date.parse(saleEndsAt);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const msLeft = deadline - now;
  if (msLeft <= 0) return null;

  return (
    <View
      style={{ backgroundColor: `${color}1F`, borderColor: `${color}40` }}
      className="mt-1.5 flex-row items-center self-center rounded-full border px-2.5 py-1"
    >
      <Clock size={12} color={color} weight="bold" />
      <Text className="ml-1 font-sans-sb text-[11px]" style={{ color }}>
        {t('purchase.saleEndsIn', { time: formatCountdown(msLeft) })}
      </Text>
    </View>
  );
}

/** Price display with optional strikethrough discount (regular → sale) and countdown. */
export function PriceTag({
  regular,
  discounted,
  saleEndsAt,
  size = 'sm',
  color = '#FFFFFF',
  strikeColor = colors.muted,
  align = 'center',
}: Props) {
  const active = discounted ?? regular;
  const activeCls = size === 'lg' ? 'font-sans-b text-2xl' : 'font-sans-b text-xs';
  const strikeCls = size === 'lg' ? 'font-sans text-base' : 'font-sans text-[11px]';
  return (
    <View>
      <View
        className={`flex-row items-baseline ${align === 'center' ? 'justify-center' : ''}`}
        style={{ gap: size === 'lg' ? 8 : 5 }}
      >
        {discounted ? (
          <Text className={`${strikeCls} line-through`} style={{ color: strikeColor }}>
            {regular}
          </Text>
        ) : null}
        <Text className={activeCls} style={{ color }}>
          {active}
        </Text>
      </View>
      {discounted && saleEndsAt ? <Countdown saleEndsAt={saleEndsAt} color={color} /> : null}
    </View>
  );
}
