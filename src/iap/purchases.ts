import { Platform } from 'react-native';

import { IAP_ENABLED, REVENUECAT_API_KEYS } from '@/config/iap';
import type { PurchaseProduct, PurchaseResult } from './types';

/** Minimal shape of the `react-native-purchases` SDK surface this module relies on. */
interface RevenueCatProduct {
  identifier: string;
  priceString: string;
  title: string;
}

interface RevenueCatPackage {
  identifier: string;
  product: RevenueCatProduct;
}

interface RevenueCatOfferings {
  current: { availablePackages: RevenueCatPackage[] } | null;
}

interface RevenueCatEntitlementInfos {
  active: Record<string, unknown>;
}

interface RevenueCatCustomerInfo {
  entitlements: RevenueCatEntitlementInfos;
}

interface RevenueCatModule {
  configure(options: { apiKey: string }): void;
  getProducts(productIds: string[]): Promise<RevenueCatProduct[]>;
  getOfferings(): Promise<RevenueCatOfferings>;
  getCustomerInfo(): Promise<RevenueCatCustomerInfo>;
  purchasePackage(pack: RevenueCatPackage): Promise<{ customerInfo: RevenueCatCustomerInfo }>;
  restorePurchases(): Promise<RevenueCatCustomerInfo>;
}

/** Loads the native SDK lazily; returns `null` when unavailable (Expo Go, web, IAP disabled). */
function loadSdk(): RevenueCatModule | null {
  if (!IAP_ENABLED || Platform.OS === 'web') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('react-native-purchases');
    return (mod.default ?? mod) as RevenueCatModule;
  } catch {
    return null;
  }
}

let configured = false;

/** Configures the RevenueCat SDK once. No-op when IAP is disabled or the SDK is unavailable. */
export async function configure(): Promise<void> {
  if (configured) return;
  const sdk = loadSdk();
  if (!sdk) return;
  const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEYS.ios : REVENUECAT_API_KEYS.android;
  if (!apiKey) return;
  sdk.configure({ apiKey });
  configured = true;
}

/** Fetches display info (price, title) for the given product ids. */
export async function fetchProducts(productIds: string[]): Promise<PurchaseProduct[]> {
  const sdk = loadSdk();
  if (!sdk || productIds.length === 0) return [];
  try {
    const products = await sdk.getProducts(productIds);
    return products.map((p) => ({ productId: p.identifier, priceString: p.priceString, title: p.title }));
  } catch {
    return [];
  }
}

/** Purchases a product by id, resolving the matching package from current offerings. */
export async function purchaseProduct(productId: string): Promise<PurchaseResult> {
  const sdk = loadSdk();
  if (!sdk) throw new Error('Purchases are not available');

  const offerings = await sdk.getOfferings();
  const pack = offerings.current?.availablePackages.find((p) => p.product.identifier === productId);
  if (!pack) throw new Error(`No package found for product "${productId}"`);

  try {
    await sdk.purchasePackage(pack);
    return 'purchased';
  } catch (err) {
    const code = (err as { userCancelled?: boolean }).userCancelled;
    if (code) return 'cancelled';
    throw err;
  }
}

/** Restores prior purchases and returns the resulting active entitlement ids. */
export async function restorePurchases(): Promise<string[]> {
  const sdk = loadSdk();
  if (!sdk) return [];
  const info = await sdk.restorePurchases();
  return Object.keys(info.entitlements.active);
}

/** Returns the ids of currently active entitlements. */
export async function getActiveEntitlements(): Promise<string[]> {
  const sdk = loadSdk();
  if (!sdk) return [];
  try {
    const info = await sdk.getCustomerInfo();
    return Object.keys(info.entitlements.active);
  } catch {
    return [];
  }
}
