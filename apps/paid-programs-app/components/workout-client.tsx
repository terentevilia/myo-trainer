"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleCheckBig,
  Clock3,
  ExternalLink,
  Flame,
  Info,
  Play,
  Repeat2,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import {
  SELECTED_PROGRAM_KEY,
  emptyProgress,
  emptySetLog,
  emptyWorkoutSession,
  formatCompletionDate,
  loadProgress,
  saveProgress,
  workoutKey,
} from "@/lib/storage";
import type {
  Exercise,
  Program,
  ProgressState,
  SetLog,
  TrainingDay,
  WorkoutSession,
} from "@/lib/types";

interface WorkoutClientProps {
  program: Program;
  day: TrainingDay;
  programs: Program[];
}

type TextSetField = "weight" | "reps" | "rir" | "comment";

export function WorkoutClient({ program, day, programs }: WorkoutClientProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressState>(emptyProgress());
  const [hydrated, setHydrated] = useState(false);
  const sessionKey = workoutKey(program.id, day.id);
  const session = progress.sessions[sessionKey] ?? emptyWorkoutSession();

  useEffect(() => {
    window.localStorage.setItem(SELECTED_PROGRAM_KEY, program.id);
    setProgress(loadProgress());
    setHydrated(true);
  }, [program.id]);

  const totalSets = useMemo(
    () => day.exercises.reduce((sum, exercise) => sum + exercise.workingSets.length, 0),
    [day.exercises],
  );

  const completedSets = useMemo(
    () =>
      day.exercises.reduce(
        (sum, exercise) =>
          sum +
          exercise.workingSets.filter(
            (set) => session.exercises[exercise.id]?.sets[set.id]?.completed,
          ).length,
        0,
      ),
    [day.exercises, session.exercises],
  );

  function changeProgram(programId: string) {
    window.localStorage.setItem(SELECTED_PROGRAM_KEY, programId);
    router.push("/");
  }

  function updateSession(updater: (current: WorkoutSession) => WorkoutSession) {
    setProgress((currentProgress) => {
      const currentSession =
        currentProgress.sessions[sessionKey] ?? emptyWorkoutSession();
      const nextSession = updater(currentSession);
      const nextProgress: ProgressState = {
        ...currentProgress,
        sessions: {
          ...currentProgress.sessions,
          [sessionKey]: nextSession,
        },
      };
      saveProgress(nextProgress);
      return nextProgress;
    });
  }

  function updateSet(
    exerciseId: string,
    setId: string,
    updater: (setLog: SetLog) => SetLog,
  ) {
    updateSession((current) => {
      const exerciseLog = current.exercises[exerciseId] ?? { sets: {} };
      const currentSet = exerciseLog.sets[setId] ?? emptySetLog();

      return {
        ...current,
        status: "in-progress",
        updatedAt: new Date().toISOString(),
        exercises: {
          ...current.exercises,
          [exerciseId]: {
            sets: {
              ...exerciseLog.sets,
              [setId]: updater(currentSet),
            },
          },
        },
      };
    });
  }

  function updateSetField(
    exerciseId: string,
    setId: string,
    field: TextSetField,
    value: string,
  ) {
    updateSet(exerciseId, setId, (setLog) => ({
      ...setLog,
      [field]: value,
    }));
  }

  function toggleExercise(exercise: Exercise, completed: boolean) {
    updateSession((current) => {
      const currentExercise = current.exercises[exercise.id] ?? { sets: {} };
      const nextSets = Object.fromEntries(
        exercise.workingSets.map((set) => [
          set.id,
          {
            ...(currentExercise.sets[set.id] ?? emptySetLog()),
            completed,
          },
        ]),
      );

      return {
        ...current,
        status: "in-progress",
        updatedAt: new Date().toISOString(),
        exercises: {
          ...current.exercises,
          [exercise.id]: { sets: nextSets },
        },
      };
    });
  }

  function completeWorkout() {
    const now = new Date().toISOString();
    const currentSession = progress.sessions[sessionKey] ?? emptyWorkoutSession();
    const nextProgress: ProgressState = {
      ...progress,
      sessions: {
        ...progress.sessions,
        [sessionKey]: {
          ...currentSession,
          status: "completed",
          completedAt: now,
          updatedAt: now,
        },
      },
    };

    saveProgress(nextProgress);
    setProgress(nextProgress);
    router.push("/");
  }

  const completionDate = formatCompletionDate(session.completedAt);

  return (
    <>
      <AppHeader
        programs={programs}
        selectedProgramId={program.id}
        onProgramChange={changeProgram}
      />

      <main className="page-shell !pb-36">
        <Link
          href="/"
          className="focus-ring mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-extrabold text-black/55 transition hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" size={19} />
          К тренировочным дням
        </Link>

        <section className="mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-acid px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em]">
              {program.shortTitle}
            </span>
            {hydrated && session.status === "completed" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-moss/10 px-3 py-1.5 text-xs font-black text-moss">
                <CircleCheckBig aria-hidden="true" size={15} />
                Завершено
              </span>
            ) : null}
          </div>
          <h1 className="text-[2.45rem] font-black leading-none tracking-[-0.05em] sm:text-5xl">
            {day.title}
          </h1>
          <p className="mt-3 max-w-lg text-base font-medium leading-relaxed text-black/55">
            {day.exercises.length} упражнений · {totalSets} рабочих подходов · отдых {day.defaultRest}
          </p>
          {hydrated && completionDate ? (
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-moss">
              <CircleCheckBig aria-hidden="true" size={17} />
              Последний раз: {completionDate}
            </p>
          ) : null}
        </section>

        <section className="surface-card mb-5 bg-ink p-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-white/45">
                Подходы
              </p>
              <p className="mt-1 text-lg font-black">
                {completedSets} из {totalSets} отмечено
              </p>
            </div>
            <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-acid">
              <Flame aria-hidden="true" size={22} />
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-acid transition-[width] duration-300"
              style={{ width: `${totalSets ? (completedSets / totalSets) * 100 : 0}%` }}
            />
          </div>
        </section>

        <section aria-label="Упражнения" className="grid gap-4">
          {day.exercises.map((exercise, exerciseIndex) => {
            const exerciseLog = session.exercises[exercise.id];
            const exerciseCompleted = exercise.workingSets.every(
              (set) => exerciseLog?.sets[set.id]?.completed,
            );
            const reps = [...new Set(exercise.workingSets.map((set) => set.reps))].join(" / ");
            const targetRir = [
              ...new Set(
                exercise.workingSets
                  .map((set) => set.rir)
                  .filter((value): value is string => Boolean(value)),
              ),
            ].join(" / ");

            return (
              <article className="surface-card overflow-hidden" key={exercise.id}>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      aria-label={
                        exerciseCompleted
                          ? `Снять отметку с упражнения ${exercise.name}`
                          : `Отметить упражнение ${exercise.name}`
                      }
                      aria-pressed={exerciseCompleted}
                      className={`focus-ring mt-0.5 grid size-10 shrink-0 place-items-center rounded-2xl border-2 transition ${
                        exerciseCompleted
                          ? "border-moss bg-moss text-white"
                          : "border-black/10 bg-canvas text-transparent hover:border-moss/40"
                      }`}
                      onClick={() => toggleExercise(exercise, !exerciseCompleted)}
                    >
                      <Check aria-hidden="true" size={20} strokeWidth={3} />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-black/35">
                            Упражнение {exerciseIndex + 1}
                          </p>
                          <h2 className="mt-1 text-xl font-black leading-tight tracking-[-0.025em]">
                            {exercise.name}
                          </h2>
                        </div>
                        {exercise.isOptional ? (
                          <span className="shrink-0 rounded-full bg-black/5 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-wide text-black/45">
                            Опционально
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-extrabold">
                        <span className="rounded-lg bg-canvas px-2.5 py-2">
                          {exercise.workingSets.length} × {reps}
                        </span>
                        {exercise.warmupSets ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-canvas px-2.5 py-2">
                            <Repeat2 aria-hidden="true" size={14} />
                            Разминка {exercise.warmupSets}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-canvas px-2.5 py-2">
                          <Clock3 aria-hidden="true" size={14} />
                          {exercise.rest}
                        </span>
                        {targetRir ? (
                          <span className="rounded-lg bg-canvas px-2.5 py-2">RIR {targetRir}</span>
                        ) : null}
                        {exercise.tempo ? (
                          <span className="rounded-lg bg-canvas px-2.5 py-2">Темп {exercise.tempo}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {exercise.coachComment || exercise.note ? (
                    <div className="mt-4 flex gap-3 rounded-2xl bg-acid/30 p-4 text-sm font-semibold leading-relaxed">
                      <Info aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
                      <p>{exercise.coachComment ?? exercise.note}</p>
                    </div>
                  ) : null}

                  {exercise.videoUrl ? (
                    <a
                      href={exercise.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-black text-white"
                    >
                      <Play aria-hidden="true" size={16} fill="currentColor" />
                      Открыть видео
                      <ExternalLink aria-hidden="true" size={14} />
                    </a>
                  ) : null}
                </div>

                <div className="border-t border-black/5 bg-canvas/60 px-4 py-5 sm:px-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-black">Запиши подходы</h3>
                    <span className="text-xs font-bold text-black/40">Вес · Повторы · RIR</span>
                  </div>

                  <div className="grid gap-3">
                    {exercise.workingSets.map((target, setIndex) => {
                      const setLog = exerciseLog?.sets[target.id] ?? emptySetLog();
                      const baseId = `${exercise.id}-${target.id}`;

                      return (
                        <div className="rounded-2xl border border-black/5 bg-white p-3" key={target.id}>
                          <div className="grid grid-cols-[2.75rem_1fr_1fr_0.78fr] items-end gap-2">
                            <label className="grid min-h-11 cursor-pointer place-items-center" htmlFor={`${baseId}-done`}>
                              <span
                                className={`grid size-9 place-items-center rounded-xl border-2 transition ${
                                  setLog.completed
                                    ? "border-moss bg-moss text-white"
                                    : "border-black/10 text-transparent"
                                }`}
                              >
                                <Check aria-hidden="true" size={17} strokeWidth={3} />
                              </span>
                              <input
                                id={`${baseId}-done`}
                                type="checkbox"
                                className="sr-only"
                                checked={setLog.completed}
                                onChange={(event) =>
                                  updateSet(exercise.id, target.id, (current) => ({
                                    ...current,
                                    completed: event.target.checked,
                                  }))
                                }
                              />
                            </label>

                            <label className="block" htmlFor={`${baseId}-weight`}>
                              <span className="mb-1 block text-[0.65rem] font-black uppercase tracking-wide text-black/40">
                                Вес, кг
                              </span>
                              <input
                                id={`${baseId}-weight`}
                                className="field"
                                inputMode="decimal"
                                placeholder="—"
                                value={setLog.weight}
                                onChange={(event) =>
                                  updateSetField(
                                    exercise.id,
                                    target.id,
                                    "weight",
                                    event.target.value,
                                  )
                                }
                              />
                            </label>

                            <label className="block" htmlFor={`${baseId}-reps`}>
                              <span className="mb-1 block text-[0.65rem] font-black uppercase tracking-wide text-black/40">
                                Повторы
                              </span>
                              <input
                                id={`${baseId}-reps`}
                                className="field"
                                inputMode="numeric"
                                placeholder={target.reps}
                                value={setLog.reps}
                                onChange={(event) =>
                                  updateSetField(
                                    exercise.id,
                                    target.id,
                                    "reps",
                                    event.target.value,
                                  )
                                }
                              />
                            </label>

                            <label className="block" htmlFor={`${baseId}-rir`}>
                              <span className="mb-1 block text-[0.65rem] font-black uppercase tracking-wide text-black/40">
                                RIR
                              </span>
                              <input
                                id={`${baseId}-rir`}
                                className="field"
                                inputMode="numeric"
                                placeholder={target.rir ?? "—"}
                                value={setLog.rir}
                                onChange={(event) =>
                                  updateSetField(
                                    exercise.id,
                                    target.id,
                                    "rir",
                                    event.target.value,
                                  )
                                }
                              />
                            </label>
                          </div>

                          <label className="mt-2 block" htmlFor={`${baseId}-comment`}>
                            <span className="sr-only">Комментарий к подходу {setIndex + 1}</span>
                            <input
                              id={`${baseId}-comment`}
                              className="field"
                              placeholder={`Комментарий к подходу ${setIndex + 1}`}
                              value={setLog.comment}
                              onChange={(event) =>
                                updateSetField(
                                  exercise.id,
                                  target.id,
                                  "comment",
                                  event.target.value,
                                )
                              }
                            />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {exercise.alternatives.length ? (
                  <details className="group border-t border-black/5 bg-white">
                    <summary className="focus-ring flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 text-sm font-black [&::-webkit-details-marker]:hidden">
                      Чем заменить
                      <ChevronDown
                        aria-hidden="true"
                        className="transition group-open:rotate-180"
                        size={18}
                      />
                    </summary>
                    <ul className="grid gap-2 px-5 pb-5 text-sm font-semibold leading-relaxed text-black/55">
                      {exercise.alternatives.map((alternative) => (
                        <li className="flex gap-2" key={alternative}>
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-moss" />
                          {alternative}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </article>
            );
          })}
        </section>

        <section className="surface-card mt-4 p-5">
          <label className="block" htmlFor="workout-note">
            <span className="text-sm font-black">Комментарий к тренировке</span>
            <span className="mt-1 block text-xs font-medium text-black/45">
              Самочувствие, техника или важное наблюдение
            </span>
            <textarea
              id="workout-note"
              className="field mt-3 min-h-28 resize-y py-3 font-medium"
              placeholder="Как прошла тренировка?"
              value={session.workoutNote}
              onChange={(event) =>
                updateSession((current) => ({
                  ...current,
                  status: "in-progress",
                  workoutNote: event.target.value,
                  updatedAt: new Date().toISOString(),
                }))
              }
            />
          </label>
        </section>
      </main>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-canvas/95 px-4 pt-3 backdrop-blur-xl"
        style={{ paddingBottom: "calc(0.75rem + var(--safe-bottom))" }}
      >
        <button
          type="button"
          className="focus-ring mx-auto flex min-h-14 w-full max-w-2xl items-center justify-center gap-2 rounded-2xl bg-ink px-5 text-base font-black text-white shadow-2xl transition hover:bg-moss active:scale-[0.99]"
          onClick={completeWorkout}
        >
          <CircleCheckBig aria-hidden="true" size={21} />
          Завершить тренировку
        </button>
      </div>
    </>
  );
}
