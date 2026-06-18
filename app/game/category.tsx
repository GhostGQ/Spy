import { router, useLocalSearchParams } from 'expo-router';
import { CheckSquare, Square } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { ScreenGradient } from '@/components/ScreenGradient';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CategoryIcon } from '@/components/icons/CategoryIcon';
import { categoryTitle, getCategoryData, wordLabel } from '@/data/categories';
import { colors } from '@/theme/colors';
import { useModeAccent } from '@/theme/modeTheme';
import { useSettingsStore } from '@/store/settingsStore';

function WordRow({
  word,
  on,
  accent,
  onToggle,
}: {
  word: string;
  on: boolean;
  accent: string;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center justify-between px-4 py-3.5 active:opacity-80"
    >
      <Text
        style={{ color: on ? '#FFFFFF' : colors.muted }}
        className="flex-1 pr-3 font-sans-md text-base"
      >
        {word}
      </Text>
      {on ? (
        <CheckSquare size={24} color={accent} weight="fill" />
      ) : (
        <Square size={24} color={colors.surface3} weight="bold" />
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
  const { hex: accent } = useModeAccent();

  // Canonical (ru) keys are used for disabled tracking; display uses the
  // active language. `off` holds the disabled keys for quick lookup.
  const off = new Set(disabled ?? []);
  const allKeys = category.words.map((w) => w.ru);
  const enabledLen = allKeys.filter((k) => !off.has(k)).length;
  const allOn = enabledLen === category.words.length;

  return (
    <ScreenGradient tint={accent}>
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
                style={{ backgroundColor: `${accent}1F`, borderColor: `${accent}40` }}
                className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border"
              >
                <CategoryIcon id={category.id} size={24} color={accent} />
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
              <Text style={{ color: accent }} className="font-sans-sb text-sm">
                {allOn ? t('category.deselectAll') : t('category.selectAll')}
              </Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            <Card className="overflow-hidden p-0">
              {category.words.map((w, i) => (
                <View key={w.ru}>
                  {i > 0 ? <View style={{ backgroundColor: colors.divider }} className="h-px" /> : null}
                  <WordRow
                    word={wordLabel(w)}
                    on={!off.has(w.ru)}
                    accent={accent}
                    onToggle={() => toggleWord(category.id, w.ru)}
                  />
                </View>
              ))}
            </Card>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}
