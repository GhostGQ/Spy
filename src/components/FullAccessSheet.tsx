import { CheckCircle, X } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ALL_CATEGORIES_PRODUCT_ID } from '@/config/iap';
import { usePurchaseStore } from '@/store/purchaseStore';
import { colors } from '@/theme/colors';

const SHEET_OFFSCREEN = Dimensions.get('window').height;

function BenefitRow({ text }: { text: string }) {
  return (
    <View className="flex-row items-center">
      <CheckCircle size={18} color={colors.streak} weight="fill" />
      <Text className="ml-2 flex-1 font-sans text-sm text-text-secondary">{text}</Text>
    </View>
  );
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

/** Bottom sheet explaining the "full access" bundle, with the activation CTA. */
export function FullAccessSheet({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const getPriceLabel = usePurchaseStore((s) => s.getPriceLabel);
  const purchaseAllCategories = usePurchaseStore((s) => s.purchaseAllCategories);
  const isPurchasing = usePurchaseStore((s) => s.isLoading);

  // The backdrop is a plain (non-animated) view — only the sheet itself slides.
  const [mounted, setMounted] = useState(visible);
  const translateY = useRef(new Animated.Value(SHEET_OFFSCREEN)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.setValue(SHEET_OFFSCREEN);
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    } else if (mounted) {
      Animated.timing(translateY, {
        toValue: SHEET_OFFSCREEN,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!mounted) return null;

  const onActivate = () => {
    void purchaseAllCategories();
    onClose();
  };

  return (
    <Modal visible transparent animationType='fade' onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable style={StyleSheet.absoluteFill} className="bg-black/70" onPress={onClose} />
        <Animated.View
          style={{
            transform: [{ translateY }],
            animationDuration: 300,
            backgroundColor: colors.surface,
            borderColor: colors.borderSubtle,
          }}
          className="overflow-hidden rounded-t-3xl border border-b-0"
        >
          <SafeAreaView edges={['bottom']}>
            <View className="p-6">
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="font-display text-xl uppercase tracking-widest text-white">
                  {t('purchase.fullAccessTitle')}
                </Text>
                <Pressable
                  onPress={onClose}
                  style={{ backgroundColor: colors.surface3 }}
                  className="h-8 w-8 items-center justify-center rounded-full"
                >
                  <X size={16} color={colors.textSecondary} weight="bold" />
                </Pressable>
              </View>
              <Text className="mb-4 font-sans text-sm text-muted">
                {t('purchase.fullAccessSavings')}
              </Text>
              <View className="mb-5 gap-2.5">
                <BenefitRow text={t('purchase.fullAccessCategories')} />
                <BenefitRow text={t('purchase.fullAccessModes')} />
                <BenefitRow text={t('purchase.fullAccessNoAds')} />
              </View>
              <PrimaryButton
                label={`${t('purchase.activate')} — ${getPriceLabel(ALL_CATEGORIES_PRODUCT_ID)}`}
                icon="lock-open-outline"
                size="lg"
                accent="purple"
                disabled={isPurchasing}
                onPress={onActivate}
              />
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}
