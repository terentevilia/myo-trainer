"use client";

import { useMemo, useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Dumbbell,
  ExternalLink,
  Film,
  Info,
} from "lucide-react";
import { MyoExerciseCard } from "@/components/myo-exercise-card";
import { MyoExerciseSelector } from "@/components/myo-exercise-selector";
import {
  createMyoExerciseLog,
  createMyoStorageState,
  normalizeMyoExerciseLog,
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
  "Не снижая вес, сделай мини-подход на 3–5 повторений.",
  "Повторяй мио-подходы, пока вес или повторы не начнут снижаться.",
  "Если вес снижен или повторы упали хотя бы на 1 относительно первого мио-подхода — остановись.",
  "Оптимальное количество мио-подходов, не считая активационный, — 5.",
  "Если к пятому подходу производительность не ухудшается и повторы не снижаются, исходный вес, скорее всего, мал.",
];

const stopReasons = [
  "если пришлось снизить вес",
  "если повторы начали падать",
  "если техника начала заметно ухудшаться",
  "если целевая мышца уже не работает нормально",
];

function StepikMark() {
  return (
    <img
      src="/brand/stepik.png"
      alt="Stepik"
      className="size-12 shrink-0 rounded-2xl object-cover"
    />
  );
}

function TelegramMark() {
  return (
    <img
      src="/brand/telegram.png"
      alt="Telegram"
      className="size-12 shrink-0 rounded-full object-cover"
    />
  );
}

function TFitLogo({ className }: { className: string }) {
  return (
    <span className={`relative block overflow-hidden rounded-2xl bg-[#324994] ${className}`}>
      <img
        src="/brand/tfit.png"
        alt="TFit"
        className="absolute inset-0 size-full object-cover object-center"
      />
    </span>
  );
}

export function MyoSetsClient({ trainingDay }: { trainingDay: MyoTrainingDay }) {
  const exercises = useMemo(
    () => [...trainingDay.exercises].sort((a, b) => a.order - b.order),
    [trainingDay.exercises],
  );
  const defaultExerciseId = exercises[0]?.id ?? "";
  const [storage, setStorage] = useState<MyoStorageState>(() =>
    createMyoStorageState(defaultExerciseId),
  );

  const selectedExercise =
    exercises.find((exercise) => exercise.id === storage.selectedExerciseId) ?? exercises[0];
  const selectedLog = selectedExercise
    ? storage.exerciseLogs[selectedExercise.id] ?? createMyoExerciseLog()
    : createMyoExerciseLog();

  function selectExercise(exerciseId: string) {
    setStorage((current) => ({
      ...current,
      selectedExerciseId: exerciseId,
    }));
  }

  function updateExerciseLog(log: MyoExerciseLog) {
    if (!selectedExercise) return;
    const normalizedLog = normalizeMyoExerciseLog(log);
    setStorage((current) => ({
      ...current,
      exerciseLogs: {
        ...current.exerciseLogs,
        [selectedExercise.id]: normalizedLog,
      },
    }));
  }

  if (!selectedExercise) return null;

  const protocol = trainingDay.myoProtocol;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/95 text-white backdrop-blur-xl"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div className="mx-auto flex h-[5.75rem] max-w-2xl items-center gap-3 px-4">
          <a
            href="https://terentevfit.ru/"
            target="_blank"
            rel="noreferrer"
            aria-label="Перейти на сайт Terentev Fit"
            className="focus-ring shrink-0 rounded-2xl"
          >
            <TFitLogo className="size-11" />
          </a>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.15em] text-acid">
              Тренажер
            </p>
            <p className="truncate text-base font-black">мио-подходов</p>
          </div>
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
            Мио-подходы — это метод, где сначала выполняется активационный подход, затем короткий отдых и серия мини-подходов. Цель — набрать качественные повторения без лишнего объема.
          </p>
        </section>

        <section className="surface-card mt-6 p-5 sm:p-6" aria-labelledby="how-to-mio-title">
          <div className="flex items-center gap-2">
            <Dumbbell aria-hidden="true" className="text-moss" size={19} />
            <h2 id="how-to-mio-title" className="text-xl font-black tracking-tight">
              Как выполнять мио-подходы
            </h2>
          </div>
          <ol className="mt-5 grid gap-3">
            {howToSteps.map((step, index) => (
              <li
                className="flex gap-3 text-sm font-semibold leading-relaxed text-black/60"
                key={step}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-acid text-xs font-black text-ink">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="surface-card mt-4 overflow-hidden p-5 sm:p-6" aria-labelledby="demo-title">
          <div className="flex items-center gap-2">
            <Film aria-hidden="true" className="text-moss" size={19} />
            <h2 id="demo-title" className="text-xl font-black tracking-tight">
              Демонстрация выполнения
            </h2>
          </div>
          {trainingDay.demoVideoUrl ? (
            <div className="mt-4 aspect-video overflow-hidden rounded-2xl bg-ink">
              <iframe
                src={trainingDay.demoVideoUrl}
                title="Демонстрация выполнения мио-подходов"
                className="size-full border-0"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <div className="mt-4 grid min-h-44 place-items-center rounded-2xl border-2 border-dashed border-moss/20 bg-moss/5 p-6 text-center">
              <div>
                <Film aria-hidden="true" className="mx-auto text-moss" size={30} />
                <p className="mt-3 text-sm font-black">Видео демонстрации будет добавлено позже</p>
                <p className="mt-1 text-xs font-semibold text-black/40">
                  Укажите embed-ссылку в demoVideoUrl
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="surface-card mt-4 overflow-hidden" aria-labelledby="common-protocol-title">
          <div className="bg-ink p-5 text-white sm:p-6">
            <div className="flex items-center gap-2">
              <Info aria-hidden="true" className="text-acid" size={19} />
              <h2 id="common-protocol-title" className="text-xl font-black tracking-tight">
                Общий протокол мио-подходов
              </h2>
            </div>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-white/55">
              Эти правила одинаковы для всех упражнений ниже.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                ["Активация", protocol.activationSet],
                ["Усилие", protocol.activationRir],
                ["Мио-подходы", protocol.miniSets],
                ["Повторы", protocol.miniSetReps],
                ["Отдых", protocol.restBetweenMiniSets],
              ].map(([label, value]) => (
                <div className="rounded-2xl bg-white/10 p-3" key={label}>
                  <p className="text-[0.65rem] font-black uppercase tracking-wide text-white/40">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-black leading-snug">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-2xl bg-acid p-4 text-sm font-black leading-relaxed text-ink">
              {protocol.stopRule}
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-black text-moss">
                <CheckCircle2 aria-hidden="true" size={18} />
                Технические подсказки
              </div>
              <ul className="mt-3 grid gap-2">
                {trainingDay.cues.map((cue) => (
                  <li
                    className="flex gap-2 text-sm font-semibold leading-relaxed text-black/55"
                    key={cue}
                  >
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-moss" />
                    {cue}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-black text-amber-700">
                <AlertTriangle aria-hidden="true" size={18} />
                Частые ошибки
              </div>
              <ul className="mt-3 grid gap-2">
                {trainingDay.commonMistakes.map((mistake) => (
                  <li
                    className="flex gap-2 text-sm font-semibold leading-relaxed text-black/55"
                    key={mistake}
                  >
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-5 border-t border-black/5 bg-canvas/60 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-black text-moss">
                <Check aria-hidden="true" size={18} strokeWidth={3} />
                Когда остановиться
              </div>
              <ul className="mt-3 grid gap-2">
                {stopReasons.map((reason) => (
                  <li className="flex gap-2 text-sm font-semibold text-black/55" key={reason}>
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-moss" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertOctagon aria-hidden="true" size={18} />
                <h3 className="text-base font-black">Частая ошибка</h3>
              </div>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-amber-950/70">
                Не продолжай мио-подходы после снижения веса или повторений. Это уже лишний объем.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-9 border-t-2 border-ink/10 pt-8" aria-labelledby="mio-exercises-title">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-moss">
              Практическая часть
            </p>
            <h2 id="mio-exercises-title" className="mt-1 text-2xl font-black tracking-tight">
              Выбери упражнение
            </h2>
            <p className="mt-1 text-sm font-semibold text-black/45">
              Выполни упражнение, используй таймер и заполни пять мио-подходов.
            </p>
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
            defaultRestSeconds={protocol.defaultRestSeconds}
            onLogChange={updateExerciseLog}
          />
        </div>

        <p className="mt-8 text-center text-xs font-bold text-black/35">
          Данные этой тренировки не сохраняются
        </p>

        <div className="mt-5 grid gap-3">
          <a
            href="https://t.me/+ji8_oA5DdCY3NDMy"
            target="_blank"
            rel="noreferrer"
            className="focus-ring group flex min-h-24 items-center gap-4 rounded-[1.75rem] border border-black/5 bg-white p-5 font-black shadow-card transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <TelegramMark />
            <span className="flex-1 text-center text-sm sm:text-base">
              Подписывайся на ТЕРЕНТЬЕВ ФИТНЕС
            </span>
            <ExternalLink aria-hidden="true" className="shrink-0 text-black/25 transition group-hover:text-[#229ED9]" size={18} />
          </a>
          <a
            href="https://stepik.org/a/278327"
            target="_blank"
            rel="noreferrer"
            className="focus-ring group flex min-h-24 items-center gap-4 rounded-[1.75rem] border border-black/5 bg-white p-5 font-black shadow-card transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <StepikMark />
            <span className="flex-1 text-center text-sm sm:text-base">
              Ознакомиться с Общеразвивающей программой
              <br />
              <span className="whitespace-nowrap">на Степике</span>
            </span>
            <ExternalLink aria-hidden="true" className="shrink-0 text-black/25 transition group-hover:text-moss" size={18} />
          </a>
          <a
            href="https://stepik.org/a/287561"
            target="_blank"
            rel="noreferrer"
            className="focus-ring group flex min-h-24 items-center gap-4 rounded-[1.75rem] border border-black/5 bg-white p-5 font-black shadow-card transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <StepikMark />
            <span className="flex-1 text-center text-sm sm:text-base">
              Ознакомиться с Путеводителем по силовым «Это База» на Степике
            </span>
            <ExternalLink aria-hidden="true" className="shrink-0 text-black/25 transition group-hover:text-moss" size={18} />
          </a>
        </div>
      </main>
    </>
  );
}
