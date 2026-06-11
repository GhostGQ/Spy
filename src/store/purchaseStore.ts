import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  ALL_ACCESS_PRICE,
  ALL_CATEGORIES_PRODUCT_ID,
  CATEGORY_PRICE,
  CATEGORY_PRODUCT_IDS,
  FREE_CATEGORY_IDS,
  IAP_ENABLED,
  PREMIUM_MODE_IDS,
  PRODUCT_PRICES,
  TESTING_FULL_ACCESS,
  type PriceConfig,
} from '@/config/iap';
import * as purchases from '@/iap/purchases';
import type { PurchaseProduct } from '@/iap/types';

const FREE_IDS = new Set<string>(FREE_CATEGORY_IDS);
const PREMIUM_MODES = new Set<string>(PREMIUM_MODE_IDS);

interface PurchaseState {
  /** Category ids unlocked via individual purchase. */
  unlockedCategoryIds: string[];
  /** Whether the "unlock everything" bundle was purchased. */
  allUnlocked: boolean;
  /** Display info (price, title) keyed by product id. */
  products: Record<string, PurchaseProduct>;
  isLoading: boolean;
  error: string | null;
  _hydrated: boolean;

  /** Configures RevenueCat and loads product display info. Safe no-op when IAP is disabled. */
  init: () => Promise<void>;
  /** Whether the given category is playable right now. */
  hasAccess: (categoryId: string) => boolean;
  /** Price for a product (regular + optional sale price) for display. */
  getPrice: (productId: string) => PriceConfig;
  /** Whether the given mode requires the "full access" purchase and isn't unlocked. */
  isModeLocked: (modeId: string) => boolean;
  purchaseCategory: (categoryId: string) => Promise<void>;
  purchaseAllCategories: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set, get) => ({
      unlockedCategoryIds: [],
      allUnlocked: false,
      products: {},
      isLoading: false,
      error: null,
      _hydrated: false,

      init: async () => {
        if (!IAP_ENABLED) return;
        await purchases.configure();
        const productIds = [...Object.values(CATEGORY_PRODUCT_IDS), ALL_CATEGORIES_PRODUCT_ID];
        const products = await purchases.fetchProducts(productIds);
        set({
          products: Object.fromEntries(products.map((p) => [p.productId, p])),
        });
        // Sync already-owned entitlements so access survives reinstalls without
        // forcing the user to tap "Restore" — RevenueCat is the source of truth.
        try {
          const active = new Set(await purchases.getActiveEntitlements());
          if (active.size > 0) {
            const unlockedCategoryIds = Object.entries(CATEGORY_PRODUCT_IDS)
              .filter(([, productId]) => active.has(productId))
              .map(([categoryId]) => categoryId);
            set({
              unlockedCategoryIds,
              allUnlocked: active.has(ALL_CATEGORIES_PRODUCT_ID),
            });
          }
        } catch {
          // Offline / SDK unavailable: keep the persisted cache as-is.
        }
      },

      hasAccess: (categoryId) => {
        if (!IAP_ENABLED || TESTING_FULL_ACCESS) return true;
        if (FREE_IDS.has(categoryId)) return true;
        const { allUnlocked, unlockedCategoryIds } = get();
        return allUnlocked || unlockedCategoryIds.includes(categoryId);
      },

      getPrice: (productId) => {
        const cfg =
          PRODUCT_PRICES[productId] ??
          (productId === ALL_CATEGORIES_PRODUCT_ID ? ALL_ACCESS_PRICE : CATEGORY_PRICE);
        // A real store price (RevenueCat), when loaded, overrides the regular
        // label; the configured sale price still applies on top of it.
        const storePrice = get().products[productId]?.priceString;
        const regular = storePrice ?? cfg.regular;
        // Once the deadline passes, the discount expires and the regular
        // price applies again.
        if (cfg.saleEndsAt && Date.parse(cfg.saleEndsAt) <= Date.now()) {
          return { regular };
        }
        return { regular, discounted: cfg.discounted, saleEndsAt: cfg.saleEndsAt };
      },

      isModeLocked: (modeId) => {
        if (!IAP_ENABLED || TESTING_FULL_ACCESS) return false;
        if (!PREMIUM_MODES.has(modeId)) return false;
        return !get().allUnlocked;
      },

      purchaseCategory: async (categoryId) => {
        const productId = CATEGORY_PRODUCT_IDS[categoryId];
        if (!productId) return;
        set({ isLoading: true, error: null });
        try {
          const result = await purchases.purchaseProduct(productId);
          if (result === 'purchased') {
            set((s) => ({
              unlockedCategoryIds: s.unlockedCategoryIds.includes(categoryId)
                ? s.unlockedCategoryIds
                : [...s.unlockedCategoryIds, categoryId],
            }));
          }
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Purchase failed' });
        } finally {
          set({ isLoading: false });
        }
      },

      purchaseAllCategories: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await purchases.purchaseProduct(ALL_CATEGORIES_PRODUCT_ID);
          if (result === 'purchased') {
            set({ allUnlocked: true });
          }
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Purchase failed' });
        } finally {
          set({ isLoading: false });
        }
      },

      restorePurchases: async () => {
        set({ isLoading: true, error: null });
        try {
          const active = new Set(await purchases.getActiveEntitlements());
          const unlockedCategoryIds = Object.entries(CATEGORY_PRODUCT_IDS)
            .filter(([, productId]) => active.has(productId))
            .map(([categoryId]) => categoryId);
          set({
            unlockedCategoryIds,
            allUnlocked: active.has(ALL_CATEGORIES_PRODUCT_ID),
          });
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Restore failed' });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'spy-purchases',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        unlockedCategoryIds: s.unlockedCategoryIds,
        allUnlocked: s.allUnlocked,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    }
  )
);
