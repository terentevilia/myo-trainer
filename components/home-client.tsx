"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Brain,
  ChevronRight,
  Dumbbell,
  History,
  Sparkles,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { StatusBadge } from "@/components/status-badge";
import {
  SELECTED_PROGRAM_KEY,
  formatCompletionDate,
  loadProgress,
  workoutKey,
} from "@/lib/storage";
import type { Program, ProgressState, WorkoutStatus } from "@/lib/types";

interface HomeClientProps {
  programs: Program[];
}

export function HomeClient({ programs }: HomeClientProps) {
  const [selectedProgramId, setSelectedProgramId] = useState(programs[0].id);
  const [progress, setProgress] = useState<ProgressState>({
    schemaVersion: 1,
    sessions: {},
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedProgram = window.localStorage.getItem(SELECTED_PROGRAM_KEY);
    const storedProgramExists = programs.some((program) => program.id === storedProgram);

    if (storedProgram && storedProgramExists) {
      setSelectedProgramId(storedProgram);
    }
    setProgress(loadProgress());
    setHydrated(true);
  }, [programs]);

  const selectedProgram =
    programs.find((program) => program.id === selectedProgramId) ?? programs[0];

  const completedCount = useMemo(
    () =>
      selectedProgram.trainingDays.filter(
        (day) =>
          progress.sessions[workoutKey(selectedProgram.id, day.id)]?.status ===
          "completed",
      ).length,
    [progress.sessions, selectedProgram],
  );

  function changeProgram(programId: string) {
    setSelectedProgramId(programId);
    window.localStorage.setItem(SELECTED_PROGRAM_KEY, programId);
  }

  return (
    <>
      <AppHeader
        programs={programs}
        selectedProgramId={selectedProgram.id}
        onProgramChange={changeProgram}
      />

      <main className="page-shell">
        <section className="mb-7">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-moss">
            <Sparkles aria-hidden="true" size={15} />
            Твоя неделя
          </div>
          <h1 className="max-w-lg text-[2.2rem] font-black leading-[1.02] tracking-[-0.045em] text-ink sm:text-5xl">
            Выбери тренировку.
            <br />
            Остальное — по плану.
          </h1>
        </section>

        <section className="surface-card mb-7 overflow-hidden bg-ink p-5 text-white sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
                Прогресс программы
              </p>
              <p className="mt-2 text-xl font-black">
                Выполнено {completedCount} из {selectedProgram.trainingDays.length}
              </p>
            </div>
            <span className="text-3xl font-black text-acid">
              {Math.round((completedCount / selectedProgram.trainingDays.length) * 100)}%
            </span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-acid transition-[width] duration-500"
              style={{
                width: `${(completedCount / selectedProgram.trainingDays.length) * 100}%`,
              }}
            />
          </div>
        </section>

        <Link
          href="/myo-sets"
          className="surface-card focus-ring group mb-7 flex items-center gap-4 overflow-hidden border-moss/10 p-4 transition hover:-translate-y-0.5 hover:border-moss/25 hover:shadow-xl active:scale-[0.99] sm:p-5"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-acid text-ink">
            <Brain aria-hidden="true" size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-black uppercase tracking-[0.12em] text-moss">
              Новая обучалка
            </span>
            <span className="mt-1 block text-lg font-black tracking-tight">Мио-сеты</span>
            <span className="mt-0.5 block text-sm font-medium text-black/45">
              Протокол, таймер и автоматический стоп-сигнал
            </span>
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="shrink-0 text-black/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-moss"
            size={21}
          />
        </Link>

        <section aria-labelledby="training-days-heading">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="training-days-heading" className="text-lg font-black tracking-tight">
              Тренировочные дни
            </h2>
            <span className="text-sm font-semibold text-black/45">
              {selectedProgram.daysPerWeek}× в неделю
            </span>
          </div>

          <div className="grid gap-3">
            {selectedProgram.trainingDays.map((day, index) => {
              const session = progress.sessions[workoutKey(selectedProgram.id, day.id)];
              const status: WorkoutStatus = session?.status ?? "not-started";
              const completedAt = formatCompletionDate(session?.completedAt);

              return (
                <Link
                  className="surface-card focus-ring group block p-5 transition hover:-translate-y-0.5 hover:border-moss/20 hover:shadow-xl active:scale-[0.99]"
                  href={`/workout/${selectedProgram.id}/${day.id}`}
                  key={day.id}
                >
                  <div className="flex items-start gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-acid text-base font-black text-ink">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-black tracking-tight">{day.title}</h3>
                          <p className="mt-1 text-sm font-medium text-black/50">
                            {day.exercises.length} упражнений · отдых {day.defaultRest}
                          </p>
                        </div>
                        <ChevronRight
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-black/25 transition group-hover:translate-x-1 group-hover:text-moss"
                          size={22}
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <StatusBadge status={hydrated ? status : "not-started"} />
                        {hydrated && completedAt ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-black/45">
                            <History aria-hidden="true" size={14} />
                            {completedAt}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-black/35">
          <Dumbbell aria-hidden="true" size={14} />
          Данные сохраняются только на этом устройстве
        </div>
      </main>
    </>
  );
}
