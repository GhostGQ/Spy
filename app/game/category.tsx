import { router, useLocalSearchParams } from 'expo-router';
import { CheckSquare, Square } from 'phosphor-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenGradient } from '@/components/ScreenGradient';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CategoryIcon } from '@/components/icons/CategoryIcon';
import { getCategory } from '@/data/categories';
import { colors } from '@/theme/colors';
import { enabledWords, useSettingsStore } from '@/store/settingsStore';

function WordRow({
  word,
  on,
  onToggle,
}: {
  word: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={{ backgroundColor: colors.surface, borderColor: colors.borderSubtle }}
      className="mb-2 flex-row items-center justify-between rounded-2xl border px-4 py-3.5 active:opacity-80"
    >
      <Text
        style={{ color: on ? '#FFFFFF' : colors.muted }}
        className="flex-1 pr-3 font-sans-md text-base"
      >
        {word}
      </Text>
      {on ? (
        <CheckSquare size={26} color={colors.accent} weight="fill" />
      ) : (
        <Square size={26} color={colors.surface3} weight="bold" />
      )}
    </Pressable>
  );
}

export default function CategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = getCategory(id ?? 'food');
  const disabled = useSettingsStore((s) => s.disabledWords[category.id]);
  const toggleWord = useSettingsStore((s) => s.toggleWord);
  const setAllWords = useSettingsStore((s) => s.setAllWords);

  const enabled = enabledWords(category.words, disabled);
  const onSet = new Set(enabled);
  const allOn = enabled.length === category.words.length;

  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-6 pt-4">
          <ScreenHeader
            title={category.title}
            subtitle={`${enabled.length}/${category.words.length} слов в игре`}
            onBack={() => router.back()}
          />

          {/* category badge + select all/none */}
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                style={{ backgroundColor: `${colors.accent}1F`, borderColor: `${colors.accent}40` }}
                className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border"
              >
                <CategoryIcon id={category.id} size={24} color={colors.accent} />
              </View>
              <Text className="font-sans text-sm text-text-secondary">
                Отметьте слова для игры
              </Text>
            </View>
            <Pressable
              onPress={() => setAllWords(category.id, category.words, !allOn)}
              hitSlop={8}
              className="active:opacity-70"
            >
              <Text style={{ color: colors.accentBright }} className="font-sans-sb text-sm">
                {allOn ? 'Снять все' : 'Выбрать все'}
              </Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            {category.words.map((w) => (
              <WordRow key={w} word={w} on={onSet.has(w)} onToggle={() => toggleWord(category.id, w)} />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}
