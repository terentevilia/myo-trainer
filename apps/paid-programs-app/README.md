# Paid Programs App

Приложение с четырьмя платными тренировочными программами. Код мио-сетов и публичная обучалка в эту сборку не входят. Если deployment должен быть закрытым, ограничение доступа настраивается отдельно — само приложение по-прежнему не содержит авторизации.

## Запуск

```bash
npm install
npm run import:data
npm run dev
```

Проверка:

```bash
npm run typecheck
npm run build
```

Для Vercel выберите Root Directory: `apps/paid-programs-app`.

Основные данные находятся в `data/programs.json`. Исходные CSV — в `data/source`, повторный импорт выполняется командой `npm run import:data`.
