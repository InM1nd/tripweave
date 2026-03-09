# Design system refactor — единый источник токенов

Все компоненты и страницы должны использовать **один источник** цветов и теней: `src/lib/design-tokens.ts` и `src/lib/colors.ts`. Хардкод `bg-sticker-*`, `shadow-[0_*px_0_*]` и локальные `colorMap` / `eventTypeColors` нужно убирать.

## Источники истины

| Что | Где |
|-----|-----|
| Палитра стикеров (pink, blue, green, …) | `getStickerBgClass(color)` / `STICKER_BG_CLASSES` в `design-tokens.ts` |
| Тени (жёсткий offset, без blur) | Классы `shadow-stickerCard`, `shadow-stickerSm` и т.д. из `tailwind.config.ts`; константы `SHADOW_STICKER_*` в `design-tokens.ts` |
| Тип события (ACTIVITY, TRANSPORT, …) | `getEventTypeStyle(type)`, `getEventTypeCardClass(type)`, `getEventTypeStickerColor(type)` в `design-tokens.ts` |
| Обложка трипа (electric, coral, …) | `getCoverStickerClass(coverColor)` в `colors.ts` |

## Уже переведено на токены

- **tailwind.config.ts** — добавлены тени: `stickerCard`, `stickerCardHover`, `stickerSm`, `stickerSmSoft`, `stickerElevated`, `stickerModal`, `stickerTop`, `stickerDashed`, `stickerBadge`.
- **design-tokens.ts** — экспортирует классы теней и палитру; добавлен `SHADOW_STICKER_BADGE`.
- **colors.ts** — `getCoverStickerClass`, `coverColorToStickerKey`, `COVER_COLOR_TO_STICKER`.
- **Card** — варианты sticker строятся через `getStickerBgClass` и `SHADOW_STICKER_CARD`.
- **Button** — вариант `sticker` через `getStickerBgClass("yellow")` и `SHADOW_STICKER_CARD`.
- **StickerBadge** — `getStickerBgClass` + `SHADOW_STICKER_SM`.
- **TripCard** — `getCoverStickerClass` + `SHADOW_STICKER_CARD` / `SHADOW_STICKER_CARD_HOVER_STRONG`.
- **StatCard** — `getCoverStickerClass`.
- **TripTabs** — `shadow-stickerTop`.
- **SortableTimelineEvent** — `getEventTypeStyle`, тени `SHADOW_*`, цена через `bg-foreground text-background`.
- **SuggestedPlaceCard** — `getEventTypeCardClass(event.type)`.
- **TripDocumentCard / DocumentBadge** — `getStickerBgClass`, `SHADOW_STICKER_CARD`, `SHADOW_STICKER_SM`.
- **Landing StickerCard** — `getStickerCardBgClass` (токены + primary/card), тени из design-tokens.
- **Landing SectionTape** — `getStickerBgClass`, `SHADOW_STICKER_SM_SOFT`.
- **Страницы:** timeline, documents, suggested — бейджи и кнопки через `getStickerBgClass` и `SHADOW_*`.

## Что ещё можно перевести (по отчётам сабагентов)

### App

- **page.tsx** (лендинг) — переведён на токены: тени → shadow-sticker*; bg-sticker-* → getStickerBgClass; данные (stats, trips, events, places) → StickerColorKey.
- **dashboard/page.tsx** — CouponStatCard через getStickerBgClass(StickerColorKey); тени → токены; FAB → getStickerBgClass("coral").
- **notifications/page.tsx** — getStickerBgClass("coral"|"yellow"|"green"), тени → токены.
- **trip/[id]/budget/page.tsx** — карточки через bg-sticker-*/80 + shadow-stickerCard; opacity оставлены.
- **trip/[id]/members/page.tsx** — AvatarFallback через getStickerBgClass("pink"); тени → токены.
- **trip/[id]/map/page.tsx**, **trip/[id]/page.tsx**, **trip/[id]/settings/page.tsx** — тени → shadow-sticker*; кнопка Delete с shadow-[0_3px_0_rgba(220,38,38,0.2)] оставлена (семантика destructive).
- **explore/page.tsx** — destination chip: bg-sticker-yellow/30 (модификатор прозрачности, допустимо).
- **maps/page.tsx** — бейдж и контейнер через getStickerBgClass и shadow-sticker*.
- **profile/page.tsx**, **login/page.tsx**, **settings/page.tsx**, **invite/[token]/page.tsx**, **trip/[id]/timeline/page.tsx** — тени заменены на shadow-stickerCard / shadow-stickerModal / shadow-stickerSm.

### UI

- **progress.tsx** — маппинг `accentColor` на классы через `getCoverStickerClass` (или `StickerColorKey` + `getStickerBgClass`).
- **badge.tsx**, **dropdown-menu.tsx**, **sheet.tsx**, **dialog.tsx**, **tooltip.tsx**, **input.tsx**, **select.tsx**, **textarea.tsx**, **checkbox.tsx**, **tabs.tsx**, **calendar.tsx**, **file-upload.tsx**, **image-upload.tsx**, **drawer.tsx** — заменить `shadow-[0_*px_0_*]` на классы из design-tokens (например `shadow-stickerCard`, `shadow-stickerSmSoft`).

### Trip / Explore

- **TripHeader** — тени → shadow-stickerSm, shadow-stickerCard, shadow-stickerElevated.
- **AddEventModal**, **CreateTripModal**, **AddDocumentModal**, **AddExpenseModal** — DialogContent → shadow-stickerModal.
- **SuggestedPlacesBoard** — getStickerBgClass("yellow"|"coral"), shadow-stickerDashed; bg-sticker-yellow/30 для иконки оставлен.
- **SuggestedPlaceCard** — getEventTypeCardClass; тени shadow-stickerCard, shadow-stickerElevated; кнопки через getStickerBgClass; eventTypeColors удалён.
- **EditEventSheet** — getStickerBgClass("green"), shadow-stickerSm.
- **NewTripCard**, **DayColumn**, **MemberRoleSelect**, **TimelineEventList** — тени → shadow-sticker*.
- **PlaceCard** — getCategoryInfo возвращает colorClass через getStickerBgClass(StickerColorKey); тень shadow-stickerCard/hover.
- **ExploreContent** — getStickerBgClass("blue"|"coral"); тени → shadow-stickerDashed, shadow-stickerCard, shadow-stickerModal, shadow-stickerSmSoft.
- **ForYouRecommendations** — shadow-stickerSmSoft.

### Landing

- **LandingHeader** — тени заменены на shadow-stickerSm, shadow-stickerTop, shadow-stickerBadge, shadow-stickerCard, shadow-stickerCardHover; бейдж TW‑001 через getStickerBgClass("yellow").
- **StickerCard.tsx** — TicketButton тени → shadow-stickerCardHover, shadow-stickerCardHoverStrong, shadow-stickerSmSoft.
- **page.tsx** — все offset-тени и bg-sticker-* переведены на токены и getStickerBgClass; данные с color → StickerColorKey.

При добавлении новых экранов или компонентов сразу использовать `getStickerBgClass`, `getCoverStickerClass`, `getEventTypeStyle` / `getEventTypeCardClass` и константы `SHADOW_STICKER_*`.
