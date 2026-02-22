# Feature-Sliced Design (FSD)

Структура проекта следует методологии [Feature-Sliced Design](https://feature-sliced.design/).

## Слои (сверху вниз)

| Папка        | Слой      | Назначение |
|-------------|-----------|------------|
| `src/1_app` | app       | Инициализация приложения, провайдеры, роутинг |
| `src/2_pages` | pages   | Страницы/экраны приложения |
| `src/3_widgets` | widgets | Составные UI-блоки для страниц |
| `src/4_features` | features | Действия пользователя и сценарии |
| `src/5_entities` | entities | Бизнес-сущности (состояние, типы) |
| `src/6_shared` | shared   | UI-кит, API, конфиг, тема |

## Алиасы путей (tsconfig)

- `@app/*` → `src/1_app/*`
- `@pages/*` → `src/2_pages/*`
- `@widgets/*` → `src/3_widgets/*`
- `@features/*` → `src/4_features/*`
- `@entities/*` → `src/5_entities/*`
- `@shared/*` → `src/6_shared/*`

## Правила импортов

- Слой может импортировать только из слоёв **ниже** (например, `pages` — из `widgets`, `features`, `entities`, `shared`).
- **shared** не импортирует из `entities` или выше.
- Типы навигации и общая тема (без привязки к store) лежат в **shared**; провайдер темы, завязанный на настройки, — в **app** (`AppThemeProvider`).
