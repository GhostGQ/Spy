/**
 * In-app purchase configuration. Flip `IAP_ENABLED` to `true` once products
 * and entitlements are configured in the RevenueCat dashboard for both
 * stores. While `false`, every category is accessible and no purchase UI is
 * shown — the app behaves exactly as before this feature was added.
 */
export const IAP_ENABLED = true;

/**
 * Unlocks every premium category and mode without purchases or "coming soon"
 * placeholders, regardless of `IAP_ENABLED`. Use for closed-testing builds
 * that need full feature access; flip back to `false` for production builds.
 */
export const TESTING_FULL_ACCESS = false;

/** Categories that remain free regardless of purchase state. */
export const FREE_CATEGORY_IDS = ['locations', 'food', 'cities'] as const;

/** Product id for the "unlock everything" bundle. */
export const ALL_CATEGORIES_PRODUCT_ID = 'all_categories';

/** Maps premium category ids to their RevenueCat product ids. */
export const CATEGORY_PRODUCT_IDS: Record<string, string> = {
  food: 'food_pack',
  professions: 'professions_pack',
  cities: 'cities_pack',
  games: 'games_pack',
  movies: 'movies_pack',
  brands: 'brands_pack',
  anime: 'anime_pack',
  game_characters: 'game_characters_pack',
  historical_figures: 'historical_figures_pack',
  celebrities: 'celebrities_pack',
  relationships: 'relationships_pack',
};

/**
 * RevenueCat public SDK keys, set once configured.
 *
 * A `test_…` key targets RevenueCat's Test Store (fake products, no real
 * billing) and is platform-agnostic, so it is used for both platforms. Swap in
 * the real store keys (`goog_…` / `appl_…`) before shipping to production.
 */
export const REVENUECAT_API_KEYS = {
  ios: 'test_qabBvLexYrgJgspyaAFrbhKcvgd',
  android: 'test_qabBvLexYrgJgspyaAFrbhKcvgd',
};

/**
 * A configurable price. Set `discounted` to run a promo: the UI then shows the
 * `regular` price struck-through next to the highlighted `discounted` price.
 */
export interface PriceConfig {
  /** Regular price label, e.g. '$9.99'. */
  regular: string;
  /** Optional sale price. When set, `regular` is shown crossed out. */
  discounted?: string;
  /**
   * Optional ISO 8601 deadline (e.g. '2026-07-01T00:00:00Z') for the
   * `discounted` price. While in the future, the UI shows a countdown; once
   * passed, the discount is treated as expired and `regular` applies again.
   */
  saleEndsAt?: string;
}

/** Default price for a single category pack (used until the store returns one). */
export const CATEGORY_PRICE: PriceConfig = { regular: '$1.49', discounted: '$0.99', saleEndsAt: '2026-06-28T00:00:00Z' };

/** Default price for the "unlock everything / full access" bundle. */
export const ALL_ACCESS_PRICE: PriceConfig = {
  regular: '$9.99',
  discounted: '$5.99',
  saleEndsAt: '2026-06-28T00:00:00Z'
};

/**
 * Per-product price overrides (productId → price). Anything not listed here
 * falls back to the defaults above. To run a sale, add a `discounted` value:
 *
 *   export const PRODUCT_PRICES = {
 *     [ALL_CATEGORIES_PRODUCT_ID]: { regular: '$9.99', discounted: '$5.99' },
 *     games_pack: { regular: '$1.99', discounted: '$0.99' },
 *   };
 */
export const PRODUCT_PRICES: Record<string, PriceConfig> = {};

/** Game modes that require the "full access" purchase. */
export const PREMIUM_MODE_IDS = ['ghost', 'syndicate', 'detective'] as const;
