import type {ReactNode} from 'react';
import {CheckCircle, Lock} from 'phosphor-react-native';
import {Pressable, Text, View} from 'react-native';

import {hapticSelection} from '@/lib/haptics';
import {accentHex, colors, type AccentToken} from '@/theme/colors';
import {glow} from '@/theme/glow';

interface Props {
  title: string;
  /** Rendered icon node shown in the leading chip. */
  icon?: ReactNode;
  selected: boolean;
  onPress: () => void;
  accent?: AccentToken;
  /** Shows a lock badge and dims the card; `onPress` still fires (e.g. to start a purchase). */
  locked?: boolean;
  /** Dims the card, disables `onPress`, and shows a "coming soon" badge instead of word count. */
  comingSoon?: boolean;
  /** Label shown when `comingSoon` is true. */
  comingSoonLabel?: string;
}

/** Glassy selectable row with a glowing accent state (design system). */
export function SelectableCard({
  title,
  icon,
  selected,
  onPress,
  accent = 'accent',
  locked = false,
  comingSoon = false,
  comingSoonLabel,
}: Props) {
  const hex = accentHex[accent];
  const disabled = locked || comingSoon;
  return (
    <Pressable
      onPress={() => {
        if (comingSoon) return;
        hapticSelection();
        onPress();
      }}
      style={[
        {
          borderColor: selected ? hex : colors.borderSubtle,
          backgroundColor: selected ? colors.surface2 : colors.surface,
          opacity: disabled ? 0.6 : 1,
        },
        selected ? glow(hex, 'card') : null,
      ]}
      className='flex-col gap-2 items-center justify-center rounded-2xl border p-4 py-6 active:opacity-90 relative'
    >
      {icon ? (
        <View
          style={{backgroundColor: `${hex}1F`, borderColor: `${hex}33`}}
          className='h-16 w-16 items-center justify-center rounded-2xl border'
        >
          {icon}
        </View>
      ) : null}
      <Text className='font-sans-sb text-base text-white'>{title}</Text>
      {comingSoon ? (
        <View style={{backgroundColor: colors.surface3}} className='rounded-full px-2.5 py-1'>
          <Text className='font-sans-b text-xs text-muted'>{comingSoonLabel}</Text>
        </View>
      ) : locked ? (
        <Lock
          size={22}
          color={colors.muted}
          weight='fill'
          style={{position: 'absolute', top: 8, right: 8}}
        />
      ) : selected ? (
        <CheckCircle
          size={26}
          color={hex}
          weight='fill'
          style={{position: 'absolute', top: 8, right: 8}}
        />
      ) : (
        <View
          style={{
            borderColor: colors.surface3,
            position: 'absolute',
            top: 8,
            right: 8,
          }}
          className='h-6 w-6 rounded-full border-2'
        />
      )}
    </Pressable>
  );
}
