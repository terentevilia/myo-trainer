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

Для Vercel выберите Root Directory: `apps/public-myo-app`.

## Контент

- Упражнения и протоколы: `data/myo-training-day.json`.
- Изображения: положите файл в `public/exercises/` и задайте путь вида `/exercises/chest-press.jpg` в `imageUrl`.
- Видео: добавьте внешнюю ссылку в `videoUrl`.
- Данные заполнения живут только до обновления страницы и не сохраняются.
