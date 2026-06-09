import type {ReactNode} from 'react';
import {CheckCircle} from 'phosphor-react-native';
import {Pressable, Text, View} from 'react-native';

import {accentHex, colors, type AccentToken} from '@/theme/colors';
import {glow} from '@/theme/glow';
import {ModeId} from '@/game/types';

interface Props {
  title: string;
  id?: ModeId;
  /** Rendered icon node shown in the leading chip. */
  icon?: ReactNode;
  selected: boolean;
  onPress: () => void;
  accent?: AccentToken;
}

/** Glassy selectable row with a glowing accent state (design system). */
export function SelectableCard({
  title,
  icon,
  id,
  selected,
  onPress,
  accent = 'accent',
}: Props) {
  const hex = accentHex[accent];
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          borderColor: selected ? hex : colors.borderSubtle,
          backgroundColor: selected ? colors.surface2 : colors.surface,
        },
        selected ? glow(hex, 'card') : null,
      ]}
      className={`${id === "classic" ? 'col-span-2' : ''} flex-col gap-2 items-center justify-center rounded-2xl border p-4 active:opacity-90 relative`}
    >
      {icon ? (
        <View
          style={{backgroundColor: `${hex}1F`, borderColor: `${hex}33`}}
          className='h-12 w-12 items-center justify-center rounded-2xl border'
        >
          {icon}
        </View>
      ) : null}
      <View className='flex-1'>
        <Text className='font-sans-sb text-base text-white'>{title}</Text>
      </View>
      {selected ? (
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
