# Public мио App

Публичный тренажёр мио-подходов. Не содержит `programs.json`, платных программ, выбора программы или маршрутов обычных тренировок.

Тренажёр доступен на `/` и `/myo-sets`.

## Запуск

```bash
npm install
npm run dev
```

Проверка:

```bash
npm run typecheck
npm run build
```

## Деплой на Vercel

Создайте отдельный Vercel Project со следующими настройками:

- Framework Preset: `Next.js`;
- Root Directory: `apps/public-myo-app`;
- Install Command: `npm install`;
- Build Command: `npm run build`;
- Output Directory: значение по умолчанию Next.js, override должен быть выключен;
- Node.js: `22.x`.

Приложению не нужны `vercel.json`, `output: "standalone"`, `output: "export"` или ручной `distDir`. Vercel сам собирает и публикует каталог `.next` относительно Root Directory. `outputFileTracingRoot` привязан к папке самого приложения, а не к переменному `process.cwd()`, чтобы Vercel не искал артефакты в корне монорепозитория.

Сборка использует поддерживаемый флаг `--webpack`, чтобы корневой `package-lock.json` монорепозитория не влиял на автоматическое определение Turbopack root.

## Контент

- Упражнения и протоколы: `data/myo-training-day.json`.
- Изображения: положите файл в `public/exercises/` и задайте путь вида `/exercises/chest-press.jpg` в `imageUrl`.
- Видео: добавьте внешнюю ссылку в `videoUrl`.
- Данные заполнения живут только до обновления страницы и не сохраняются.
