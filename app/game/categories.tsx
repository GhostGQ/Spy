import { router } from 'expo-router';
import { CheckCircle } from 'phosphor-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenGradient } from '@/components/ScreenGradient';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CategoryIcon } from '@/components/icons/CategoryIcon';
import { CATEGORIES } from '@/data/categories';
import { colors } from '@/theme/colors';
import { glow } from '@/theme/glow';
import { useGameStore } from '@/store/gameStore';
import { enabledWords, useSettingsStore } from '@/store/settingsStore';

function CategoryTile({
  id,
  title,
  enabled,
  total,
  selected,
  onPress,
  onLongPress,
}: {
  id: string;
  title: string;
  enabled: number;
  total: number;
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={250}
      style={[
        {
          width: '48.5%',
          aspectRatio: 1,
          borderColor: selected ? colors.accent : colors.borderSubtle,
          backgroundColor: selected ? colors.surface2 : colors.surface,
        },
        selected ? glow(colors.accent, 'card') : null,
      ]}
      className="mb-3 items-center justify-center rounded-3xl border-2 p-4 active:opacity-90"
    >
      <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
        {selected ? (
          <CheckCircle size={26} color={colors.accent} weight="fill" />
        ) : (
          <View style={{ borderColor: colors.surface3 }} className="h-6 w-6 rounded-full border-2" />
        )}
      </View>

      <View
        style={{
          backgroundColor: selected ? `${colors.accent}1F` : colors.surface3,
          borderColor: selected ? `${colors.accent}40` : colors.borderSubtle,
        }}
        className="h-16 w-16 items-center justify-center rounded-2xl border"
      >
        <CategoryIcon id={id} size={32} color={selected ? colors.accent : colors.textSecondary} />
      </View>
      <Text className="mt-3 font-sans-sb text-base text-white">{title}</Text>
      <Text className="mt-0.5 font-sans text-xs text-muted">
        {enabled}/{total} слов
      </Text>
    </Pressable>
  );
}

export default function Categories() {
  const config = useGameStore((s) => s.config);
  const toggleCategory = useGameStore((s) => s.toggleCategory);
  const startGame = useGameStore((s) => s.startGame);
  const rememberSetup = useSettingsStore((s) => s.rememberSetup);
  const disabledWords = useSettingsStore((s) => s.disabledWords);

  const selectedCount = config.categoryIds.length;
  // Total enabled words across the selected categories — must be ≥1 to play.
  const selectedEnabled = config.categoryIds.reduce((sum, id) => {
    const cat = CATEGORIES.find((c) => c.id === id);
    return sum + (cat ? enabledWords(cat.words, disabledWords[id]).length : 0);
  }, 0);
  const canStart = selectedCount > 0 && selectedEnabled > 0;

  const onStart = () => {
    if (!canStart) return;
    rememberSetup(config.mode, config.categoryIds);
    startGame();
    router.push('/game/roles');
  };

  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-6 pt-4">
          <ScreenHeader
            title="Категория"
            subtitle="Тап — выбрать · удержание — слова"
            onBack={() => router.back()}
          />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
            <View className="flex-row flex-wrap justify-between">
              {CATEGORIES.map((c) => (
                <CategoryTile
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  enabled={enabledWords(c.words, disabledWords[c.id]).length}
                  total={c.words.length}
                  selected={config.categoryIds.includes(c.id)}
                  onPress={() => toggleCategory(c.id)}
                  onLongPress={() => router.push({ pathname: '/game/category', params: { id: c.id } })}
                />
              ))}
            </View>
          </ScrollView>

          <View className="pb-2 pt-2">
            <Text className="mb-3 text-center font-sans text-sm text-muted">
              {selectedCount > 0 && selectedEnabled === 0 ? (
                <Text style={{ color: colors.danger }} className="font-sans-sb">
                  Включите хотя бы одно слово в выбранной категории
                </Text>
              ) : (
                <>
                  Выбрано категорий: <Text className="font-sans-b text-white">{selectedCount}</Text>
                </>
              )}
            </Text>
            <PrimaryButton
              label="Начать игру"
              icon="play"
              size="lg"
              accent="accent"
              disabled={!canStart}
              onPress={onStart}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}
