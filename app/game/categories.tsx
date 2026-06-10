import { router } from 'expo-router';
import { CheckCircle } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenGradient } from '@/components/ScreenGradient';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CategoryIcon } from '@/components/icons/CategoryIcon';
import { CATEGORIES_DATA, categoryTitle, enabledCount } from '@/data/categories';
import { hapticSelection } from '@/lib/haptics';
import { colors } from '@/theme/colors';
import { glow } from '@/theme/glow';
import { useGameStore } from '@/store/gameStore';
import { useSettingsStore } from '@/store/settingsStore';

function CategoryTile({
  id,
  title,
  enabled,
  total,
  selected,
  onPress,
  onLongPress,
  wordsLabel,
}: {
  id: string;
  title: string;
  enabled: number;
  total: number;
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
  wordsLabel: string;
}) {
  return (
    <Pressable
      onPress={() => {
        hapticSelection();
        onPress();
      }}
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
      className="mb-3 items-center justify-center rounded-3xl border-2 p-3 active:opacity-90"
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
      <Text className="mt-3 font-sans-sb text-base text-white text-center">{title}</Text>
      <Text className="mt-0.5 font-sans text-xs text-muted">
        {enabled}/{total} {wordsLabel}
      </Text>
    </Pressable>
  );
}

export default function Categories() {
  const { t } = useTranslation();
  const config = useGameStore((s) => s.config);
  const toggleCategory = useGameStore((s) => s.toggleCategory);
  const startGame = useGameStore((s) => s.startGame);
  const disabledWords = useSettingsStore((s) => s.disabledWords);

  const selectedCount = config.categoryIds.length;
  // Total enabled words across the selected categories — must be ≥1 to play.
  const selectedEnabled = config.categoryIds.reduce(
    (sum, id) => sum + enabledCount(id, disabledWords[id]),
    0
  );
  const canStart = selectedCount > 0 && selectedEnabled > 0;
  const wordsLabel = t('categories.wordsShort');

  const onStart = () => {
    if (!canStart) return;
    startGame();
    router.push('/game/roles');
  };

  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-3 pt-4">
          <ScreenHeader
            title={t('categories.title')}
            subtitle={t('categories.subtitle')}
            onBack={() => router.back()}
          />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 2 }}>
            <View className="flex-row flex-wrap justify-between">
              {CATEGORIES_DATA.map((c) => (
                <CategoryTile
                  key={c.id}
                  id={c.id}
                  title={categoryTitle(c.id)}
                  enabled={enabledCount(c.id, disabledWords[c.id])}
                  total={c.words.length}
                  selected={config.categoryIds.includes(c.id)}
                  onPress={() => toggleCategory(c.id)}
                  onLongPress={() => router.push({ pathname: '/game/category', params: { id: c.id } })}
                  wordsLabel={wordsLabel}
                />
              ))}
            </View>
          </ScrollView>

          <View className="pb-2 pt-2">
            <Text className="mb-3 text-center font-sans text-sm text-muted">
              {selectedCount > 0 && selectedEnabled === 0 ? (
                <Text style={{ color: colors.danger }} className="font-sans-sb">
                  {t('categories.needWord')}
                </Text>
              ) : (
                <>
                  {t('categories.selectedLabel')}
                  <Text className="font-sans-b text-white">{selectedCount}</Text>
                </>
              )}
            </Text>
            <PrimaryButton
              label={t('categories.start')}
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
