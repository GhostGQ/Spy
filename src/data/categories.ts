import { CATEGORY_PRODUCT_IDS, FREE_CATEGORY_IDS } from '@/config/iap';
import type { Category } from '@/game/types';
import i18n from '@/i18n';

/** A single word with its translations plus ghost-mode analogs. */
export interface WordPair {
  ru: string;
  en: string;
  /**
   * Exactly 3 similar words shown to the ghost player instead of the real word.
   * The ghost must blend in, so every analog has to match the main word on any
   * attribute a casual question would reveal. Authoring rules:
   *  - Must NOT be one of the 16 main words of the same category (no self-reference).
   *  - Balance recognizability vs. closeness — pick well-known analogs, no deep cuts.
   *  - People/characters (game_characters, historical_figures, celebrities): match
   *    gender, field/role, and franchise/universe where it has ≥3 fitting cast
   *    members; otherwise fall back to same gender + same archetype, cross-franchise.
   *  - Things/titles: match type/genre/kind (sci-fi↔sci-fi, fast food↔fast food).
   */
  ghost: { ru: string; en: string }[];
}

export interface CategoryData {
  id: string;
  /** Exactly 16 words, each with ghost analogs. */
  words: WordPair[];
  premium: boolean;
  productId?: string;
}

const FREE_IDS = new Set<string>(FREE_CATEGORY_IDS);

const RAW_CATEGORIES: { id: string; words: WordPair[] }[] = [
  {
    id: 'locations',
    words: [
      { ru: 'Школа', en: 'School', ghost: [{ ru: 'Колледж', en: 'College' }, { ru: 'Университет', en: 'University' }, { ru: 'Лицей', en: 'Lyceum' }] },
      { ru: 'Больница', en: 'Hospital', ghost: [{ ru: 'Клиника', en: 'Clinic' }, { ru: 'Поликлиника', en: 'Polyclinic' }, { ru: 'Санаторий', en: 'Sanatorium' }] },
      { ru: 'Банк', en: 'Bank', ghost: [{ ru: 'Ломбард', en: 'Pawn Shop' }, { ru: 'Биржа', en: 'Stock Exchange' }, { ru: 'Касса', en: 'Ticket Office' }] },
      { ru: 'Театр', en: 'Theater', ghost: [{ ru: 'Кинотеатр', en: 'Cinema' }, { ru: 'Цирк', en: 'Circus' }, { ru: 'Опера', en: 'Opera House' }] },
      { ru: 'Музей', en: 'Museum', ghost: [{ ru: 'Галерея', en: 'Gallery' }, { ru: 'Планетарий', en: 'Planetarium' }, { ru: 'Выставка', en: 'Exhibition' }] },
      { ru: 'Стадион', en: 'Stadium', ghost: [{ ru: 'Арена', en: 'Arena' }, { ru: 'Манеж', en: 'Riding Hall' }, { ru: 'Ипподром', en: 'Racetrack' }] },
      { ru: 'Аэропорт', en: 'Airport', ghost: [{ ru: 'Морской порт', en: 'Seaport' }, { ru: 'Автовокзал', en: 'Bus Terminal' }, { ru: 'Вертодром', en: 'Heliport' }] },
      { ru: 'Вокзал', en: 'Train Station', ghost: [{ ru: 'Автостанция', en: 'Bus Station' }, { ru: 'Пристань', en: 'Pier' }, { ru: 'Депо', en: 'Depot' }] },
      { ru: 'Метро', en: 'Subway', ghost: [{ ru: 'Трамвай', en: 'Tram' }, { ru: 'Монорельс', en: 'Monorail' }, { ru: 'Троллейбус', en: 'Trolleybus' }] },
      { ru: 'Отель', en: 'Hotel', ghost: [{ ru: 'Хостел', en: 'Hostel' }, { ru: 'Мотель', en: 'Motel' }, { ru: 'Гостиница', en: 'Inn' }] },
      { ru: 'Пляж', en: 'Beach', ghost: [{ ru: 'Набережная', en: 'Embankment' }, { ru: 'Берег', en: 'Riverbank' }, { ru: 'Бухта', en: 'Cove' }] },
      { ru: 'Библиотека', en: 'Library', ghost: [{ ru: 'Читальня', en: 'Reading Room' }, { ru: 'Архив', en: 'Archive' }, { ru: 'Книжный магазин', en: 'Bookstore' }] },
      { ru: 'Суд', en: 'Courthouse', ghost: [{ ru: 'Прокуратура', en: "Prosecutor's Office" }, { ru: 'Участок', en: 'Police Precinct' }, { ru: 'Нотариус', en: 'Notary' }] },
      { ru: 'Аптека', en: 'Pharmacy', ghost: [{ ru: 'Медпункт', en: 'Medical Post' }, { ru: 'Диспансер', en: 'Dispensary' }, { ru: 'Травник', en: 'Herbalist' }] },
      { ru: 'Спортзал', en: 'Gym', ghost: [{ ru: 'Фитнес-клуб', en: 'Fitness Club' }, { ru: 'Бассейн', en: 'Swimming Pool' }, { ru: 'Секция', en: 'Sports Club' }] },
      { ru: 'Парк', en: 'Park', ghost: [{ ru: 'Сквер', en: 'Square' }, { ru: 'Сад', en: 'Garden' }, { ru: 'Бульвар', en: 'Boulevard' }] },
    ],
  },
  {
    id: 'food',
    words: [
      { ru: 'Пицца', en: 'Pizza', ghost: [{ ru: 'Лаваш', en: 'Lavash' }, { ru: 'Хачапури', en: 'Khachapuri' }, { ru: 'Лепёшка', en: 'Flatbread' }] },
      { ru: 'Паста', en: 'Pasta', ghost: [{ ru: 'Лапша', en: 'Noodles' }, { ru: 'Спагетти', en: 'Spaghetti' }, { ru: 'Вермишель', en: 'Vermicelli' }] },
      { ru: 'Лазанья', en: 'Lasagna', ghost: [{ ru: 'Запеканка', en: 'Casserole' }, { ru: 'Макароны по-флотски', en: 'Navy-style Pasta' }, { ru: 'Пирог', en: 'Pie' }] },
      { ru: 'Ризотто', en: 'Risotto', ghost: [{ ru: 'Рисовая каша', en: 'Rice Porridge' }, { ru: 'Паэлья', en: 'Paella' }, { ru: 'Джамбалая', en: 'Jambalaya' }] },
      { ru: 'Карбонара', en: 'Carbonara', ghost: [{ ru: 'Болоньезе', en: 'Bolognese' }, { ru: 'Спагетти', en: 'Spaghetti' }, { ru: 'Альфредо', en: 'Alfredo' }] },
      { ru: 'Борщ', en: 'Borscht', ghost: [{ ru: 'Щи', en: 'Shchi' }, { ru: 'Солянка', en: 'Solyanka' }, { ru: 'Рассольник', en: 'Rassolnik' }] },
      { ru: 'Пельмени', en: 'Dumplings', ghost: [{ ru: 'Манты', en: 'Manti' }, { ru: 'Хинкали', en: 'Khinkali' }, { ru: 'Равиоли', en: 'Ravioli' }] },
      { ru: 'Блины', en: 'Pancakes', ghost: [{ ru: 'Оладьи', en: 'Fritters' }, { ru: 'Панкейк', en: 'Pancake' }, { ru: 'Крепы', en: 'Crepes' }] },
      { ru: 'Плов', en: 'Pilaf', ghost: [{ ru: 'Рисовая каша', en: 'Rice Porridge' }, { ru: 'Паэлья', en: 'Paella' }, { ru: 'Джамбалая', en: 'Jambalaya' }] },
      { ru: 'Вареники', en: 'Vareniki', ghost: [{ ru: 'Манты', en: 'Manti' }, { ru: 'Равиоли', en: 'Ravioli' }, { ru: 'Хинкали', en: 'Khinkali' }] },
      { ru: 'Мороженое', en: 'Ice Cream', ghost: [{ ru: 'Сорбет', en: 'Sorbet' }, { ru: 'Джелато', en: 'Gelato' }, { ru: 'Фруктовый лёд', en: 'Fruit Ice' }] },
      { ru: 'Тирамису', en: 'Tiramisu', ghost: [{ ru: 'Торт', en: 'Cake' }, { ru: 'Панна котта', en: 'Panna Cotta' }, { ru: 'Пудинг', en: 'Pudding' }] },
      { ru: 'Чизкейк', en: 'Cheesecake', ghost: [{ ru: 'Торт', en: 'Cake' }, { ru: 'Пирог', en: 'Pie' }, { ru: 'Кекс', en: 'Cupcake' }] },
      { ru: 'Вафли', en: 'Waffles', ghost: [{ ru: 'Оладьи', en: 'Fritters' }, { ru: 'Панкейк', en: 'Pancake' }, { ru: 'Печенье', en: 'Cookies' }] },
      { ru: 'Пирожное', en: 'Pastry', ghost: [{ ru: 'Эклер', en: 'Éclair' }, { ru: 'Кекс', en: 'Cupcake' }, { ru: 'Торт', en: 'Cake' }] },
      { ru: 'Бургер', en: 'Burger', ghost: [{ ru: 'Хот-дог', en: 'Hot Dog' }, { ru: 'Шаурма', en: 'Shawarma' }, { ru: 'Сэндвич', en: 'Sandwich' }] },
    ],
  },
  {
    id: 'cities',
    words: [
      { ru: 'Москва', en: 'Moscow', ghost: [{ ru: 'Санкт-Петербург', en: 'Saint Petersburg' }, { ru: 'Екатеринбург', en: 'Yekaterinburg' }, { ru: 'Казань', en: 'Kazan' }] },
      { ru: 'Париж', en: 'Paris', ghost: [{ ru: 'Лион', en: 'Lyon' }, { ru: 'Марсель', en: 'Marseille' }, { ru: 'Бордо', en: 'Bordeaux' }] },
      { ru: 'Лондон', en: 'London', ghost: [{ ru: 'Манчестер', en: 'Manchester' }, { ru: 'Эдинбург', en: 'Edinburgh' }, { ru: 'Бирмингем', en: 'Birmingham' }] },
      { ru: 'Берлин', en: 'Berlin', ghost: [{ ru: 'Мюнхен', en: 'Munich' }, { ru: 'Гамбург', en: 'Hamburg' }, { ru: 'Кёльн', en: 'Cologne' }] },
      { ru: 'Рим', en: 'Rome', ghost: [{ ru: 'Милан', en: 'Milan' }, { ru: 'Флоренция', en: 'Florence' }, { ru: 'Венеция', en: 'Venice' }] },
      { ru: 'Токио', en: 'Tokyo', ghost: [{ ru: 'Осака', en: 'Osaka' }, { ru: 'Киото', en: 'Kyoto' }, { ru: 'Иокогама', en: 'Yokohama' }] },
      { ru: 'Сеул', en: 'Seoul', ghost: [{ ru: 'Пусан', en: 'Busan' }, { ru: 'Инчхон', en: 'Incheon' }, { ru: 'Тэгу', en: 'Daegu' }] },
      { ru: 'Шанхай', en: 'Shanghai', ghost: [{ ru: 'Пекин', en: 'Beijing' }, { ru: 'Гуанчжоу', en: 'Guangzhou' }, { ru: 'Нанкин', en: 'Nanjing' }] },
      { ru: 'Гонконг', en: 'Hong Kong', ghost: [{ ru: 'Макао', en: 'Macau' }, { ru: 'Тайбэй', en: 'Taipei' }, { ru: 'Шэньчжэнь', en: 'Shenzhen' }] },
      { ru: 'Сингапур', en: 'Singapore', ghost: [{ ru: 'Куала-Лумпур', en: 'Kuala Lumpur' }, { ru: 'Бангкок', en: 'Bangkok' }, { ru: 'Джакарта', en: 'Jakarta' }] },
      { ru: 'Стамбул', en: 'Istanbul', ghost: [{ ru: 'Анкара', en: 'Ankara' }, { ru: 'Измир', en: 'Izmir' }, { ru: 'Бурса', en: 'Bursa' }] },
      { ru: 'Дубай', en: 'Dubai', ghost: [{ ru: 'Абу-Даби', en: 'Abu Dhabi' }, { ru: 'Доха', en: 'Doha' }, { ru: 'Эр-Рияд', en: 'Riyadh' }] },
      { ru: 'Барселона', en: 'Barcelona', ghost: [{ ru: 'Мадрид', en: 'Madrid' }, { ru: 'Валенсия', en: 'Valencia' }, { ru: 'Севилья', en: 'Seville' }] },
      { ru: 'Прага', en: 'Prague', ghost: [{ ru: 'Вена', en: 'Vienna' }, { ru: 'Варшава', en: 'Warsaw' }, { ru: 'Будапешт', en: 'Budapest' }] },
      { ru: 'Нью-Йорк', en: 'New York', ghost: [{ ru: 'Чикаго', en: 'Chicago' }, { ru: 'Лос-Анджелес', en: 'Los Angeles' }, { ru: 'Майами', en: 'Miami' }] },
      { ru: 'Амстердам', en: 'Amsterdam', ghost: [{ ru: 'Брюссель', en: 'Brussels' }, { ru: 'Антверпен', en: 'Antwerp' }, { ru: 'Роттердам', en: 'Rotterdam' }] },
    ],
  },
  {
    id: 'professions',
    words: [
      { ru: 'Врач', en: 'Doctor', ghost: [{ ru: 'Хирург', en: 'Surgeon' }, { ru: 'Терапевт', en: 'Therapist' }, { ru: 'Педиатр', en: 'Pediatrician' }] },
      { ru: 'Ветеринар', en: 'Veterinarian', ghost: [{ ru: 'Зоолог', en: 'Zoologist' }, { ru: 'Кинолог', en: 'Dog Handler' }, { ru: 'Фелинолог', en: 'Felinologist' }] },
      { ru: 'Медсестра', en: 'Nurse', ghost: [{ ru: 'Санитар', en: 'Orderly' }, { ru: 'Акушер', en: 'Midwife' }, { ru: 'Фельдшер', en: 'Paramedic' }] },
      { ru: 'Стоматолог', en: 'Dentist', ghost: [{ ru: 'Ортодонт', en: 'Orthodontist' }, { ru: 'Ортопед', en: 'Orthopedist' }, { ru: 'Пародонтолог', en: 'Periodontist' }] },
      { ru: 'Фармацевт', en: 'Pharmacist', ghost: [{ ru: 'Провизор', en: 'Druggist' }, { ru: 'Биохимик', en: 'Biochemist' }, { ru: 'Токсиколог', en: 'Toxicologist' }] },
      { ru: 'Актёр', en: 'Actor', ghost: [{ ru: 'Режиссёр', en: 'Director' }, { ru: 'Каскадёр', en: 'Stuntman' }, { ru: 'Продюсер', en: 'Producer' }] },
      { ru: 'Художник', en: 'Painter', ghost: [{ ru: 'Скульптор', en: 'Sculptor' }, { ru: 'Иллюстратор', en: 'Illustrator' }, { ru: 'Гравёр', en: 'Engraver' }] },
      { ru: 'Музыкант', en: 'Musician', ghost: [{ ru: 'Певец', en: 'Singer' }, { ru: 'Дирижёр', en: 'Conductor' }, { ru: 'Композитор', en: 'Composer' }] },
      { ru: 'Писатель', en: 'Writer', ghost: [{ ru: 'Журналист', en: 'Journalist' }, { ru: 'Сценарист', en: 'Screenwriter' }, { ru: 'Редактор', en: 'Editor' }] },
      { ru: 'Повар', en: 'Chef', ghost: [{ ru: 'Пекарь', en: 'Baker' }, { ru: 'Кондитер', en: 'Pastry Chef' }, { ru: 'Бариста', en: 'Barista' }] },
      { ru: 'Учитель', en: 'Teacher', ghost: [{ ru: 'Воспитатель', en: 'Kindergarten Teacher' }, { ru: 'Репетитор', en: 'Tutor' }, { ru: 'Преподаватель', en: 'Lecturer' }] },
      { ru: 'Юрист', en: 'Lawyer', ghost: [{ ru: 'Адвокат', en: 'Advocate' }, { ru: 'Нотариус', en: 'Notary' }, { ru: 'Прокурор', en: 'Prosecutor' }] },
      { ru: 'Полицейский', en: 'Police Officer', ghost: [{ ru: 'Детектив', en: 'Detective' }, { ru: 'Следователь', en: 'Investigator' }, { ru: 'Охранник', en: 'Security Guard' }] },
      { ru: 'Пожарный', en: 'Firefighter', ghost: [{ ru: 'Спасатель', en: 'Rescuer' }, { ru: 'Сапёр', en: 'Sapper' }, { ru: 'Лесник', en: 'Ranger' }] },
      { ru: 'Пилот', en: 'Pilot', ghost: [{ ru: 'Стюардесса', en: 'Flight Attendant' }, { ru: 'Диспетчер', en: 'Air Traffic Controller' }, { ru: 'Штурман', en: 'Navigator' }] },
      { ru: 'Архитектор', en: 'Architect', ghost: [{ ru: 'Дизайнер', en: 'Designer' }, { ru: 'Инженер', en: 'Engineer' }, { ru: 'Строитель', en: 'Builder' }] },
    ],
  },
  {
    id: 'relationships',
    words: [
      { ru: 'Симпатия', en: 'Crush', ghost: [{ ru: 'Влечение', en: 'Attraction' }, { ru: 'Влюблённость', en: 'Infatuation' }, { ru: 'Интерес', en: 'Interest' }] },
      { ru: 'Флирт', en: 'Flirt', ghost: [{ ru: 'Заигрывание', en: 'Flirting' }, { ru: 'Кокетство', en: 'Coquetry' }, { ru: 'Ухаживание', en: 'Courtship' }] },
      { ru: 'Свидание', en: 'Date', ghost: [{ ru: 'Романтическая прогулка', en: 'Romantic Walk' }, { ru: 'Романтический ужин', en: 'Romantic Dinner' }, { ru: 'Встреча', en: 'Meeting' }] },
      { ru: 'Поцелуй', en: 'Kiss', ghost: [{ ru: 'Объятие', en: 'Embrace' }, { ru: 'Нежность', en: 'Tenderness' }, { ru: 'Прикосновение', en: 'Touch' }] },
      { ru: 'Предложение', en: 'Proposal', ghost: [{ ru: 'Кольцо', en: 'Ring' }, { ru: 'Признание', en: 'Confession' }, { ru: 'Обещание', en: 'Promise' }] },
      { ru: 'Помолвка', en: 'Engagement', ghost: [{ ru: 'Обручение', en: 'Betrothal' }, { ru: 'Сватовство', en: 'Matchmaking' }, { ru: 'Кольцо', en: 'Ring' }] },
      { ru: 'Свадьба', en: 'Wedding', ghost: [{ ru: 'Венчание', en: 'Church Wedding' }, { ru: 'Регистрация', en: 'Registry Office' }, { ru: 'Бракосочетание', en: 'Matrimony' }] },
      { ru: 'Медовый месяц', en: 'Honeymoon', ghost: [{ ru: 'Романтическое путешествие', en: 'Romantic Trip' }, { ru: 'Отпуск вдвоём', en: 'Vacation Together' }, { ru: 'Первый месяц', en: 'First Month' }] },
      { ru: 'Ревность', en: 'Jealousy', ghost: [{ ru: 'Обида', en: 'Resentment' }, { ru: 'Подозрение', en: 'Suspicion' }, { ru: 'Собственничество', en: 'Possessiveness' }] },
      { ru: 'Измена', en: 'Infidelity', ghost: [{ ru: 'Предательство', en: 'Betrayal' }, { ru: 'Обман', en: 'Deception' }, { ru: 'Ложь', en: 'Lie' }] },
      { ru: 'Развод', en: 'Divorce', ghost: [{ ru: 'Расставание', en: 'Breakup' }, { ru: 'Разрыв', en: 'Split' }, { ru: 'Раздел имущества', en: 'Property Division' }] },
      { ru: 'Бывший', en: 'Ex', ghost: [{ ru: 'Экс', en: 'Ex-partner' }, { ru: 'Прошлое', en: 'The Past' }, { ru: 'Воспоминание', en: 'Memory' }] },
      { ru: 'Ссора', en: 'Argument', ghost: [{ ru: 'Конфликт', en: 'Conflict' }, { ru: 'Скандал', en: 'Scandal' }, { ru: 'Споры', en: 'Dispute' }] },
      { ru: 'Примирение', en: 'Reconciliation', ghost: [{ ru: 'Прощение', en: 'Forgiveness' }, { ru: 'Перемирие', en: 'Truce' }, { ru: 'Мировая', en: 'Peace' }] },
      { ru: 'Разлука', en: 'Separation', ghost: [{ ru: 'Расстояние', en: 'Distance' }, { ru: 'Тоска', en: 'Longing' }, { ru: 'Ожидание', en: 'Waiting' }] },
      { ru: 'Дружба', en: 'Friendship', ghost: [{ ru: 'Приятельство', en: 'Acquaintance' }, { ru: 'Товарищество', en: 'Comradeship' }, { ru: 'Братство', en: 'Brotherhood' }] },
    ],
  },
  {
    id: 'games',
    words: [
      { ru: 'Dota 2', en: 'Dota 2', ghost: [{ ru: 'Smite', en: 'Smite' }, { ru: 'Heroes of the Storm', en: 'Heroes of the Storm' }, { ru: 'Paladins', en: 'Paladins' }] },
      { ru: 'Counter-Strike 2', en: 'Counter-Strike 2', ghost: [{ ru: 'Overwatch', en: 'Overwatch' }, { ru: 'Rainbow Six Siege', en: 'Rainbow Six Siege' }, { ru: 'Battlefield', en: 'Battlefield' }] },
      { ru: 'Valorant', en: 'Valorant', ghost: [{ ru: 'Overwatch', en: 'Overwatch' }, { ru: 'Paladins', en: 'Paladins' }, { ru: 'Warzone', en: 'Warzone' }] },
      { ru: 'League of Legends', en: 'League of Legends', ghost: [{ ru: 'Smite', en: 'Smite' }, { ru: 'Heroes of the Storm', en: 'Heroes of the Storm' }, { ru: 'Battlerite', en: 'Battlerite' }] },
      { ru: 'Apex Legends', en: 'Apex Legends', ghost: [{ ru: 'Warzone', en: 'Warzone' }, { ru: 'PUBG', en: 'PUBG' }, { ru: 'Titanfall 2', en: 'Titanfall 2' }] },
      { ru: 'GTA V', en: 'GTA V', ghost: [{ ru: 'Mafia', en: 'Mafia' }, { ru: 'Saints Row', en: 'Saints Row' }, { ru: 'Watch Dogs', en: 'Watch Dogs' }] },
      { ru: 'The Witcher 3', en: 'The Witcher 3', ghost: [{ ru: 'Dragon Age', en: 'Dragon Age' }, { ru: "Baldur's Gate", en: "Baldur's Gate" }, { ru: 'Divinity', en: 'Divinity' }] },
      { ru: 'Cyberpunk 2077', en: 'Cyberpunk 2077', ghost: [{ ru: 'Deus Ex', en: 'Deus Ex' }, { ru: 'Prey', en: 'Prey' }, { ru: 'Ghostrunner', en: 'Ghostrunner' }] },
      { ru: 'Red Dead Redemption 2', en: 'Red Dead Redemption 2', ghost: [{ ru: 'Mafia III', en: 'Mafia III' }, { ru: 'Hunt: Showdown', en: 'Hunt: Showdown' }, { ru: 'Desperados', en: 'Desperados' }] },
      { ru: 'Skyrim', en: 'Skyrim', ghost: [{ ru: 'Oblivion', en: 'Oblivion' }, { ru: 'Morrowind', en: 'Morrowind' }, { ru: 'Dragon Age', en: 'Dragon Age' }] },
      { ru: 'Minecraft', en: 'Minecraft', ghost: [{ ru: 'Roblox', en: 'Roblox' }, { ru: 'Valheim', en: 'Valheim' }, { ru: 'Core Keeper', en: 'Core Keeper' }] },
      { ru: 'Terraria', en: 'Terraria', ghost: [{ ru: 'Starbound', en: 'Starbound' }, { ru: 'Core Keeper', en: 'Core Keeper' }, { ru: 'Stardew Valley', en: 'Stardew Valley' }] },
      { ru: 'The Sims 4', en: 'The Sims 4', ghost: [{ ru: 'Stardew Valley', en: 'Stardew Valley' }, { ru: 'Animal Crossing', en: 'Animal Crossing' }, { ru: 'My Time at Portia', en: 'My Time at Portia' }] },
      { ru: 'Among Us', en: 'Among Us', ghost: [{ ru: 'Goose Goose Duck', en: 'Goose Goose Duck' }, { ru: 'Town of Salem', en: 'Town of Salem' }, { ru: 'Project Winter', en: 'Project Winter' }] },
      { ru: 'Fortnite', en: 'Fortnite', ghost: [{ ru: 'PUBG', en: 'PUBG' }, { ru: 'Warzone', en: 'Warzone' }, { ru: 'Fall Guys', en: 'Fall Guys' }] },
      { ru: 'Elden Ring', en: 'Elden Ring', ghost: [{ ru: 'Dark Souls', en: 'Dark Souls' }, { ru: 'Sekiro', en: 'Sekiro' }, { ru: 'Bloodborne', en: 'Bloodborne' }] },
    ],
  },
  {
    id: 'movies',
    words: [
      { ru: 'Матрица', en: 'The Matrix', ghost: [{ ru: 'Начало', en: 'Inception' }, { ru: 'Бегущий по лезвию', en: 'Blade Runner' }, { ru: 'Я, робот', en: 'I, Robot' }] },
      { ru: 'Интерстеллар', en: 'Interstellar', ghost: [{ ru: 'Гравитация', en: 'Gravity' }, { ru: 'Марсианин', en: 'The Martian' }, { ru: 'Прибытие', en: 'Arrival' }] },
      { ru: 'Дюна', en: 'Dune', ghost: [{ ru: 'Аватар', en: 'Avatar' }, { ru: 'Звёздные войны', en: 'Star Wars' }, { ru: 'Стражи Галактики', en: 'Guardians of the Galaxy' }] },
      { ru: 'Шрек', en: 'Shrek', ghost: [{ ru: 'Мадагаскар', en: 'Madagascar' }, { ru: 'Ледниковый период', en: 'Ice Age' }, { ru: 'Кот в сапогах', en: 'Puss in Boots' }] },
      { ru: 'Король Лев', en: 'The Lion King', ghost: [{ ru: 'Книга джунглей', en: 'The Jungle Book' }, { ru: 'Бэмби', en: 'Bambi' }, { ru: 'Дамбо', en: 'Dumbo' }] },
      { ru: 'История игрушек', en: 'Toy Story', ghost: [{ ru: 'Вверх', en: 'Up' }, { ru: 'Душа', en: 'Soul' }, { ru: 'ВАЛЛ-И', en: 'WALL-E' }] },
      { ru: 'Гарри Поттер', en: 'Harry Potter', ghost: [{ ru: 'Хроники Нарнии', en: 'The Chronicles of Narnia' }, { ru: 'Фантастические твари', en: 'Fantastic Beasts' }, { ru: 'Перси Джексон', en: 'Percy Jackson' }] },
      { ru: 'Властелин колец', en: 'The Lord of the Rings', ghost: [{ ru: 'Хоббит', en: 'The Hobbit' }, { ru: 'Хроники Нарнии', en: 'The Chronicles of Narnia' }, { ru: 'Игра престолов', en: 'Game of Thrones' }] },
      { ru: 'Терминатор', en: 'The Terminator', ghost: [{ ru: 'РобоКоп', en: 'RoboCop' }, { ru: 'Бегущий по лезвию', en: 'Blade Runner' }, { ru: 'Хищник', en: 'Predator' }] },
      { ru: 'Гладиатор', en: 'Gladiator', ghost: [{ ru: '300 спартанцев', en: '300' }, { ru: 'Царство небесное', en: 'Kingdom of Heaven' }, { ru: 'Бен-Гур', en: 'Ben-Hur' }] },
      { ru: 'Джокер', en: 'Joker', ghost: [{ ru: 'Тёмный рыцарь', en: 'The Dark Knight' }, { ru: 'Таксист', en: 'Taxi Driver' }, { ru: 'Американская история X', en: 'American History X' }] },
      { ru: 'Бойцовский клуб', en: 'Fight Club', ghost: [{ ru: 'Американская история X', en: 'American History X' }, { ru: 'Реквием по мечте', en: 'Requiem for a Dream' }, { ru: 'Семь', en: 'Se7en' }] },
      { ru: 'Титаник', en: 'Titanic', ghost: [{ ru: 'Ромео и Джульетта', en: 'Romeo and Juliet' }, { ru: 'Унесённые ветром', en: 'Gone with the Wind' }, { ru: 'Касабланка', en: 'Casablanca' }] },
      { ru: 'Зелёная миля', en: 'The Green Mile', ghost: [{ ru: '1+1', en: 'The Intouchables' }, { ru: 'Список Шиндлера', en: "Schindler's List" }, { ru: 'Достучаться до небес', en: "Knockin' on Heaven's Door" }] },
      { ru: 'Форрест Гамп', en: 'Forrest Gump', ghost: [{ ru: 'Шоу Трумана', en: 'The Truman Show' }, { ru: 'Рокки', en: 'Rocky' }, { ru: 'Касабланка', en: 'Casablanca' }] },
      { ru: 'Побег из Шоушенка', en: 'The Shawshank Redemption', ghost: [{ ru: 'Список Шиндлера', en: "Schindler's List" }, { ru: 'Жизнь прекрасна', en: 'Life is Beautiful' }, { ru: 'Игры разума', en: 'A Beautiful Mind' }] },
    ],
  },
  {
    id: 'brands',
    words: [
      { ru: 'Apple', en: 'Apple', ghost: [{ ru: 'Huawei', en: 'Huawei' }, { ru: 'Xiaomi', en: 'Xiaomi' }, { ru: 'Nokia', en: 'Nokia' }] },
      { ru: 'Samsung', en: 'Samsung', ghost: [{ ru: 'LG', en: 'LG' }, { ru: 'Huawei', en: 'Huawei' }, { ru: 'Xiaomi', en: 'Xiaomi' }] },
      { ru: 'Sony', en: 'Sony', ghost: [{ ru: 'LG', en: 'LG' }, { ru: 'Panasonic', en: 'Panasonic' }, { ru: 'Philips', en: 'Philips' }] },
      { ru: 'Google', en: 'Google', ghost: [{ ru: 'Яндекс', en: 'Yandex' }, { ru: 'Yahoo', en: 'Yahoo' }, { ru: 'Bing', en: 'Bing' }] },
      { ru: 'Microsoft', en: 'Microsoft', ghost: [{ ru: 'Oracle', en: 'Oracle' }, { ru: 'Adobe', en: 'Adobe' }, { ru: 'IBM', en: 'IBM' }] },
      { ru: 'Nike', en: 'Nike', ghost: [{ ru: 'Asics', en: 'Asics' }, { ru: 'New Balance', en: 'New Balance' }, { ru: 'FILA', en: 'FILA' }] },
      { ru: 'Adidas', en: 'Adidas', ghost: [{ ru: 'Asics', en: 'Asics' }, { ru: 'New Balance', en: 'New Balance' }, { ru: 'Umbro', en: 'Umbro' }] },
      { ru: 'Puma', en: 'Puma', ghost: [{ ru: 'New Balance', en: 'New Balance' }, { ru: 'Asics', en: 'Asics' }, { ru: 'FILA', en: 'FILA' }] },
      { ru: 'Reebok', en: 'Reebok', ghost: [{ ru: 'FILA', en: 'FILA' }, { ru: 'New Balance', en: 'New Balance' }, { ru: 'Asics', en: 'Asics' }] },
      { ru: 'Under Armour', en: 'Under Armour', ghost: [{ ru: 'FILA', en: 'FILA' }, { ru: 'Umbro', en: 'Umbro' }, { ru: 'Kappa', en: 'Kappa' }] },
      { ru: 'Coca-Cola', en: 'Coca-Cola', ghost: [{ ru: 'Sprite', en: 'Sprite' }, { ru: 'Fanta', en: 'Fanta' }, { ru: 'Dr Pepper', en: 'Dr Pepper' }] },
      { ru: 'McDonald\'s', en: 'McDonald\'s', ghost: [{ ru: 'Burger King', en: 'Burger King' }, { ru: 'Wendy\'s', en: 'Wendy\'s' }, { ru: 'Subway', en: 'Subway' }] },
      { ru: 'Pepsi', en: 'Pepsi', ghost: [{ ru: 'RC Cola', en: 'RC Cola' }, { ru: 'Dr Pepper', en: 'Dr Pepper' }, { ru: 'Sprite', en: 'Sprite' }] },
      { ru: 'KFC', en: 'KFC', ghost: [{ ru: 'Burger King', en: 'Burger King' }, { ru: 'Popeyes', en: 'Popeyes' }, { ru: 'Wendy\'s', en: 'Wendy\'s' }] },
      { ru: 'Starbucks', en: 'Starbucks', ghost: [{ ru: 'Costa Coffee', en: 'Costa Coffee' }, { ru: 'Tim Hortons', en: 'Tim Hortons' }, { ru: 'Dunkin', en: 'Dunkin' }] },
      { ru: 'IKEA', en: 'IKEA', ghost: [{ ru: 'JYSK', en: 'JYSK' }, { ru: 'Hoff', en: 'Hoff' }, { ru: 'Leroy Merlin', en: 'Leroy Merlin' }] },
    ],
  },
  {
    id: 'anime',
    words: [
      { ru: 'Наруто', en: 'Naruto', ghost: [{ ru: 'Хвост феи', en: 'Fairy Tail' }, { ru: 'Драгонболл', en: 'Dragon Ball' }, { ru: 'Семь смертных грехов', en: 'The Seven Deadly Sins' }] },
      { ru: 'Блич', en: 'Bleach', ghost: [{ ru: 'Стальной алхимик', en: 'Fullmetal Alchemist' }, { ru: 'Хвост феи', en: 'Fairy Tail' }, { ru: 'Драгонболл', en: 'Dragon Ball' }] },
      { ru: 'Ван-Пис', en: 'One Piece', ghost: [{ ru: 'Хвост феи', en: 'Fairy Tail' }, { ru: 'Драгонболл', en: 'Dragon Ball' }, { ru: 'Семь смертных грехов', en: 'The Seven Deadly Sins' }] },
      { ru: 'Hunter x Hunter', en: 'Hunter x Hunter', ghost: [{ ru: 'Хвост феи', en: 'Fairy Tail' }, { ru: 'Драгонболл', en: 'Dragon Ball' }, { ru: 'Семь смертных грехов', en: 'The Seven Deadly Sins' }] },
      { ru: 'Тетрадь смерти', en: 'Death Note', ghost: [{ ru: 'Психо-Пасс', en: 'Psycho-Pass' }, { ru: 'Монстр', en: 'Monster' }, { ru: 'Эрго Прокси', en: 'Ergo Proxy' }] },
      { ru: 'Паразит', en: 'Parasyte', ghost: [{ ru: 'Берсерк', en: 'Berserk' }, { ru: 'Ганц', en: 'Gantz' }, { ru: 'Эльфийская песнь', en: 'Elfen Lied' }] },
      { ru: 'Токийский гуль', en: 'Tokyo Ghoul', ghost: [{ ru: 'Тёмный дворецкий', en: 'Black Butler' }, { ru: 'Берсерк', en: 'Berserk' }, { ru: 'Ганц', en: 'Gantz' }] },
      { ru: 'Человек-бензопила', en: 'Chainsaw Man', ghost: [{ ru: 'Берсерк', en: 'Berserk' }, { ru: 'Ганц', en: 'Gantz' }, { ru: 'Дорохедоро', en: 'Dorohedoro' }] },
      { ru: 'Клинок, рассекающий демонов', en: 'Demon Slayer', ghost: [{ ru: 'Синий экзорцист', en: 'Blue Exorcist' }, { ru: 'Семь смертных грехов', en: 'The Seven Deadly Sins' }, { ru: 'Драгонболл', en: 'Dragon Ball' }] },
      { ru: 'Магическая битва', en: 'Jujutsu Kaisen', ghost: [{ ru: 'Синий экзорцист', en: 'Blue Exorcist' }, { ru: 'Драгонболл', en: 'Dragon Ball' }, { ru: 'Семь смертных грехов', en: 'The Seven Deadly Sins' }] },
      { ru: 'Моя геройская академия', en: 'My Hero Academia', ghost: [{ ru: 'Драгонболл', en: 'Dragon Ball' }, { ru: 'Синий экзорцист', en: 'Blue Exorcist' }, { ru: 'Семь смертных грехов', en: 'The Seven Deadly Sins' }] },
      { ru: 'Чёрный клевер', en: 'Black Clover', ghost: [{ ru: 'Хвост феи', en: 'Fairy Tail' }, { ru: 'Драгонболл', en: 'Dragon Ball' }, { ru: 'Синий экзорцист', en: 'Blue Exorcist' }] },
      { ru: 'Атака титанов', en: 'Attack on Titan', ghost: [{ ru: 'Стальной алхимик', en: 'Fullmetal Alchemist' }, { ru: 'Берсерк', en: 'Berserk' }, { ru: 'Эльфийская песнь', en: 'Elfen Lied' }] },
      { ru: 'Код Гиас', en: 'Code Geass', ghost: [{ ru: 'Психо-Пасс', en: 'Psycho-Pass' }, { ru: 'Стальной алхимик', en: 'Fullmetal Alchemist' }, { ru: 'Эльфийская песнь', en: 'Elfen Lied' }] },
      { ru: '86', en: '86', ghost: [{ ru: 'Виолетта Эвергарден', en: 'Violet Evergarden' }, { ru: 'Стальной алхимик', en: 'Fullmetal Alchemist' }, { ru: 'Психо-Пасс', en: 'Psycho-Pass' }] },
      { ru: 'Винланд Сага', en: 'Vinland Saga', ghost: [{ ru: 'Берсерк', en: 'Berserk' }, { ru: 'Золотой Камуй', en: 'Golden Kamuy' }, { ru: 'Дороро', en: 'Dororo' }] },
    ],
  },
  {
    id: 'game_characters',
    words: [
      { ru: 'Марио', en: 'Mario', ghost: [{ ru: 'Луиджи', en: 'Luigi' }, { ru: 'Варио', en: 'Wario' }, { ru: 'Боузер', en: 'Bowser' }] },
      { ru: 'Соник', en: 'Sonic', ghost: [{ ru: 'Тейлз', en: 'Tails' }, { ru: 'Наклз', en: 'Knuckles' }, { ru: 'Шэдоу', en: 'Shadow' }] },
      { ru: 'Линк', en: 'Link', ghost: [{ ru: 'Клауд', en: 'Cloud' }, { ru: 'Эцио', en: 'Ezio' }, { ru: 'Данте', en: 'Dante' }] },
      { ru: 'Пакман', en: 'Pac-Man', ghost: [{ ru: 'Краш Бандикут', en: 'Crash Bandicoot' }, { ru: 'Бомбермен', en: 'Bomberman' }, { ru: 'Диг Даг', en: 'Dig Dug' }] },
      { ru: 'Кирби', en: 'Kirby', ghost: [{ ru: 'Мета Найт', en: 'Meta Knight' }, { ru: 'Король Дедеде', en: 'King Dedede' }, { ru: 'Вэдл Ди', en: 'Waddle Dee' }] },
      { ru: 'Геральт', en: 'Geralt', ghost: [{ ru: 'Дзин Сакай', en: 'Jin Sakai' }, { ru: 'Клауд', en: 'Cloud' }, { ru: 'Данте', en: 'Dante' }] },
      { ru: 'Кратос', en: 'Kratos', ghost: [{ ru: 'Дум Гай', en: 'Doom Slayer' }, { ru: 'Маркус Феникс', en: 'Marcus Fenix' }, { ru: 'Данте', en: 'Dante' }] },
      { ru: 'Артур Морган', en: 'Arthur Morgan', ghost: [{ ru: 'Джон Марстон', en: 'John Marston' }, { ru: 'Датч', en: 'Dutch' }, { ru: 'Мика', en: 'Micah' }] },
      { ru: 'Си Джей', en: 'CJ', ghost: [{ ru: 'Томми Версетти', en: 'Tommy Vercetti' }, { ru: 'Нико Беллик', en: 'Niko Bellic' }, { ru: 'Тревор', en: 'Trevor' }] },
      { ru: 'Джоэл', en: 'Joel', ghost: [{ ru: 'Томми', en: 'Tommy' }, { ru: 'Билл', en: 'Bill' }, { ru: 'Дэвид', en: 'David' }] },
      { ru: 'Лара Крофт', en: 'Lara Croft', ghost: [{ ru: 'Элой', en: 'Aloy' }, { ru: 'Самус Аран', en: 'Samus Aran' }, { ru: 'Надин Росс', en: 'Nadine Ross' }] },
      { ru: 'Агент 47', en: 'Agent 47', ghost: [{ ru: 'Сэм Фишер', en: 'Sam Fisher' }, { ru: 'Биг Босс', en: 'Big Boss' }, { ru: 'Корво', en: 'Corvo' }] },
      { ru: 'Мастер Чиф', en: 'Master Chief', ghost: [{ ru: 'Арбитр', en: 'The Arbiter' }, { ru: 'Нобл Сикс', en: 'Noble Six' }, { ru: 'Сержант Джонсон', en: 'Sergeant Johnson' }] },
      { ru: 'Солид Снейк', en: 'Solid Snake', ghost: [{ ru: 'Биг Босс', en: 'Big Boss' }, { ru: 'Раиден', en: 'Raiden' }, { ru: 'Накед Снейк', en: 'Naked Snake' }] },
      { ru: 'Нейтан Дрейк', en: 'Nathan Drake', ghost: [{ ru: 'Виктор Салливан', en: 'Victor Sullivan' }, { ru: 'Сэм Дрейк', en: 'Sam Drake' }, { ru: 'Адам Дженсен', en: 'Adam Jensen' }] },
      { ru: 'Пикачу', en: 'Pikachu', ghost: [{ ru: 'Чармандер', en: 'Charmander' }, { ru: 'Иви', en: 'Eevee' }, { ru: 'Бульбазавр', en: 'Bulbasaur' }] },
    ],
  },
  {
    id: 'historical_figures',
    words: [
      { ru: 'Леонардо да Винчи', en: 'Leonardo da Vinci', ghost: [{ ru: 'Микеланджело', en: 'Michelangelo' }, { ru: 'Рафаэль', en: 'Raphael' }, { ru: 'Боттичелли', en: 'Botticelli' }] },
      { ru: 'Никола Тесла', en: 'Nikola Tesla', ghost: [{ ru: 'Томас Эдисон', en: 'Thomas Edison' }, { ru: 'Маркони', en: 'Marconi' }, { ru: 'Ампер', en: 'Ampere' }] },
      { ru: 'Альберт Эйнштейн', en: 'Albert Einstein', ghost: [{ ru: 'Нильс Бор', en: 'Niels Bohr' }, { ru: 'Макс Планк', en: 'Max Planck' }, { ru: 'Стивен Хокинг', en: 'Stephen Hawking' }] },
      { ru: 'Галилео Галилей', en: 'Galileo Galilei', ghost: [{ ru: 'Николай Коперник', en: 'Nicolaus Copernicus' }, { ru: 'Иоганн Кеплер', en: 'Johannes Kepler' }, { ru: 'Тихо Браге', en: 'Tycho Brahe' }] },
      { ru: 'Исаак Ньютон', en: 'Isaac Newton', ghost: [{ ru: 'Готфрид Лейбниц', en: 'Gottfried Leibniz' }, { ru: 'Роберт Гук', en: 'Robert Hooke' }, { ru: 'Эдмунд Галлей', en: 'Edmond Halley' }] },
      { ru: 'Наполеон', en: 'Napoleon', ghost: [{ ru: 'Фридрих Великий', en: 'Frederick the Great' }, { ru: 'Ганнибал', en: 'Hannibal' }, { ru: 'Карл Великий', en: 'Charlemagne' }] },
      { ru: 'Юлий Цезарь', en: 'Julius Caesar', ghost: [{ ru: 'Октавиан Август', en: 'Augustus' }, { ru: 'Марк Антоний', en: 'Mark Antony' }, { ru: 'Помпей', en: 'Pompey' }] },
      { ru: 'Чингисхан', en: 'Genghis Khan', ghost: [{ ru: 'Аттила', en: 'Attila the Hun' }, { ru: 'Батый', en: 'Batu Khan' }, { ru: 'Кубилай-хан', en: 'Kublai Khan' }] },
      { ru: 'Александр Македонский', en: 'Alexander the Great', ghost: [{ ru: 'Дарий III', en: 'Darius III' }, { ru: 'Птолемей', en: 'Ptolemy' }, { ru: 'Пирр', en: 'Pyrrhus' }] },
      { ru: 'Тамерлан', en: 'Tamerlane', ghost: [{ ru: 'Бабур', en: 'Babur' }, { ru: 'Тохтамыш', en: 'Tokhtamysh' }, { ru: 'Улугбек', en: 'Ulugh Beg' }] },
      { ru: 'Клеопатра', en: 'Cleopatra', ghost: [{ ru: 'Нефертити', en: 'Nefertiti' }, { ru: 'Хатшепсут', en: 'Hatshepsut' }, { ru: 'Артемисия', en: 'Artemisia' }] },
      { ru: 'Жанна д’Арк', en: 'Joan of Arc', ghost: [{ ru: 'Изабелла Кастильская', en: 'Isabella of Castile' }, { ru: 'Елизавета I', en: 'Elizabeth I' }, { ru: 'Боудикка', en: 'Boudica' }] },
      { ru: 'Уинстон Черчилль', en: 'Winston Churchill', ghost: [{ ru: 'Чарльз де Голль', en: 'Charles de Gaulle' }, { ru: 'Франклин Рузвельт', en: 'Franklin Roosevelt' }, { ru: 'Дуайт Эйзенхауэр', en: 'Dwight Eisenhower' }] },
      { ru: 'Махатма Ганди', en: 'Mahatma Gandhi', ghost: [{ ru: 'Мартин Лютер Кинг', en: 'Martin Luther King' }, { ru: 'Нельсон Мандела', en: 'Nelson Mandela' }, { ru: 'Далай-лама', en: 'Dalai Lama' }] },
      { ru: 'Христофор Колумб', en: 'Christopher Columbus', ghost: [{ ru: 'Фернан Магеллан', en: 'Ferdinand Magellan' }, { ru: 'Васко да Гама', en: 'Vasco da Gama' }, { ru: 'Джон Кабот', en: 'John Cabot' }] },
      { ru: 'Мария Кюри', en: 'Marie Curie', ghost: [{ ru: 'Розалинд Франклин', en: 'Rosalind Franklin' }, { ru: 'Ада Лавлейс', en: 'Ada Lovelace' }, { ru: 'Лиза Мейтнер', en: 'Lise Meitner' }] },
    ],
  },
  {
    id: 'celebrities',
    words: [
      { ru: 'Криштиану Роналду', en: 'Cristiano Ronaldo', ghost: [{ ru: 'Зидан', en: 'Zidane' }, { ru: 'Бекхэм', en: 'Beckham' }, { ru: 'Роналдиньо', en: 'Ronaldinho' }] },
      { ru: 'Лионель Месси', en: 'Lionel Messi', ghost: [{ ru: 'Марадона', en: 'Maradona' }, { ru: 'Иньеста', en: 'Iniesta' }, { ru: 'Хави', en: 'Xavi' }] },
      { ru: 'Неймар', en: 'Neymar', ghost: [{ ru: 'Роналдиньо', en: 'Ronaldinho' }, { ru: 'Винисиус Жр.', en: 'Vinícius Jr.' }, { ru: 'Кака', en: 'Kaká' }] },
      { ru: 'Килиан Мбаппе', en: 'Kylian Mbappé', ghost: [{ ru: 'Винисиус Жр.', en: 'Vinícius Jr.' }, { ru: 'Педри', en: 'Pedri' }, { ru: 'Гризманн', en: 'Griezmann' }] },
      { ru: 'Эрлинг Холанд', en: 'Erling Haaland', ghost: [{ ru: 'Роберт Левандовски', en: 'Robert Lewandowski' }, { ru: 'Гарри Кейн', en: 'Harry Kane' }, { ru: 'Бензема', en: 'Benzema' }] },
      { ru: 'Тейлор Свифт', en: 'Taylor Swift', ghost: [{ ru: 'Дуа Липа', en: 'Dua Lipa' }, { ru: 'Кэти Перри', en: 'Katy Perry' }, { ru: 'Леди Гага', en: 'Lady Gaga' }] },
      { ru: 'Билли Айлиш', en: 'Billie Eilish', ghost: [{ ru: 'Оливия Родриго', en: 'Olivia Rodrigo' }, { ru: 'Дуа Липа', en: 'Dua Lipa' }, { ru: 'Лана Дель Рей', en: 'Lana Del Rey' }] },
      { ru: 'Шакира', en: 'Shakira', ghost: [{ ru: 'Дженнифер Лопес', en: 'Jennifer Lopez' }, { ru: 'Бейонсе', en: 'Beyoncé' }, { ru: 'Рианна', en: 'Rihanna' }] },
      { ru: 'Селена Гомес', en: 'Selena Gomez', ghost: [{ ru: 'Деми Ловато', en: 'Demi Lovato' }, { ru: 'Майли Сайрус', en: 'Miley Cyrus' }, { ru: 'Камила Кабельо', en: 'Camila Cabello' }] },
      { ru: 'Ариана Гранде', en: 'Ariana Grande', ghost: [{ ru: 'Ники Минаж', en: 'Nicki Minaj' }, { ru: 'Дуа Липа', en: 'Dua Lipa' }, { ru: 'Кэти Перри', en: 'Katy Perry' }] },
      { ru: 'Киану Ривз', en: 'Keanu Reeves', ghost: [{ ru: 'Брэд Питт', en: 'Brad Pitt' }, { ru: 'Джонни Депп', en: 'Johnny Depp' }, { ru: 'Уилл Смит', en: 'Will Smith' }] },
      { ru: 'Дуэйн Джонсон', en: 'Dwayne Johnson', ghost: [{ ru: 'Арнольд Шварценеггер', en: 'Arnold Schwarzenegger' }, { ru: 'Вин Дизель', en: 'Vin Diesel' }, { ru: 'Джейсон Стейтем', en: 'Jason Statham' }] },
      { ru: 'Том Круз', en: 'Tom Cruise', ghost: [{ ru: 'Брэд Питт', en: 'Brad Pitt' }, { ru: 'Мэтт Дэймон', en: 'Matt Damon' }, { ru: 'Уилл Смит', en: 'Will Smith' }] },
      { ru: 'Райан Гослинг', en: 'Ryan Gosling', ghost: [{ ru: 'Тимоти Шаламе', en: 'Timothée Chalamet' }, { ru: 'Крис Эванс', en: 'Chris Evans' }, { ru: 'Роберт Паттинсон', en: 'Robert Pattinson' }] },
      { ru: 'Леонардо ДиКаприо', en: 'Leonardo DiCaprio', ghost: [{ ru: 'Брэд Питт', en: 'Brad Pitt' }, { ru: 'Джонни Депп', en: 'Johnny Depp' }, { ru: 'Хоакин Феникс', en: 'Joaquin Phoenix' }] },
      { ru: 'Майкл Джексон', en: 'Michael Jackson', ghost: [{ ru: 'Принс', en: 'Prince' }, { ru: 'Дэвид Боуи', en: 'David Bowie' }, { ru: 'Фредди Меркьюри', en: 'Freddie Mercury' }] },
    ],
  },
];

export const CATEGORIES_DATA: CategoryData[] = RAW_CATEGORIES.map((c) => ({
  id: c.id,
  words: c.words,
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
 * Enabled words of a category as ghost entries — each word with its localized
 * analogs. Words the user has disabled are excluded entirely.
 * Used by Ghost mode to pick a word and a plausible fake word from the same entry.
 */
export function enabledGhostEntries(
  id: string,
  disabled: string[] | undefined
): { word: string; analogs: string[] }[] {
  const data = getCategoryData(id);
  const off = new Set(disabled ?? []);
  const lang = activeLang();
  return data.words
    .filter((w) => !off.has(w.ru))
    .map((w) => ({
      word: w[lang],
      analogs: w.ghost.map((g) => g[lang]),
    }));
}
