/** A purchasable product as resolved from RevenueCat, for display in the UI. */
export interface PurchaseProduct {
  productId: string;
  priceString: string;
  title: string;
}

export type PurchaseResult = 'purchased' | 'cancelled' | 'pending';
