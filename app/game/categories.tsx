import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CATEGORIES } from '@/data/categories';
import { colors } from '@/theme/colors';
import { useGameStore } from '@/store/gameStore';
import { useSettingsStore } from '@/store/settingsStore';

function CategoryTile({
  title,
  emoji,
  count,
  selected,
  onPress,
}: {
  title: string;
  emoji: string;
  count: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: '48.5%',
        aspectRatio: 1,
        borderColor: selected ? colors.accent : colors.border,
        backgroundColor: selected ? `${colors.accent}1A` : colors.surface,
      }}
      className="mb-3 items-center justify-center rounded-3xl border-2 p-4 active:opacity-90"
    >
      {/* check badge — inline absolute so it stays pinned to the corner */}
      <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
        {selected ? (
          <Ionicons name="checkmark-circle" size={26} color={colors.accent} />
        ) : (
          <View className="h-6 w-6 rounded-full border-2 border-border" />
        )}
      </View>

      <Text className="text-6xl">{emoji}</Text>
      <Text className="mt-3 text-lg font-bold text-white">{title}</Text>
      <Text className="mt-0.5 text-xs text-muted">{count} слов</Text>
    </Pressable>
  );
}

export default function Categories() {
  const config = useGameStore((s) => s.config);
  const toggleCategory = useGameStore((s) => s.toggleCategory);
  const startGame = useGameStore((s) => s.startGame);
  const rememberSetup = useSettingsStore((s) => s.rememberSetup);

  const selectedCount = config.categoryIds.length;

  const onStart = () => {
    rememberSetup(config.mode, config.categoryIds);
    startGame();
    router.push('/game/roles');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-1 px-6 pt-4">
        <ScreenHeader
          title="Категория"
          subtitle="Можно выбрать несколько"
          onBack={() => router.back()}
        />

        <View className="flex-1">
          <View className="flex-row flex-wrap justify-between">
            {CATEGORIES.map((c) => (
              <CategoryTile
                key={c.id}
                title={c.title}
                emoji={c.emoji}
                count={c.words.length}
                selected={config.categoryIds.includes(c.id)}
                onPress={() => toggleCategory(c.id)}
              />
            ))}
          </View>
        </View>

        <View className="pb-2 pt-2">
          <Text className="mb-3 text-center text-sm text-muted">
            Выбрано категорий: <Text className="font-bold text-white">{selectedCount}</Text>
          </Text>
          <PrimaryButton
            label="Начать игру"
            icon="play"
            size="lg"
            accent="accent"
            disabled={selectedCount === 0}
            onPress={onStart}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
