import { router } from 'expo-router';
import { CheckCircle, Lock, Sparkle } from 'phosphor-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { ComingSoonOverlay } from '@/components/ComingSoonOverlay';
import { PriceTag } from '@/components/PriceTag';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenGradient } from '@/components/ScreenGradient';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CategoryIcon } from '@/components/icons/CategoryIcon';
import {
  ALL_CATEGORIES_PRODUCT_ID,
  IAP_ENABLED,
  TESTING_FULL_ACCESS,
  type PriceConfig,
} from '@/config/iap';
import { CATEGORIES_DATA, categoryTitle, enabledCount } from '@/data/categories';
import { hapticSelection } from '@/lib/haptics';
import { colors } from '@/theme/colors';
import { glow } from '@/theme/glow';
import { useGameStore } from '@/store/gameStore';
import { usePurchaseStore } from '@/store/purchaseStore';
import { useSettingsStore } from '@/store/settingsStore';

function BenefitRow({ text }: { text: string }) {
  return (
    <View className="flex-row items-center">
      <CheckCircle size={16} color={colors.streak} weight="fill" />
      <Text className="ml-2 font-sans text-sm text-text-secondary">{text}</Text>
    </View>
  );
}

function CategoryTile({
  id,
  title,
  enabled,
  total,
  selected,
  locked,
  comingSoon,
  price,
  size,
  onPress,
  onLongPress,
  wordsLabel,
  comingSoonLabel,
}: {
  id: string;
  title: string;
  enabled: number;
  total: number;
  selected: boolean;
  locked: boolean;
  comingSoon: boolean;
  price?: PriceConfig;
  size: number;
  onPress: () => void;
  onLongPress: () => void;
  wordsLabel: string;
  comingSoonLabel: string;
}) {
  const disabled = locked || comingSoon;
  return (
    <Pressable
      onPress={() => {
        if (comingSoon) return;
        hapticSelection();
        onPress();
      }}
      onLongPress={disabled ? undefined : onLongPress}
      delayLongPress={250}
      style={[
        {
          width: size,
          height: size,
          borderColor: selected ? colors.accent : colors.borderSubtle,
          backgroundColor: selected ? colors.surface2 : colors.surface,
          opacity: locked ? 0.6 : 1,
        },
        selected ? glow(colors.accent, 'card') : null,
      ]}
      className="items-center justify-center rounded-3xl border-2 p-3 active:opacity-90 overflow-hidden"
    >
      <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
        {locked ? (
          <Lock size={22} color={colors.muted} weight="fill" />
        ) : selected ? (
          <CheckCircle size={26} color={colors.accent} weight="fill" />
        ) : !comingSoon ? (
          <View style={{ borderColor: colors.surface3 }} className="h-6 w-6 rounded-full border-2" />
        ) : null}
      </View>

      <View
        style={{
          backgroundColor: selected ? `${colors.accent}1F` : colors.surface3,
          borderColor: selected ? `${colors.accent}40` : colors.borderSubtle,
        }}
        className="h-16 w-16 items-center justify-center rounded-2xl border"
      >
        <CategoryIcon id={id} size={42} color={selected ? colors.accent : colors.textSecondary} />
      </View>
      <Text className="mt-3 font-sans-sb text-base text-white text-center">{title}</Text>
      {locked && price ? (
        <View
          style={{ backgroundColor: colors.purple }}
          className="mt-1.5 rounded-full px-2.5 py-1"
        >
          <PriceTag
            regular={price.regular}
            discounted={price.discounted}
            color="#FFFFFF"
            strikeColor="rgba(255,255,255,0.65)"
          />
        </View>
      ) : (
        <Text className="mt-0.5 font-sans text-xs text-muted">
          {enabled}/{total} {wordsLabel}
        </Text>
      )}
      {comingSoon ? <ComingSoonOverlay label={comingSoonLabel} radius={24} /> : null}
    </Pressable>
  );
}

// Horizontal screen padding (px-3 = 12px) on each side of the grid.
const SCREEN_PADDING = 12;
// Fraction of the row each tile occupies; the remainder is the gap between the
// two columns (matches the previous justify-between + 48.5% layout).
const TILE_FRACTION = 0.485;

export default function Categories() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  // Square tile size in pixels — explicit dimensions keep the wrap layout
  // identical across web and native (aspectRatio + % width mis-measures the
  // grid height on Yoga, adding a phantom empty row before the next section).
  const tileSize = Math.floor((width - SCREEN_PADDING * 2) * TILE_FRACTION);
  const config = useGameStore((s) => s.config);
  const toggleCategory = useGameStore((s) => s.toggleCategory);
  const startGame = useGameStore((s) => s.startGame);
  const disabledWords = useSettingsStore((s) => s.disabledWords);
  const hasAccess = usePurchaseStore((s) => s.hasAccess);
  const getPrice = usePurchaseStore((s) => s.getPrice);
  const purchaseCategory = usePurchaseStore((s) => s.purchaseCategory);
  const purchaseAllCategories = usePurchaseStore((s) => s.purchaseAllCategories);
  const allUnlocked = usePurchaseStore((s) => s.allUnlocked);
  const isPurchasing = usePurchaseStore((s) => s.isLoading);
  const purchaseError = usePurchaseStore((s) => s.error);

  const visibleCategories = CATEGORIES_DATA;

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
    router.push('/game/timer-setup');
  };

  const onPressTile = (c: (typeof CATEGORIES_DATA)[number]) => {
    if (c.premium && !hasAccess(c.id)) {
      if (c.productId) void purchaseCategory(c.id);
      return;
    }
    toggleCategory(c.id);
  };

  useEffect(() => {
    if (!purchaseError) return;
    Alert.alert(t('purchase.error'), purchaseError);
    usePurchaseStore.setState({ error: null });
  }, [purchaseError, t]);

  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-3 pt-4">
          <ScreenHeader
            title={t('categories.title')}
            subtitle={t('categories.subtitle')}
            onBack={() => router.back()}
          />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16}}>
            <View className="flex-row flex-wrap justify-between gap-y-3">
              {visibleCategories.map((c) => {
                const comingSoon = !IAP_ENABLED && !TESTING_FULL_ACCESS && c.premium;
                const locked = !comingSoon && c.premium && !hasAccess(c.id);
                const price = locked && c.productId ? getPrice(c.productId) : undefined;
                return (
                  <CategoryTile
                    key={c.id}
                    id={c.id}
                    title={categoryTitle(c.id)}
                    enabled={enabledCount(c.id, disabledWords[c.id])}
                    total={c.words.length}
                    selected={config.categoryIds.includes(c.id)}
                    locked={locked}
                    comingSoon={comingSoon}
                    price={price}
                    size={tileSize}
                    onPress={() => onPressTile(c)}
                    onLongPress={() => router.push({ pathname: '/game/category', params: { id: c.id } })}
                    wordsLabel={wordsLabel}
                    comingSoonLabel={t('categories.comingSoon')}
                  />
                );
              })}
            </View>

            {IAP_ENABLED ? (
              <Card className="mt-5 mb-3">
                <View className="mb-3 flex-row items-center">
                  <View
                    style={{ backgroundColor: `${colors.purple}1F`, borderColor: `${colors.purple}40` }}
                    className="mr-3 h-10 w-10 items-center justify-center rounded-2xl border"
                  >
                    <Sparkle size={22} color={colors.purpleLight} weight="fill" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-display text-base uppercase tracking-widest text-white">
                      {t('purchase.fullAccessTitle')}
                    </Text>
                    <Text className="font-sans text-xs text-muted">
                      {t('purchase.fullAccessTagline')}
                    </Text>
                  </View>
                </View>
                <View className="gap-1.5 mb-4">
                  <BenefitRow text={t('purchase.fullAccessCategories')} />
                  <BenefitRow text={t('purchase.fullAccessModes')} />
                  <BenefitRow text={t('purchase.fullAccessFuture')} />
                  <BenefitRow text={t('purchase.fullAccessForever')} />
                </View>
                {!allUnlocked ? (
                  <View className="mb-3 items-center">
                    <PriceTag
                      regular={getPrice(ALL_CATEGORIES_PRODUCT_ID).regular}
                      discounted={getPrice(ALL_CATEGORIES_PRODUCT_ID).discounted}
                      saleEndsAt={getPrice(ALL_CATEGORIES_PRODUCT_ID).saleEndsAt}
                      size="lg"
                      color={colors.purpleLight}
                    />
                    <Text className="mt-0.5 font-sans text-xs text-muted">
                      {t('purchase.fullAccessSavings')}
                    </Text>
                  </View>
                ) : null}
                <PrimaryButton
                  label={allUnlocked ? t('purchase.activated') : t('purchase.activate')}
                  icon={allUnlocked ? 'checkmark' : 'lock-open-outline'}
                  size="md"
                  accent={allUnlocked ? 'streak' : 'purple'}
                  disabled={allUnlocked || isPurchasing}
                  onPress={() => void purchaseAllCategories()}
                />
              </Card>
            ) : null}
          </ScrollView>

          <View className="pb-4 pt-2">
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
