/**
 * In-app purchase configuration. Flip `IAP_ENABLED` to `true` once products
 * and entitlements are configured in the RevenueCat dashboard for both
 * stores. While `false`, every category is accessible and no purchase UI is
 * shown — the app behaves exactly as before this feature was added.
 */
export const IAP_ENABLED = false;

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

/** Fallback display price for a single category pack, used until RevenueCat returns one. */
export const CATEGORY_PRICE = '$1.49';

/** Fallback display price for the "unlock everything" bundle. */
export const ALL_ACCESS_PRICE = '$9.99';

/** Game modes that require the "full access" purchase. */
export const PREMIUM_MODE_IDS = ['ghost'] as const;
