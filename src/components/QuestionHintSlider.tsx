import { ArrowClockwise, ChatCircleDots } from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { hapticSelection } from '@/lib/haptics';
import { colors } from '@/theme/colors';
import { glow } from '@/theme/glow';

interface Props {
  /** Category dealt for this round (falls back gracefully if unknown). */
  categoryId: string;
}

/**
 * A single discussion-question hint with a "next hint" button that cycles
 * through the category's questions in a loop — helps a spy ask plausible
 * questions without knowing the word.
 */
export function QuestionHintSlider({ categoryId }: Props) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const questions = t(`hintQuestions.${categoryId}`, { returnObjects: true, defaultValue: [] });
  const list = useMemo(() => (Array.isArray(questions) ? questions : []), [questions]);
  if (list.length === 0) return null;

  const next = () => {
    hapticSelection();
    setIndex((i) => (i + 1) % list.length);
  };

  return (
    <View className="px-6 pb-4">
      <Text className="mb-2 text-center font-display text-xs uppercase tracking-widest text-muted">
        {t('timer.hintsTitle')}
      </Text>
      <View
        style={[
          { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
          glow(colors.accent, 'soft'),
        ]}
        className="flex-row items-center gap-3 rounded-2xl border px-4 py-4"
      >
        <ChatCircleDots size={24} color={colors.accentBright} weight="bold" />
        <Text className="flex-1 font-sans-sb text-base text-white">{list[index % list.length]}</Text>
        <Pressable
          onPress={next}
          hitSlop={10}
          style={{ backgroundColor: colors.surface3, borderColor: colors.borderSubtle }}
          className="h-10 w-10 items-center justify-center rounded-full border active:opacity-70"
        >
          <ArrowClockwise size={20} color={colors.accentBright} weight="bold" />
        </Pressable>
      </View>
    </View>
  );
}
