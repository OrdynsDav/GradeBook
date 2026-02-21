# GradeBook - Электронный журнал

Мобильное приложение электронного журнала на React Native (Expo).

## Требования

- Node.js 18+
- npm или yarn
- Expo CLI
- iOS Simulator (Mac) или Android Emulator / физическое устройство

## Установка

```bash
cd GradeBookApp
npm install
```

## Запуск

```bash
# Запуск в режиме разработки
npx expo start

# Запуск на Android
npx expo start --android

# Запуск на iOS
npx expo start --ios

# Запуск в веб-браузере
npx expo start --web
```

## Структура проекта (Feature-Sliced Design)

```
src/
├── app/                  # Инициализация, провайдеры, навигация
├── pages/                # Экраны приложения
├── widgets/              # Композитные UI блоки
├── features/             # Фичи (действия пользователя)
├── entities/             # Бизнес-сущности
├── shared/               # Переиспользуемый код
│   ├── config/           # Тема, константы
│   ├── lib/              # Утилиты, хуки
│   └── ui/               # UI Kit компоненты
└── assets/               # Статические файлы
```

## Экраны

- **Login** - Экран авторизации
- **Dashboard** - Главная с обзором оценок и расписания
- **Grades** - Список предметов с оценками
- **Subject Detail** - Детальный просмотр оценок по предмету
- **Schedule** - Расписание на неделю
- **Profile** - Профиль пользователя
- **Notifications** - Уведомления

## Технологии

- React Native + Expo SDK 54
- TypeScript
- React Navigation 6
- Zustand (state management)
- React Hook Form + Zod (формы)
- Expo Vector Icons

## Цветовая схема

- Primary: `#800020` (Бордовый)
- Secondary: `#D4AF37` (Золотой)
- Background: `#FAFAFA`
