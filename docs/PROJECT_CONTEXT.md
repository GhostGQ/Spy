# Шпион — Технический контекст проекта

> Локальная (pass-and-play) party-игра «Шпион» на одном устройстве.
> Компания передаёт телефон по кругу: каждый смотрит свою роль/слово, затем идёт
> обсуждение по таймеру и голосование за победителя.

Репозиторий: **GhostGQ/Spy** · ветка по умолчанию: **main** · язык интерфейса: русский.

---

## 1. Технологический стек

| Область | Технология | Версия |
|---|---|---|
| Платформа | **Expo SDK** | `~54.0.0` (54.0.x) |
| Runtime | React Native / React | `0.81.5` / `19.1.0` |
| Язык | TypeScript | `~5.9.2` |
| Навигация | **Expo Router** (file-based) | `~6.0.24` |
| State | **Zustand** | `^4.5.5` |
| Persist | **AsyncStorage** | `2.2.0` |
| Стили | **NativeWind** (Tailwind для RN) | `^4.2.5` / tailwindcss `3.4.17` |
| Анимации | **Reanimated** + worklets | `~4.1.1` / `0.5.1` |
| Жесты | Gesture Handler | `~2.28.0` |
| Векторы/иконки | react-native-svg + **phosphor-react-native** | `15.12.1` / `^3.0.6` |
| Градиенты | expo-linear-gradient | `~15.0.8` |
| Шрифты | @expo-google-fonts **Tektur** + **Inter** | `^0.4.2` |
| Splash | expo-splash-screen | `~31.0.13` |

> **Почему SDK 54, а не 56:** выбрано для совместимости с актуальным **Expo Go**
> (он поддерживает 54). Проект был даунгрейднут с 56 → 54.

---

## 2. Состояние проекта

**Работает полный игровой цикл** (меню → создание → категории → роли → таймер →
результат → итоги), типы проходят `tsc --noEmit`, web-бандл и нативный (iOS)
собираются без ошибок.

**Идёт миграция на gaming-дизайн-систему** (тёмный neon-HUD: navy/indigo фон,
электрик-синий/фиолетовый/cyan акценты, свечения, стеклянные карточки, pill-кнопки
с градиентом, шрифты Tektur+Inter, outline-иконки Phosphor).

Статус миграции экранов:
- ✅ Главное меню (`index`) — neon SVG-герой, splash-фон
- ✅ Создание игры (`game/setup`) — SVG-иконки режимов, степперы
- ✅ Категории (`game/categories`) + детальный экран слов (`game/category`)
- ✅ Выдача ролей (`game/roles` / `RoleCard`)
- 🟡 Частично (через общие компоненты): таймер, выбор времени, результат, итоги, правила, настройки
- ⬜ Полный редизайн оставшихся: `timer-setup`, `timer`, `result`, `summary`, `rules`, `settings`

---

## 3. Игровая механика (3 режима)

| Режим | id | Слово | Спец-роль | Кол-во спец-ролей | Что видит спец-роль |
|---|---|---|---|---|---|
| Классический | `classic` | одно слово у мирных | `spy` | задаётся игроком, `1..ceil(n/2)-1` (мирные — большинство) | «Шпион», слова нет |
| Хаос | `chaos` | одно слово у мирных | `spy` | **скрыто**, рандом при старте `1..n-1` (может быть > мирных) | «Шпион», слова нет |
| Призрак | `ghost` | мирные видят слово | `ghost` | задаётся, `< мирных` | «Мирный» + **фейк-слово** из той же категории |

Победители (экран `result`):
- classic/chaos: «Победили гражданские» · «Победили шпионы» · «Пропустить»
- ghost: «Победило большинство» · «Победили призраки» · «Пропустить»

**Важная инвариант-деталь (анти-утечка «Призрака»):** иконка и акцент карточки роли
определяются по *показанной* роли (`role.word === null` ⇒ «шпион»), а **не** по
истинной `role.kind`. Призрак держит фейк-слово → выглядит как мирный и не понимает,
что он призрак.

---

## 4. Структура папок

```
app/                          # Экраны (Expo Router, file-based routing)
  _layout.tsx                 # Root Stack, загрузка шрифтов + splash gate, GH root
  index.tsx                   # Главное меню (SVG-герой, CTA «Играть»)
  rules.tsx                   # Правила (modal)
  settings.tsx                # Настройки: звук/вибрация (modal)
  game/
    setup.tsx                 # Режим, кол-во игроков, кол-во спец-ролей
    categories.tsx            # Сетка категорий (тап=выбор, удержание=детали)
    category.tsx              # Детали категории: слова + чекбоксы (param: id)
    roles.tsx                 # Выдача ролей (флип-карта по тапу)
    timer-setup.tsx           # Выбор времени обсуждения (1/3/5/10 мин)
    timer.tsx                 # Таймер + overlay паузы/выхода
    result.tsx                # Выбор победителя (зависит от режима)
    summary.tsx               # Итоги партии + «Сыграть ещё раз»/«В меню»

src/
  store/
    gameStore.ts              # Zustand: сессия игры (in-memory)
    settingsStore.ts          # Zustand + AsyncStorage persist
  game/
    types.ts                  # ModeId, RoleKind, Winner, Category, Role, GameConfig
    roles.ts                  # assignRoles(config, pools) + maxSpecialMajority
  data/
    categories.ts             # CATEGORIES[] (12 категорий) + getCategory()
    modes.ts                  # MODES[] (метаданные режимов, winners)
  theme/
    colors.ts                 # Палитра, градиенты, accentHex
    glow.ts                   # glow(hex, 'cta'|'card'|'soft') — неон-тень
  components/
    PrimaryButton.tsx         # Pill-кнопка (градиент+glow / сплошной)
    Card.tsx, SelectableCard.tsx, Stepper.tsx, ScreenHeader.tsx
    ScreenGradient.tsx        # Фон-градиент ('page' | 'splash')
    SpyHero.tsx               # Neon SVG-эмблема (главный экран)
    RoleCard.tsx              # Флип-карта роли (Reanimated)
    CircularTimer.tsx         # Круговой таймер (SVG + Reanimated)
    icons/
      ModeIcons.tsx           # Кастомные SVG-иконки режимов (SpyIcon и др.)
      CategoryIcon.tsx        # Phosphor-иконки категорий по id

Конфиги: app.json · babel.config.js · metro.config.js · tailwind.config.js ·
global.css · nativewind-env.d.ts · import-meta-plugin.js · .npmrc · tsconfig.json
```

---

## 5. Zustand stores

### `gameStore.ts` — сессия игры (in-memory, без persist)

**State:**
- `config: GameConfig` — `{ mode, categoryIds[], playerCount, specialCount }`
- `roles: Role[]` — розданные роли
- `word: string` · `fakeWord: string | null` — слово раунда / фейк (ghost)
- `roundCategoryId: string` — категория, реально использованная в раунде (для итогов)
- `effectiveSpecialCount: number` — фактическое число спец-ролей после рандома/клампа
- `durationSec: number` — выбранная длительность обсуждения
- `winner: Winner | null`

**Actions:** `setMode`, `toggleCategory`, `setPlayerCount`, `setSpecialCount`,
`patchConfig`, `startGame`, `setDuration`, `setWinner`, `playAgain`, `reset`.

**Ключевое:** `startGame`/`playAgain` вызывают `buildPools(config)` — читают
`settingsStore.disabledWords` и собирают **включённые** слова по выбранным категориям,
затем `assignRoles(config, pools)`. Так слово берётся только из активных слов.

### `settingsStore.ts` — настройки + контент (persist в AsyncStorage)

**State:** `soundEnabled`, `hapticsEnabled`, `lastMode`, `lastCategories`,
`disabledWords: Record<categoryId, string[]>` (список **выключенных** слов; пусто = все вкл),
`_hydrated`.

**Actions:** `setSound`, `setHaptics`, `rememberSetup`, `toggleWord(catId, word)`,
`setAllWords(catId, allWords, enabled)`.

Persist: middleware `persist` + `createJSONStorage(AsyncStorage)`, ключ `spy-settings`,
`partialize` сохраняет всё кроме `_hydrated`. Хелпер `enabledWords(allWords, disabled)`.

---

## 6. Навигация (Expo Router)

Корневой `Stack` в `app/_layout.tsx`: `headerShown:false`, тёмный фон, анимация
`slide_from_right`. `rules`/`settings` — модалки (`slide_from_bottom`).
`game/timer` и `game/result` — `gestureEnabled:false` (нельзя свайпнуть назад во время раунда).

**Поток экранов:**
```
index → game/setup → game/categories → game/roles → game/timer-setup → game/timer
        ├─ (пауза → «Завершить») ─┐
        └─ (таймер дошёл до 0) ───┴→ game/result → game/summary
                                                    ├─ «Сыграть ещё раз» → game/roles (playAgain)
                                                    └─ «Главное меню» → index (reset)
```
Завершение вручную и по таймеру ведут на **один** `game/result` (единая логика).
`game/category` открывается из сетки **по удержанию** плитки (param `id`), `router.back()` возвращает.

---

## 7. Дизайн-система (токены)

- **Палитра** (`theme/colors.ts` ↔ `tailwind.config.js`): фон `#13152E`/`#1A1D3A`,
  surface `#1E2248/#252A52/#2A2F5A`, акцент (primary) электрик-синий `#3B82F6`,
  `accentBright #60A5FA`, `cyan #2DD4F7`, `purple #7C3AED`, `streak(green) #34D399`,
  `danger(red) #F87171`, текст `#FFFFFF` / `textSecondary #B8BDD8` / `muted #6B7394`.
- **Градиенты:** `pageGradient`, `splashGradient`, `ctaGradient (blue→cyan)`.
- **Свечение:** `glow(hex, 'cta'|'card'|'soft')` — цветная тень (iOS) / elevation (Android).
- **Шрифты (NativeWind fontFamily-токены):** `font-display` = `Tektur_700Bold`,
  `font-display-sb` = `Tektur_600SemiBold` (заголовки, цифры, техно-вид);
  `font-sans` / `-md` / `-sb` / `-b` = Inter 400/500/600/700 (текст/кнопки).
- **Иконки:** UI — Phosphor (outline); режимы — кастомный SVG (`ModeIcons`);
  категории — Phosphor по `id` (`CategoryIcon`).

---

## 8. Категории и слова

`data/categories.ts` — **12 категорий** (`Category = { id, title, words[] }`, без emoji):
Локации, Еда, Города, Профессии, Отношения, Игры, Кино, Бренды, Аниме, Персонажи игр,
Исторические личности, Знаменитости. Иконка резолвится по `id` в `CategoryIcon`.

**Per-word управление:** на детальном экране (`game/category`) у каждого слова чекбокс.
Включённое слово попадается в игре, выключенное — нет. Состояние — в
`settingsStore.disabledWords` (persist). На сетке плитка показывает счётчик
`включено/всего`. Кнопка «Начать игру» заблокирована, если среди выбранных категорий
нет ни одного включённого слова (с подсказкой).

---

## 9. Принятые технические решения (важно для дальнейшей работы)

1. **Expo SDK 54** — ради Expo Go. Установка через `npm install` (legacy-peer-deps в `.npmrc`).
2. **`import.meta` фикс** — zustand использует `import.meta.env`, что ломает парсинг
   бандла на web и в Hermes (Expo трансформирует import.meta не во всех node_modules).
   Решение: локальный babel-плагин **`import-meta-plugin.js`** (подключён в `babel.config.js`),
   заменяет `import.meta` на безопасный объект. Подключён **до** `react-native-worklets/plugin`
   (worklets-плагин обязан быть последним).
3. **NativeWind + `Animated.View` (Reanimated):** `className` **не применяется** к
   `Animated.View`. Раскладку фейсов `RoleCard` (центрирование, радиус, бордер, паддинги)
   задаём **инлайн-стилем** (`faceBase`), не классами.
4. **NativeWind + `Pressable` со `style`-функцией:** при наличии `className` функция-стиль
   может отбрасываться → динамические цвета задаём **плоским объект-стилем**, а нажатие —
   через `active:` классы.
5. **Шрифт Tektur вместо Rajdhani:** Rajdhani не содержит кириллицу (рус. заголовки
   откатывались на системный). Tektur — техно/неон, поддерживает кириллицу, без курсива.
6. **Слово из включённых пулов:** `assignRoles(config, pools)` — чистая функция, пулы
   строит `gameStore.buildPools()` (читает `disabledWords`). Пустые пулы отфильтровываются.
7. **Dark mode = `class`** в `tailwind.config.js` (иначе NativeWind на web кидает ошибку
   при ручной смене цветовой схемы).

---

## 10. Запуск и проверка

```bash
npm install            # legacy-peer-deps уже в .npmrc
npx expo start         # QR в Expo Go, либо i / a / w
# в песочнице без сети — добавить --offline (иначе expo падает на сетевом запросе)
npx tsc --noEmit       # проверка типов
```

**Проверка UI:** web-превью (`expo start --web --offline`) + скриншоты. Для
детерминированной проверки отдельных компонентов удобно временно добавить route
`app/<name>.tsx` с примером данных, открыть по прямому URL, снять скриншот, удалить.
Замечание: на web-превью навигация Expo Router под синтетическими кликами нестабильна
(восстанавливает прошлый маршрут) — лучше дёргать через PointerEvent dispatch и проверять
по прямым URL.

---

## 11. Roadmap (ближайшее)

- [ ] Полный редизайн под дизайн-систему: `timer-setup`, `timer` (+ пауза), `result`, `summary`, `rules`, `settings`
- [ ] Иконки/типографика на оставшихся экранах (Phosphor, Tektur/Inter)
- [ ] Звук/вибрация: подключить реальные эффекты (тумблеры в настройках уже есть)
- [ ] Возможные улучшения: анимации переходов между игроками, экран статистики,
      пользовательские категории/слова, локализация
- [ ] Прогон полного цикла в Expo Go на iOS/Android (нативная проверка glow/шрифтов/флипа)

---

## 12. История (git)

```
3bfb8e8 Update category structure and enhance UI elements
8d30f47 Add gaming mobile app design system and new category icons
fee35da Category words management + 6 new categories + Phosphor icons
330cc6f Redesign role cards + fix ghost-mode icon leak
9d0277f Redesign main menu with neon hero + design-system styling
6b04481 Swap heading font Rajdhani → Tektur (techno, Cyrillic)
4474eeb Redesign game-setup screen with gaming design system
598d1eb Add Spy party game (Expo SDK 54)
8354d62 Initial commit
```
