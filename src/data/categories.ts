import type { Category } from '@/game/types';
import i18n from '@/i18n';

/** A single word with its translations. The Russian form is the canonical key. */
export interface WordPair {
  ru: string;
  en: string;
}

export interface CategoryData {
  id: string;
  words: WordPair[];
}

/**
 * Стартовый набор категорий. Названия категорий берутся из словарей i18n по
 * `id` (categories.<id>); иконки задаются по `id` в CategoryIcon. Каждое слово —
 * пара переводов; русский вариант служит стабильным ключом (disabledWords).
 */
export const CATEGORIES_DATA: CategoryData[] = [
  {
    id: 'locations',
    words: [
      { ru: 'Аэропорт', en: 'Airport' },
      { ru: 'Больница', en: 'Hospital' },
      { ru: 'Школа', en: 'School' },
      { ru: 'Банк', en: 'Bank' },
      { ru: 'Театр', en: 'Theater' },
      { ru: 'Стадион', en: 'Stadium' },
      { ru: 'Ресторан', en: 'Restaurant' },
      { ru: 'Отель', en: 'Hotel' },
      { ru: 'Пляж', en: 'Beach' },
      { ru: 'Музей', en: 'Museum' },
      { ru: 'Метро', en: 'Subway' },
      { ru: 'Суд', en: 'Courthouse' },
    ],
  },
  {
    id: 'food',
    words: [
      { ru: 'Пицца', en: 'Pizza' },
      { ru: 'Борщ', en: 'Borscht' },
      { ru: 'Суши', en: 'Sushi' },
      { ru: 'Бургер', en: 'Burger' },
      { ru: 'Пельмени', en: 'Dumplings' },
      { ru: 'Мороженое', en: 'Ice cream' },
      { ru: 'Шашлык', en: 'Barbecue' },
      { ru: 'Блины', en: 'Pancakes' },
      { ru: 'Паста', en: 'Pasta' },
      { ru: 'Цезарь', en: 'Caesar salad' },
      { ru: 'Плов', en: 'Pilaf' },
      { ru: 'Хачапури', en: 'Khachapuri' },
    ],
  },
  {
    id: 'cities',
    words: [
      { ru: 'Москва', en: 'Moscow' },
      { ru: 'Париж', en: 'Paris' },
      { ru: 'Токио', en: 'Tokyo' },
      { ru: 'Нью-Йорк', en: 'New York' },
      { ru: 'Лондон', en: 'London' },
      { ru: 'Рим', en: 'Rome' },
      { ru: 'Стамбул', en: 'Istanbul' },
      { ru: 'Дубай', en: 'Dubai' },
      { ru: 'Берлин', en: 'Berlin' },
      { ru: 'Барселона', en: 'Barcelona' },
      { ru: 'Прага', en: 'Prague' },
      { ru: 'Сеул', en: 'Seoul' },
    ],
  },
  {
    id: 'professions',
    words: [
      { ru: 'Врач', en: 'Doctor' },
      { ru: 'Учитель', en: 'Teacher' },
      { ru: 'Повар', en: 'Chef' },
      { ru: 'Пилот', en: 'Pilot' },
      { ru: 'Программист', en: 'Programmer' },
      { ru: 'Полицейский', en: 'Police officer' },
      { ru: 'Пожарный', en: 'Firefighter' },
      { ru: 'Актёр', en: 'Actor' },
      { ru: 'Художник', en: 'Painter' },
      { ru: 'Музыкант', en: 'Musician' },
      { ru: 'Юрист', en: 'Lawyer' },
      { ru: 'Ветеринар', en: 'Veterinarian' },
    ],
  },
  {
    id: 'relationships',
    words: [
      { ru: 'Свадьба', en: 'Wedding' },
      { ru: 'Свидание', en: 'Date' },
      { ru: 'Поцелуй', en: 'Kiss' },
      { ru: 'Флирт', en: 'Flirt' },
      { ru: 'Любовь', en: 'Love' },
      { ru: 'Ревность', en: 'Jealousy' },
      { ru: 'Предложение', en: 'Proposal' },
      { ru: 'Развод', en: 'Divorce' },
      { ru: 'Медовый месяц', en: 'Honeymoon' },
      { ru: 'Бывший', en: 'Ex' },
      { ru: 'Секрет', en: 'Secret' },
      { ru: 'Симпатия', en: 'Crush' },
    ],
  },
  {
    id: 'games',
    words: [
      { ru: 'Minecraft', en: 'Minecraft' },
      { ru: 'Dota 2', en: 'Dota 2' },
      { ru: 'Counter-Strike 2', en: 'Counter-Strike 2' },
      { ru: 'Valorant', en: 'Valorant' },
      { ru: 'GTA V', en: 'GTA V' },
      { ru: 'The Witcher 3', en: 'The Witcher 3' },
      { ru: 'Cyberpunk 2077', en: 'Cyberpunk 2077' },
      { ru: 'Fortnite', en: 'Fortnite' },
      { ru: 'League of Legends', en: 'League of Legends' },
      { ru: 'Terraria', en: 'Terraria' },
      { ru: 'Among Us', en: 'Among Us' },
      { ru: 'The Sims 4', en: 'The Sims 4' },
    ],
  },
  {
    id: 'movies',
    words: [
      { ru: 'Титаник', en: 'Titanic' },
      { ru: 'Аватар', en: 'Avatar' },
      { ru: 'Матрица', en: 'The Matrix' },
      { ru: 'Гарри Поттер', en: 'Harry Potter' },
      { ru: 'Джокер', en: 'Joker' },
      { ru: 'Интерстеллар', en: 'Interstellar' },
      { ru: 'Начало', en: 'Inception' },
      { ru: 'Шрек', en: 'Shrek' },
      { ru: 'Гладиатор', en: 'Gladiator' },
      { ru: 'Терминатор', en: 'The Terminator' },
      { ru: 'Король Лев', en: 'The Lion King' },
      { ru: 'Один дома', en: 'Home Alone' },
    ],
  },
  {
    id: 'brands',
    words: [
      { ru: 'Apple', en: 'Apple' },
      { ru: 'Samsung', en: 'Samsung' },
      { ru: 'Nike', en: 'Nike' },
      { ru: 'Adidas', en: 'Adidas' },
      { ru: 'Coca-Cola', en: 'Coca-Cola' },
      { ru: 'McDonald’s', en: 'McDonald’s' },
      { ru: 'Tesla', en: 'Tesla' },
      { ru: 'Toyota', en: 'Toyota' },
      { ru: 'Google', en: 'Google' },
      { ru: 'Netflix', en: 'Netflix' },
      { ru: 'LEGO', en: 'LEGO' },
      { ru: 'Sony', en: 'Sony' },
    ],
  },
  {
    id: 'anime',
    words: [
      { ru: 'Наруто', en: 'Naruto' },
      { ru: 'Ван-Пис', en: 'One Piece' },
      { ru: 'Атака титанов', en: 'Attack on Titan' },
      { ru: 'Тетрадь смерти', en: 'Death Note' },
      { ru: 'Клинок, рассекающий демонов', en: 'Demon Slayer' },
      { ru: 'Магическая битва', en: 'Jujutsu Kaisen' },
      { ru: 'Блич', en: 'Bleach' },
      { ru: 'Hunter x Hunter', en: 'Hunter x Hunter' },
      { ru: 'Человек-бензопила', en: 'Chainsaw Man' },
      { ru: 'Драконий жемчуг', en: 'Dragon Ball' },
      { ru: 'Семья шпиона', en: 'Spy x Family' },
      { ru: 'Токийский гуль', en: 'Tokyo Ghoul' },
    ],
  },
  {
    id: 'game_characters',
    words: [
      { ru: 'Марио', en: 'Mario' },
      { ru: 'Соник', en: 'Sonic' },
      { ru: 'Геральт', en: 'Geralt' },
      { ru: 'Кратос', en: 'Kratos' },
      { ru: 'Артур Морган', en: 'Arthur Morgan' },
      { ru: 'Си Джей', en: 'CJ' },
      { ru: 'Лара Крофт', en: 'Lara Croft' },
      { ru: 'Стив', en: 'Steve' },
      { ru: 'Линк', en: 'Link' },
      { ru: 'Агент 47', en: 'Agent 47' },
      { ru: 'Мастер Чиф', en: 'Master Chief' },
      { ru: 'Пакман', en: 'Pac-Man' },
    ],
  },
  {
    id: 'historical_figures',
    words: [
      { ru: 'Наполеон', en: 'Napoleon' },
      { ru: 'Юлий Цезарь', en: 'Julius Caesar' },
      { ru: 'Леонардо да Винчи', en: 'Leonardo da Vinci' },
      { ru: 'Никола Тесла', en: 'Nikola Tesla' },
      { ru: 'Альберт Эйнштейн', en: 'Albert Einstein' },
      { ru: 'Чингисхан', en: 'Genghis Khan' },
      { ru: 'Клеопатра', en: 'Cleopatra' },
      { ru: 'Галилео Галилей', en: 'Galileo Galilei' },
      { ru: 'Исаак Ньютон', en: 'Isaac Newton' },
      { ru: 'Христофор Колумб', en: 'Christopher Columbus' },
      { ru: 'Уинстон Черчилль', en: 'Winston Churchill' },
      { ru: 'Махатма Ганди', en: 'Mahatma Gandhi' },
    ],
  },
  {
    id: 'celebrities',
    words: [
      { ru: 'Криштиану Роналду', en: 'Cristiano Ronaldo' },
      { ru: 'Лионель Месси', en: 'Lionel Messi' },
      { ru: 'Илон Маск', en: 'Elon Musk' },
      { ru: 'MrBeast', en: 'MrBeast' },
      { ru: 'Киану Ривз', en: 'Keanu Reeves' },
      { ru: 'Тейлор Свифт', en: 'Taylor Swift' },
      { ru: 'Дуэйн Джонсон', en: 'Dwayne Johnson' },
      { ru: 'Том Круз', en: 'Tom Cruise' },
      { ru: 'Билли Айлиш', en: 'Billie Eilish' },
      { ru: 'Райан Гослинг', en: 'Ryan Gosling' },
      { ru: 'Селена Гомес', en: 'Selena Gomez' },
      { ru: 'Шакира', en: 'Shakira' },
    ],
  },
];

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
