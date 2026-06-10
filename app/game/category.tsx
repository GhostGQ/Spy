import { router, useLocalSearchParams } from 'expo-router';
import { CheckSquare, Square } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenGradient } from '@/components/ScreenGradient';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CategoryIcon } from '@/components/icons/CategoryIcon';
import { categoryTitle, getCategoryData, wordLabel } from '@/data/categories';
import { colors } from '@/theme/colors';
import { useSettingsStore } from '@/store/settingsStore';

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
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = getCategoryData(id ?? 'food');
  const disabled = useSettingsStore((s) => s.disabledWords[category.id]);
  const toggleWord = useSettingsStore((s) => s.toggleWord);
  const setAllWords = useSettingsStore((s) => s.setAllWords);

  // Canonical (ru) keys are used for disabled tracking; display uses the
  // active language. `off` holds the disabled keys for quick lookup.
  const off = new Set(disabled ?? []);
  const allKeys = category.words.map((w) => w.ru);
  const enabledLen = allKeys.filter((k) => !off.has(k)).length;
  const allOn = enabledLen === category.words.length;

  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-3 pt-4">
          <ScreenHeader
            title={categoryTitle(category.id)}
            subtitle={t('category.subtitle', { enabled: enabledLen, total: category.words.length })}
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
                {t('category.markWords')}
              </Text>
            </View>
            <Pressable
              onPress={() => setAllWords(category.id, allKeys, !allOn)}
              hitSlop={8}
              className="active:opacity-70"
            >
              <Text style={{ color: colors.accentBright }} className="font-sans-sb text-sm">
                {allOn ? t('category.deselectAll') : t('category.selectAll')}
              </Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            {category.words.map((w) => (
              <WordRow
                key={w.ru}
                word={wordLabel(w)}
                on={!off.has(w.ru)}
                onToggle={() => toggleWord(category.id, w.ru)}
              />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}
