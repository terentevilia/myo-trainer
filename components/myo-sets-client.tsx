"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertOctagon,
  ArrowLeft,
  BookOpenCheck,
  Brain,
  Check,
  Dumbbell,
  Info,
} from "lucide-react";
import { MyoExerciseCard } from "@/components/myo-exercise-card";
import { MyoExerciseSelector } from "@/components/myo-exercise-selector";
import {
  createMyoExerciseLog,
  createMyoStorageState,
  loadMyoStorage,
  normalizeMyoExerciseLog,
  saveMyoStorage,
} from "@/lib/myo-storage";
import type {
  MyoExerciseLog,
  MyoStorageState,
  MyoTrainingDay,
} from "@/lib/myo-types";

const howToSteps = [
  "Выполни активационный подход на 12–20 повторений.",
  "Остановись примерно за 1–2 повтора до отказа.",
  "Отдохни 15–30 секунд.",
  "Сделай мини-подход на 3–5 повторений.",
  "Повтори мини-подходы, пока повторы не начнут падать.",
  "Если повторы упали хотя бы на 1 относительно первого мини-подхода — остановись.",
  "Оптимальное количество мио-подходов, не считая активационный, — 5.",
  "Если к пятому подходу производительность не ухудшается и повторы не снижаются, исходный вес, скорее всего, мал.",
];

const stopReasons = [
  "если повторы начали падать",
  "если техника начала заметно ухудшаться",
  "если целевая мышца уже не работает нормально",
  "если мини-подходы превращаются в добивку любой ценой",
];

export function MyoSetsClient({ trainingDay }: { trainingDay: MyoTrainingDay }) {
  const exercises = useMemo(
    () => [...trainingDay.exercises].sort((a, b) => a.order - b.order),
    [trainingDay.exercises],
  );
  const defaultExerciseId = exercises[0]?.id ?? "";
  const [storage, setStorage] = useState<MyoStorageState>(() =>
    createMyoStorageState(defaultExerciseId),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadMyoStorage(defaultExerciseId);
    const selectedExists = exercises.some(
      (exercise) => exercise.id === loaded.selectedExerciseId,
    );
    setStorage({
      ...loaded,
      selectedExerciseId: selectedExists ? loaded.selectedExerciseId : defaultExerciseId,
    });
    setHydrated(true);
  }, [defaultExerciseId, exercises]);

  const selectedExercise =
    exercises.find((exercise) => exercise.id === storage.selectedExerciseId) ?? exercises[0];
  const selectedLog = selectedExercise
    ? storage.exerciseLogs[selectedExercise.id] ?? createMyoExerciseLog()
    : createMyoExerciseLog();

  function persist(nextState: MyoStorageState) {
    setStorage(nextState);
    saveMyoStorage(nextState);
  }

  function selectExercise(exerciseId: string) {
    persist({
      ...storage,
      selectedExerciseId: exerciseId,
    });
  }

  function updateExerciseLog(log: MyoExerciseLog) {
    if (!selectedExercise) return;
    const normalizedLog = normalizeMyoExerciseLog(log);
    persist({
      ...storage,
      exerciseLogs: {
        ...storage.exerciseLogs,
        [selectedExercise.id]: normalizedLog,
      },
    });
  }

  if (!selectedExercise) return null;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/95 text-white backdrop-blur-xl"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div className="mx-auto flex h-[5.75rem] max-w-2xl items-center gap-3 px-4">
          <Link
            href="/"
            aria-label="Вернуться на главную"
            className="focus-ring grid size-11 shrink-0 place-items-center rounded-2xl bg-white/10 transition hover:bg-white/15"
          >
            <ArrowLeft aria-hidden="true" size={20} />
          </Link>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.15em] text-acid">
              Обучалка
            </p>
            <p className="truncate text-base font-black">Мио-сеты</p>
          </div>
          <span className="ml-auto grid size-10 place-items-center rounded-2xl bg-acid text-ink">
            <Brain aria-hidden="true" size={21} />
          </span>
        </div>
      </header>

      <main className="page-shell">
        <section>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-moss/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-moss">
            <BookOpenCheck aria-hidden="true" size={15} />
            Практика с подсказками
          </div>
          <h1 className="max-w-xl text-[2.35rem] font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl">
            {trainingDay.title}
          </h1>
          <p className="mt-4 max-w-xl text-base font-semibold leading-relaxed text-black/55">
            Мио-сет — это метод, где сначала выполняется активационный подход, затем короткий отдых и серия мини-подходов. Цель — набрать эффективные повторения без лишнего объема.
          </p>
        </section>

        <section className="surface-card mt-6 overflow-hidden bg-ink p-5 text-white sm:p-6">
          <div className="flex items-center gap-2">
            <Info aria-hidden="true" className="text-acid" size={19} />
            <h2 className="text-base font-black">Главные правила</h2>
          </div>
          <ol className="mt-4 grid gap-3">
            {trainingDay.generalRules.map((rule, index) => (
              <li className="flex gap-3 text-sm font-semibold leading-relaxed text-white/70" key={rule}>
                <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-white/10 text-[0.7rem] font-black text-acid">
                  {index + 1}
                </span>
                {rule}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8" aria-labelledby="myo-exercises-title">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-moss">По порядку</p>
              <h2 id="myo-exercises-title" className="mt-1 text-xl font-black tracking-tight">
                Выбери упражнение
              </h2>
            </div>
            <span className="text-xs font-bold text-black/40">
              {hydrated ? "Прогресс сохранён" : "Загрузка…"}
            </span>
          </div>
          <MyoExerciseSelector
            exercises={exercises}
            selectedExerciseId={selectedExercise.id}
            onSelect={selectExercise}
          />
        </section>

        <div className="mt-4">
          <MyoExerciseCard
            exercise={selectedExercise}
            key={selectedExercise.id}
            log={selectedLog}
            onLogChange={updateExerciseLog}
          />
        </div>

        <section className="surface-card mt-6 p-5 sm:p-6" aria-labelledby="how-to-myo-title">
          <div className="flex items-center gap-2">
            <Dumbbell aria-hidden="true" className="text-moss" size={19} />
            <h2 id="how-to-myo-title" className="text-xl font-black tracking-tight">
              Как выполнять мио-сет
            </h2>
          </div>
          <ol className="mt-5 grid gap-3">
            {howToSteps.map((step, index) => (
              <li className="flex gap-3 text-sm font-semibold leading-relaxed text-black/60" key={step}>
                <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-acid text-xs font-black text-ink">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 text-moss">
              <Check aria-hidden="true" size={18} strokeWidth={3} />
              <h2 className="text-base font-black">Когда остановиться</h2>
            </div>
            <ul className="mt-4 grid gap-2.5">
              {stopReasons.map((reason) => (
                <li className="flex gap-2 text-sm font-semibold leading-relaxed text-black/55" key={reason}>
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-moss" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 shadow-card">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertOctagon aria-hidden="true" size={18} />
              <h2 className="text-base font-black">Частая ошибка</h2>
            </div>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-amber-950/70">
              Главная ошибка — продолжать мини-подходы после падения повторений. В обучающей версии приложение специально блокирует дальнейшие подходы, чтобы не превращать мио-сет в лишний объем.
            </p>
          </div>
        </section>

        <p className="mt-8 text-center text-xs font-bold text-black/35">
          Данные мио-сетов хранятся отдельно от обычных тренировок
        </p>
      </main>
    </>
  );
}
