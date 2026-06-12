import { CATEGORY_PRODUCT_IDS, FREE_CATEGORY_IDS } from '@/config/iap';
import type { Category } from '@/game/types';
import i18n from '@/i18n';

/** A single word with its translations. The Russian form is the canonical key. */
export interface WordPair {
  ru: string;
  en: string;
}

/**
 * A group of thematically close words. Used by Ghost mode: civilians get one
 * word from a cluster, the ghost gets a different word from the *same*
 * cluster, so the two words are related enough that questions make sense for
 * both sides without being a giveaway.
 */
export interface WordCluster {
  id: string;
  words: WordPair[];
}

export interface CategoryData {
  id: string;
  clusters: WordCluster[];
  /** All words across all clusters, flattened (used outside Ghost mode). */
  words: WordPair[];
  /** Whether this category requires a purchase to unlock. */
  premium: boolean;
  /** RevenueCat product id, present for premium categories. */
  productId?: string;
}

const FREE_IDS = new Set<string>(FREE_CATEGORY_IDS);

/**
 * Стартовый набор категорий. Названия категорий берутся из словарей i18n по
 * `id` (categories.<id>); иконки задаются по `id` в CategoryIcon. Каждое слово —
 * пара переводов; русский вариант служит стабильным ключом (disabledWords).
 *
 * Слова сгруппированы в смысловые кластеры (`clusters`) — кластер используется
 * только в режиме «Призрак», чтобы выдать призраку слово, близкое по смыслу к
 * слову мирных. Вне этого режима категория используется как плоский список
 * (`words`, собирается автоматически из всех кластеров).
 */
const RAW_CATEGORIES: { id: string; clusters: WordCluster[] }[] = [
  {
    id: 'locations',
    clusters: [
      {
        id: 'education',
        words: [
          { ru: 'Школа', en: 'School' },
          { ru: 'Университет', en: 'University' },
          { ru: 'Библиотека', en: 'Library' },
        ],
      },
      {
        id: 'medical',
        words: [
          { ru: 'Больница', en: 'Hospital' },
          { ru: 'Поликлиника', en: 'Clinic' },
          { ru: 'Аптека', en: 'Pharmacy' },
        ],
      },
      {
        id: 'government',
        words: [
          { ru: 'Суд', en: 'Courthouse' },
          { ru: 'Мэрия', en: 'City Hall' },
          { ru: 'Налоговая', en: 'Tax Office' },
        ],
      },
      {
        id: 'finance',
        words: [
          { ru: 'Банк', en: 'Bank' },
          { ru: 'Биржа', en: 'Stock Exchange' },
          { ru: 'Ломбард', en: 'Pawn Shop' },
        ],
      },
      {
        id: 'culture',
        words: [
          { ru: 'Театр', en: 'Theater' },
          { ru: 'Музей', en: 'Museum' },
          { ru: 'Кинотеатр', en: 'Cinema' },
        ],
      },
      {
        id: 'sports',
        words: [
          { ru: 'Стадион', en: 'Stadium' },
          { ru: 'Спортзал', en: 'Gym' },
          { ru: 'Бассейн', en: 'Swimming Pool' },
        ],
      },
      {
        id: 'transport',
        words: [
          { ru: 'Аэропорт', en: 'Airport' },
          { ru: 'Вокзал', en: 'Train Station' },
          { ru: 'Метро', en: 'Subway' },
        ],
      },
      {
        id: 'vacation',
        words: [
          { ru: 'Отель', en: 'Hotel' },
          { ru: 'Курорт', en: 'Resort' },
          { ru: 'Пляж', en: 'Beach' },
        ],
      },
    ],
  },
  {
    id: 'food',
    clusters: [
      {
        id: 'italian_classics',
        words: [
          { ru: 'Пицца', en: 'Pizza' },
          { ru: 'Паста', en: 'Pasta' },
          { ru: 'Лазанья', en: 'Lasagna' },
          { ru: 'Ризотто', en: 'Risotto' },
          { ru: 'Карбонара', en: 'Carbonara' },
        ],
      },
      {
        id: 'russian_homestyle',
        words: [
          { ru: 'Борщ', en: 'Borscht' },
          { ru: 'Пельмени', en: 'Dumplings' },
          { ru: 'Блины', en: 'Pancakes' },
          { ru: 'Плов', en: 'Pilaf' },
          { ru: 'Вареники', en: 'Vareniki' },
        ],
      },
      {
        id: 'desserts_sweets',
        words: [
          { ru: 'Мороженое', en: 'Ice cream' },
          { ru: 'Тирамису', en: 'Tiramisu' },
          { ru: 'Чизкейк', en: 'Cheesecake' },
          { ru: 'Вафли', en: 'Waffles' },
          { ru: 'Пирожное', en: 'Pastry' },
        ],
      },
    ],
  },
  {
    id: 'cities',
    clusters: [
      {
        id: 'classic_european_capitals',
        words: [
          { ru: 'Москва', en: 'Moscow' },
          { ru: 'Париж', en: 'Paris' },
          { ru: 'Лондон', en: 'London' },
          { ru: 'Берлин', en: 'Berlin' },
          { ru: 'Рим', en: 'Rome' },
        ],
      },
      {
        id: 'east_asian_hubs',
        words: [
          { ru: 'Токио', en: 'Tokyo' },
          { ru: 'Сеул', en: 'Seoul' },
          { ru: 'Шанхай', en: 'Shanghai' },
          { ru: 'Гонконг', en: 'Hong Kong' },
          { ru: 'Сингапур', en: 'Singapore' },
        ],
      },
      {
        id: 'iconic_tourist_cities',
        words: [
          { ru: 'Стамбул', en: 'Istanbul' },
          { ru: 'Дубай', en: 'Dubai' },
          { ru: 'Барселона', en: 'Barcelona' },
          { ru: 'Прага', en: 'Prague' },
          { ru: 'Нью-Йорк', en: 'New York' },
        ],
      },
    ],
  },
  {
    id: 'professions',
    clusters: [
      {
        id: 'medical_health',
        words: [
          { ru: 'Врач', en: 'Doctor' },
          { ru: 'Ветеринар', en: 'Veterinarian' },
          { ru: 'Медсестра', en: 'Nurse' },
          { ru: 'Стоматолог', en: 'Dentist' },
          { ru: 'Фармацевт', en: 'Pharmacist' },
        ],
      },
      {
        id: 'creative_arts',
        words: [
          { ru: 'Актёр', en: 'Actor' },
          { ru: 'Художник', en: 'Painter' },
          { ru: 'Музыкант', en: 'Musician' },
          { ru: 'Писатель', en: 'Writer' },
          { ru: 'Повар', en: 'Chef' },
        ],
      },
      {
        id: 'public_service',
        words: [
          { ru: 'Учитель', en: 'Teacher' },
          { ru: 'Юрист', en: 'Lawyer' },
          { ru: 'Полицейский', en: 'Police officer' },
          { ru: 'Пожарный', en: 'Firefighter' },
          { ru: 'Пилот', en: 'Pilot' },
        ],
      },
    ],
  },
  {
    id: 'relationships',
    clusters: [
      {
        id: 'romance',
        words: [
          { ru: 'Симпатия', en: 'Crush' },
          { ru: 'Флирт', en: 'Flirt' },
          { ru: 'Свидание', en: 'Date' },
          { ru: 'Поцелуй', en: 'Kiss' },
        ],
      },
      {
        id: 'engagement',
        words: [
          { ru: 'Предложение', en: 'Proposal' },
          { ru: 'Помолвка', en: 'Engagement' },
          { ru: 'Свадьба', en: 'Wedding' },
          { ru: 'Медовый месяц', en: 'Honeymoon' },
        ],
      },
      {
        id: 'relationship_issues',
        words: [
          { ru: 'Ревность', en: 'Jealousy' },
          { ru: 'Измена', en: 'Infidelity' },
          { ru: 'Развод', en: 'Divorce' },
          { ru: 'Бывший', en: 'Ex' },
        ],
      },
    ],
  },
  {
    id: 'games',
    clusters: [
      {
        id: 'competitive_pvp',
        words: [
          { ru: 'Dota 2', en: 'Dota 2' },
          { ru: 'Counter-Strike 2', en: 'Counter-Strike 2' },
          { ru: 'Valorant', en: 'Valorant' },
          { ru: 'League of Legends', en: 'League of Legends' },
          { ru: 'Apex Legends', en: 'Apex Legends' },
        ],
      },
      {
        id: 'open_world_action',
        words: [
          { ru: 'GTA V', en: 'GTA V' },
          { ru: 'The Witcher 3', en: 'The Witcher 3' },
          { ru: 'Cyberpunk 2077', en: 'Cyberpunk 2077' },
          { ru: 'Red Dead Redemption 2', en: 'Red Dead Redemption 2' },
          { ru: 'Skyrim', en: 'Skyrim' },
        ],
      },
      {
        id: 'sandbox_casual',
        words: [
          { ru: 'Minecraft', en: 'Minecraft' },
          { ru: 'Terraria', en: 'Terraria' },
          { ru: 'The Sims 4', en: 'The Sims 4' },
          { ru: 'Among Us', en: 'Among Us' },
          { ru: 'Fortnite', en: 'Fortnite' },
        ],
      },
    ],
  },
  {
    id: 'movies',
    clusters: [
      {
        id: 'sci_fi',
        words: [
          { ru: 'Матрица', en: 'The Matrix' },
          { ru: 'Интерстеллар', en: 'Interstellar' },
          { ru: 'Начало', en: 'Inception' },
          { ru: 'Дюна', en: 'Dune' },
        ],
      },
      {
        id: 'family_fantasy',
        words: [
          { ru: 'Шрек', en: 'Shrek' },
          { ru: 'Король Лев', en: 'The Lion King' },
          { ru: 'История игрушек', en: 'Toy Story' },
          { ru: 'Мадагаскар', en: 'Madagascar' },
        ],
      },
      {
        id: 'fantasy',
        words: [
          { ru: 'Гарри Поттер', en: 'Harry Potter' },
          { ru: 'Властелин колец', en: 'The Lord of the Rings' },
          { ru: 'Хоббит', en: 'The Hobbit' },
          { ru: 'Хроники Нарнии', en: 'The Chronicles of Narnia' },
        ],
      },
      {
        id: 'action',
        words: [
          { ru: 'Терминатор', en: 'The Terminator' },
          { ru: 'Гладиатор', en: 'Gladiator' },
          { ru: 'Джон Уик', en: 'John Wick' },
          { ru: 'Безумный Макс', en: 'Mad Max' },
        ],
      },
      {
        id: 'psychological',
        words: [
          { ru: 'Джокер', en: 'Joker' },
          { ru: 'Бойцовский клуб', en: 'Fight Club' },
          { ru: 'Остров проклятых', en: 'Shutter Island' },
          { ru: 'Чёрный лебедь', en: 'Black Swan' },
        ],
      },
      {
        id: 'drama',
        words: [
          { ru: 'Титаник', en: 'Titanic' },
          { ru: 'Зелёная миля', en: 'The Green Mile' },
          { ru: 'Форрест Гамп', en: 'Forrest Gump' },
          { ru: 'Побег из Шоушенка', en: 'The Shawshank Redemption' },
        ],
      },
    ],
  },
  {
    id: 'brands',
    clusters: [
      {
        id: 'tech_electronics',
        words: [
          { ru: 'Apple', en: 'Apple' },
          { ru: 'Samsung', en: 'Samsung' },
          { ru: 'Sony', en: 'Sony' },
          { ru: 'Google', en: 'Google' },
          { ru: 'Microsoft', en: 'Microsoft' },
        ],
      },
      {
        id: 'sportswear',
        words: [
          { ru: 'Nike', en: 'Nike' },
          { ru: 'Adidas', en: 'Adidas' },
          { ru: 'Puma', en: 'Puma' },
          { ru: 'Reebok', en: 'Reebok' },
          { ru: 'Under Armour', en: 'Under Armour' },
        ],
      },
      {
        id: 'food_drink_chains',
        words: [
          { ru: 'Coca-Cola', en: 'Coca-Cola' },
          { ru: 'McDonald’s', en: 'McDonald’s' },
          { ru: 'Pepsi', en: 'Pepsi' },
          { ru: 'KFC', en: 'KFC' },
          { ru: 'Starbucks', en: 'Starbucks' },
        ],
      },
    ],
  },
  {
    id: 'anime',
    clusters: [
      {
        id: 'classic_shonen',
        words: [
          { ru: 'Наруто', en: 'Naruto' },
          { ru: 'Блич', en: 'Bleach' },
          { ru: 'Ван-Пис', en: 'One Piece' },
          { ru: 'Hunter x Hunter', en: 'Hunter x Hunter' },
        ],
      },
      {
        id: 'dark_supernatural',
        words: [
          { ru: 'Тетрадь смерти', en: 'Death Note' },
          { ru: 'Паразит', en: 'Parasyte' },
          { ru: 'Токийский гуль', en: 'Tokyo Ghoul' },
          { ru: 'Человек-бензопила', en: 'Chainsaw Man' },
        ],
      },
      {
        id: 'modern_battle',
        words: [
          { ru: 'Клинок, рассекающий демонов', en: 'Demon Slayer' },
          { ru: 'Магическая битва', en: 'Jujutsu Kaisen' },
          { ru: 'Моя геройская академия', en: 'My Hero Academia' },
          { ru: 'Чёрный клевер', en: 'Black Clover' },
        ],
      },
      {
        id: 'epic_conflict',
        words: [
          { ru: 'Атака титанов', en: 'Attack on Titan' },
          { ru: 'Код Гиас', en: 'Code Geass' },
          { ru: '86', en: '86' },
          { ru: 'Винланд Сага', en: 'Vinland Saga' },
        ],
      },
    ],
  },
  {
    id: 'game_characters',
    clusters: [
      {
        id: 'classic_platformer_mascots',
        words: [
          { ru: 'Марио', en: 'Mario' },
          { ru: 'Соник', en: 'Sonic' },
          { ru: 'Линк', en: 'Link' },
          { ru: 'Пакман', en: 'Pac-Man' },
          { ru: 'Кирби', en: 'Kirby' },
        ],
      },
      {
        id: 'gritty_action_protagonists',
        words: [
          { ru: 'Геральт', en: 'Geralt' },
          { ru: 'Кратос', en: 'Kratos' },
          { ru: 'Артур Морган', en: 'Arthur Morgan' },
          { ru: 'Си Джей', en: 'CJ' },
          { ru: 'Джоэл', en: 'Joel' },
        ],
      },
      {
        id: 'adventurers_and_spies',
        words: [
          { ru: 'Лара Крофт', en: 'Lara Croft' },
          { ru: 'Агент 47', en: 'Agent 47' },
          { ru: 'Мастер Чиф', en: 'Master Chief' },
          { ru: 'Солид Снейк', en: 'Solid Snake' },
          { ru: 'Нейтан Дрейк', en: 'Nathan Drake' },
        ],
      },
    ],
  },
  {
    id: 'historical_figures',
    clusters: [
      {
        id: 'polymaths_scientists',
        words: [
          { ru: 'Леонардо да Винчи', en: 'Leonardo da Vinci' },
          { ru: 'Никола Тесла', en: 'Nikola Tesla' },
          { ru: 'Альберт Эйнштейн', en: 'Albert Einstein' },
          { ru: 'Галилео Галилей', en: 'Galileo Galilei' },
          { ru: 'Исаак Ньютон', en: 'Isaac Newton' },
        ],
      },
      {
        id: 'conquerors_emperors',
        words: [
          { ru: 'Наполеон', en: 'Napoleon' },
          { ru: 'Юлий Цезарь', en: 'Julius Caesar' },
          { ru: 'Чингисхан', en: 'Genghis Khan' },
          { ru: 'Александр Македонский', en: 'Alexander the Great' },
          { ru: 'Тамерлан', en: 'Tamerlane' },
        ],
      },
      {
        id: 'leaders_and_icons',
        words: [
          { ru: 'Клеопатра', en: 'Cleopatra' },
          { ru: 'Жанна д’Арк', en: 'Joan of Arc' },
          { ru: 'Уинстон Черчилль', en: 'Winston Churchill' },
          { ru: 'Махатма Ганди', en: 'Mahatma Gandhi' },
          { ru: 'Христофор Колумб', en: 'Christopher Columbus' },
        ],
      },
    ],
  },
  {
    id: 'celebrities',
    clusters: [
      {
        id: 'football_legends',
        words: [
          { ru: 'Криштиану Роналду', en: 'Cristiano Ronaldo' },
          { ru: 'Лионель Месси', en: 'Lionel Messi' },
          { ru: 'Неймар', en: 'Neymar' },
          { ru: 'Килиан Мбаппе', en: 'Kylian Mbappé' },
          { ru: 'Эрлинг Холанд', en: 'Erling Haaland' },
        ],
      },
      {
        id: 'pop_musicians',
        words: [
          { ru: 'Тейлор Свифт', en: 'Taylor Swift' },
          { ru: 'Билли Айлиш', en: 'Billie Eilish' },
          { ru: 'Шакира', en: 'Shakira' },
          { ru: 'Селена Гомес', en: 'Selena Gomez' },
          { ru: 'Ариана Гранде', en: 'Ariana Grande' },
        ],
      },
      {
        id: 'hollywood_actors',
        words: [
          { ru: 'Киану Ривз', en: 'Keanu Reeves' },
          { ru: 'Дуэйн Джонсон', en: 'Dwayne Johnson' },
          { ru: 'Том Круз', en: 'Tom Cruise' },
          { ru: 'Райан Гослинг', en: 'Ryan Gosling' },
          { ru: 'Леонардо ДиКаприо', en: 'Leonardo DiCaprio' },
        ],
      },
    ],
  },
];

export const CATEGORIES_DATA: CategoryData[] = RAW_CATEGORIES.map((c) => ({
  id: c.id,
  clusters: c.clusters,
  words: c.clusters.flatMap((cl) => cl.words),
  premium: !FREE_IDS.has(c.id),
  productId: CATEGORY_PRODUCT_IDS[c.id],
}));

function activeLang(): 'ru' | 'en' {
  return i18n.language === 'en' ? 'en' : 'ru';
}

/** Display text of a word pair in the active language. */
export function wordLabel(w: WordPair): string {
  return w[activeLang()];
}

/** Canonical (language-independent) key of a word pair, used for disabledWords. */
export function wordKey(w: WordPair): string {
  return w.ru;
}

/** Localized category title from the i18n dictionaries. */
export function categoryTitle(id: string): string {
  return i18n.t(`categories.${id}`);
}

export function getCategoryData(id: string): CategoryData {
  return CATEGORIES_DATA.find((c) => c.id === id) ?? CATEGORIES_DATA[0];
}

/** Purchase requirements for a category. */
export function getCategoryEntitlement(id: string): { premium: boolean; productId?: string } {
  const data = getCategoryData(id);
  return { premium: data.premium, productId: data.productId };
}

/**
 * Localized view of a category (title + display words in the active language).
 * Keeps the original `Category` shape consumed across the app.
 */
export function getCategory(id: string): Category {
  const data = getCategoryData(id);
  return { id: data.id, title: categoryTitle(id), words: data.words.map(wordLabel) };
}

/** All categories, localized. */
export function getCategories(): Category[] {
  return CATEGORIES_DATA.map((c) => getCategory(c.id));
}

/** Number of currently enabled words in a category (independent of language). */
export function enabledCount(id: string, disabled: string[] | undefined): number {
  if (!disabled || disabled.length === 0) return getCategoryData(id).words.length;
  const off = new Set(disabled);
  return getCategoryData(id).words.filter((w) => !off.has(w.ru)).length;
}

/** Enabled words of a category as localized display strings (for the round). */
export function enabledLocalizedWords(id: string, disabled: string[] | undefined): string[] {
  const data = getCategoryData(id);
  if (!disabled || disabled.length === 0) return data.words.map(wordLabel);
  const off = new Set(disabled);
  return data.words.filter((w) => !off.has(w.ru)).map(wordLabel);
}

/**
 * Enabled words of a category, grouped by their semantic cluster (Ghost mode).
 * Clusters left with zero enabled words are dropped entirely.
 */
export function enabledClusters(
  id: string,
  disabled: string[] | undefined
): { id: string; words: string[] }[] {
  const data = getCategoryData(id);
  const off = new Set(disabled ?? []);
  return data.clusters
    .map((cl) => ({
      id: cl.id,
      words: cl.words.filter((w) => !off.has(w.ru)).map(wordLabel),
    }))
    .filter((cl) => cl.words.length > 0);
}
