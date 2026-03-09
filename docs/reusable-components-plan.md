# План реюзабельных компонентов — TripWeave

Сводный план по результатам аудита трёх агентов: app routes, trip/explore components, landing + UI.

---

## 1. Текущее состояние

### Уже есть и используются
- **Card** — варианты sticker (stickerPink, stickerBlue, stickerGreen и т.д.), но не везде используются; много инлайн-карточек с теми же классами.
- **Button** — варианты `default`, `outline`, `sticker` (только yellow); для зелёного/кораллового CTAs страницы вручную добавляют `getStickerBgClass("green")` и тени.
- **StickerBadge** — есть в `ui/`, но на страницах (Maps, Timeline, Suggested, Settings и т.д.) рисуют такие же пилюли вручную с `getStickerBgClass + border-2 + shadow-sticker-sm`.
- **EmptyState** — компонент есть (`src/components/ui/empty-state.tsx`), но **нигде не импортируется**; пустые состояния делают инлайном с dashed border и своей иконкой.

### Дублирующиеся паттерны (без общего компонента)
- Кнопки: primary sticker (green), outline sticker, icon-only sticker — одни и те же длинные `className` в 5–10 местах.
- Карточки: `border-2 border-border rounded-2xl shadow-sticker-card` (+ опционально hover) — в dashboard, budget, documents, members, notifications, profile.
- Пустые состояния: dashed box + иконка в круге + заголовок + описание + CTA — timeline, documents, members, explore, SuggestedPlacesBoard, DayColumn, NewTripCard.
- Заголовки страниц: badge (pill) + title + description + actions — dashboard, explore, maps, notifications, timeline, map, suggested, settings (8+ страниц).
- Лендинг: 15+ hero-стикеров с одинаковой базой (motion.div + getStickerBgClass + border + shadow + shape), секции с повторяющимся блоком «badge + h2 + subtitle».

---

## 2. Компоненты для добавления / расширения

### Фаза 1 — Максимальный эффект при минимуме правок

| # | Компонент | Назначение | API (кратко) | Где заменить |
|---|-----------|------------|--------------|--------------|
| 1 | **PageHeader** | Единый блок «шапки» страницы | `badge?: { label, icon?, color? }, title, description?, actions?` | dashboard, explore, maps, notifications, timeline, map, suggested, settings |
| 2 | **Расширить StickerBadge** | Чтобы везде использовать один компонент | Добавить `rotate?: number` (-1 | 1), опционально иконку/эмодзи в `children` | Все страницы с pill-бейджем (Maps, Timeline, Suggested, Settings, Notifications, TripHeader) |
| 3 | **Расширить Button** | Sticker-кнопки без копипаста классов | Варианты: `stickerGreen`, `stickerCoral` или один `sticker` + проп `stickerColor?: StickerColorKey`; вариант `stickerOutline` (border-2, shadow-sticker-sm, bg-card) | Notifications, Timeline, Documents, Settings, Budget, Dashboard, Profile, trip/explore компоненты |
| 4 | **EmptyStateSticker** (или вариант EmptyState) | Пустые состояния в стиле дизайн-системы | Расширить `EmptyState`: контейнер `border-2 border-dashed border-border rounded-2xl bg-muted/10 shadow-sticker-dashed`, иконка в круге с `shadow-sticker-sm` и опционально getStickerBgClass | Timeline, Documents, Members, ExploreContent, SuggestedPlacesBoard, DayColumn, NewTripCard, trip root |

### Фаза 2 — Карточки и поверхности

| # | Компонент | Назначение | API (кратко) | Где заменить |
|---|-----------|------------|--------------|--------------|
| 5 | **StickerSurface** (или вариант Card) | Базовая поверхность «стикер» без внутренней разметки | `className?, hover?: boolean, children`; базовые классы: `rounded-2xl border-2 border-border shadow-sticker-card`, при `hover` — `hover:-translate-y-px hover:shadow-sticker-card-hover` | SuggestedPlaceCard, PlaceCard, TripDocumentCard, dashboard CouponStatCard/NextTripBoardingPass, budget stat cards, documents file card, members card |
| 6 | **StickerIconButton** (или Button size + variant) | Иконка-кнопка в стиле карточки | `rounded-full border-2 border-border shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card`, опционально `color?: StickerColorKey` для цветных действий | SuggestedPlaceCard, SortableTimelineEvent, TripHeader, DayColumn, TimelineEventList |

### Фаза 3 — Лендинг и мелочи

| # | Компонент | Назначение | API (кратко) | Где заменить |
|---|-----------|------------|--------------|--------------|
| 7 | **SectionHeader** (landing + при необходимости app) | Блок «бейдж + заголовок + подзаголовок» для секций | `badge?: { icon?, label, color? }, title, subtitle?, centered?` | Все секции лендинга (How it works, Features, Testimonials, FAQ и т.д.); при желании — общий с PageHeader через проп `as="h1"|"h2"` |
| 8 | **HeroSticker** (или FloatingSticker) | Декоративный стикер на герое/секции | `color, shape?, shadow?, rotate?, className?, children`; внутри: motion.div + getStickerBgClass + border + shadow + sticker-shape-* | Все hero-стикеры на лендинге (GATE B26, coffee, compass, visa, temperature, Barcelona card и т.д.) |
| 9 | **AuthCard** (опционально) | Центрированная карточка для логина/инвайта | Обёртка с `max-w-md rounded-2xl border-2 border-border shadow-sticker-modal bg-card` | login, invite |
| 10 | **SubSectionTitle** (опционально) | Подзаголовок секции (uppercase, muted) | Один класс: `font-black text-sm uppercase tracking-wider text-muted-foreground mb-2` | Budget «By Category» / «Recent Expenses», Members «Pending Invites» |

---

## 3. Дополнительные правки (без новых компонентов)

- ~~**SortableEventCard**~~ — заменить локальный `typeColors` на `getEventTypeCardClass` / `getEventTypeStickerColor` и использовать StickerBadge или единый EventTypeBadge. **Сделано.**
- ~~**AddToTripModal**~~ — привести DialogContent к общему виду: `border-2 border-border rounded-2xl shadow-sticker-modal`. **Сделано.**
- ~~**Единый стиль модалок**~~ — в гайдлайнах зафиксировать: DialogContent/DrawerContent с `border-2 border-border rounded-2xl shadow-sticker-modal`, заголовок с `border-b-2 border-border pb-3`. **Сделано** (docs/ui-guidelines.md §2.4).
- **EmptyState** — начать импортировать и использовать там, где сейчас только текст без dashed (при необходимости добавить вариант «sticker» с dashed и кружком под иконку).

---

## 4. Порядок внедрения

1. ~~**PageHeader**~~ — один компонент, 8+ страниц станут единообразными. **Сделано.**
2. ~~**StickerBadge**~~ — расширить (rotate, при необходимости иконка) и заменить все инлайн-pill на страницах. **Сделано.**
3. ~~**Button**~~ — добавить варианты stickerGreen, stickerCoral, stickerOutline (и при желании iconSticker); постепенно заменить ручные классы на варианты. **Сделано.**
4. ~~**EmptyStateSticker**~~ — доработать EmptyState или ввести вариант; подключить в timeline, documents, members, explore, SuggestedPlacesBoard, DayColumn, NewTripCard. **Сделано.**
5. ~~**StickerSurface**~~ — ввести и перевести на него карточки в dashboard, budget, documents, members и базовые обёртки в trip/explore карточках. **Сделано.**
6. ~~**StickerIconButton**~~ — вынести в вариант Button или отдельный компонент; заменить повторяющиеся иконки-кнопки. **Сделано.**
7. ~~**SectionHeader**~~ — для лендинга; при желании объединить с PageHeader. **Сделано.**
8. ~~**HeroSticker**~~ — для лендинга, сократить дублирование hero-стикеров. **Сделано.**
9. ~~**AuthCard**~~, ~~**SubSectionTitle**~~ — по необходимости. **Сделано.**

---

## 5. Выполнено (Фаза 1)

- **PageHeader** (`src/components/ui/PageHeader.tsx`) — badge (StickerBadge), title, description, actions; подключён на dashboard, explore, maps, notifications, timeline, map, suggested, settings.
- **StickerBadge** — добавлены `rotate?: number | boolean`, `uppercase?: boolean`; инлайн-pill заменены на Maps, Notifications, Timeline, Map, Suggested, Settings, Dashboard (NextTrip status), TripHeader (status).
- **Button** — варианты `stickerGreen`, `stickerCoral`, `stickerOutline`; замены в notifications, timeline, documents, settings, budget, dashboard, profile, EditEventSheet, SuggestedPlacesBoard, ExploreContent (FAB).
- **EmptyState** — вариант `variant="sticker"`, проп `iconBgColor`; используется в timeline (no events), SuggestedPlacesBoard, ExploreContent, DayColumn, documents, members, trip root (welcome).

**Фаза 2**

- **StickerSurface** (`src/components/ui/StickerSurface.tsx`) — базовая поверхность: `className?`, `hover?`, `hoverStrong?`, `stickerColor?`, `as?: "div"|"button"`. Используется в dashboard (NextTripBoardingPass, CouponStatCard), budget (3 stat cards), documents (file card), members (member card), TripDocumentCard.
- **Button variant="stickerIcon"** — иконка-кнопка в стиле карточки (`h-9 w-9 rounded-full border-2 shadow-sticker-sm hover:shadow-sticker-card`). Замены в TripHeader (2 кнопки), SortableTimelineEvent (3 кнопки), SuggestedPlaceCard (delete button).

**Фаза 3**

- **SectionHeader** (`src/components/landing/SectionHeader.tsx`) — badge (StampBadge), title (h1/h2), subtitle; centered. Используется в секциях лендинга: How it works, Features, Your Dashboard, Timeline View, Explore Places, Testimonials, FAQ.
- **HeroSticker** (`src/components/landing/HeroSticker.tsx`) — color, shape, shadow, rotate, parallax, animate; заменены GATE B26, Coffee, Compass, Weather 34°C, Camera blob. BCN stamp, visa, polaroid, Barcelona/Tokyo cards оставлены с кастомной вёрсткой.
- **AuthCard** (`src/components/ui/AuthCard.tsx`) — обёртка max-w-md rounded-2xl border-2 shadow-sticker-modal; используется на login и invite.
- **SubSectionTitle** (`src/components/ui/SubSectionTitle.tsx`) — класс для подзаголовков секций; используется в budget (By Category, Recent Expenses) и members (Pending Invites).

---

## 6. Ссылки на отчёты

- Детальный аудит app routes: **`docs/app-routes-ui-pattern-audit.md`**
- Аудит trip/explore: отчёт агента 2 (дубликаты кнопок, карточек, бейджей, пустых состояний, модалок).
- Аудит landing + UI: отчёт агента 3 (hero-стикеры, SectionHeader, StickerButton, EmptyState, PageHeader, DecorativeSticker).

После реализации Фазы 1–2 кнопки, карточки, бейджи и пустые состояния не придётся прописывать вручную — достаточно использовать общие компоненты и варианты.
