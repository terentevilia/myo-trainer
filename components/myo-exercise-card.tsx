"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Dumbbell,
  ExternalLink,
  ImageOff,
  Play,
  Repeat2,
} from "lucide-react";
import { MyoSetLogger } from "@/components/myo-set-logger";
import { RestTimer } from "@/components/rest-timer";
import type { MyoExercise, MyoExerciseLog } from "@/lib/myo-types";

interface MyoExerciseCardProps {
  exercise: MyoExercise;
  log: MyoExerciseLog;
  onLogChange: (log: MyoExerciseLog) => void;
}

export function MyoExerciseCard({ exercise, log, onLogChange }: MyoExerciseCardProps) {
  const protocol = exercise.myoProtocol;

  return (
    <article className="surface-card overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-acid font-black text-ink">
            {String(exercise.order).padStart(2, "0")}
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-moss">
              Выбранное упражнение
            </p>
            <h2 className="mt-1 text-2xl font-black leading-tight tracking-[-0.035em]">
              {exercise.name}
            </h2>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-ink">
          {exercise.imageUrl ? (
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="aspect-[16/10] w-full object-cover"
            />
          ) : (
            <div className="grid aspect-[16/10] place-items-center px-8 text-center text-white">
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/10 text-acid">
                  <ImageOff aria-hidden="true" size={25} />
                </span>
                <p className="mt-4 text-sm font-black">
                  Изображение упражнения будет добавлено позже
                </p>
                <p className="mt-1 text-xs font-medium text-white/40">public/exercises/</p>
              </div>
            </div>
          )}
        </div>

        {exercise.videoUrl ? (
          <a
            href={exercise.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-ink px-4 text-sm font-black text-white transition hover:bg-moss"
          >
            <Play aria-hidden="true" size={17} fill="currentColor" />
            Смотреть видео
            <ExternalLink aria-hidden="true" size={14} />
          </a>
        ) : null}

        <div className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-black/35">
            Целевые мышцы
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {exercise.targetMuscles.map((muscle) => (
              <span className="rounded-full bg-moss/10 px-3 py-1.5 text-xs font-black text-moss" key={muscle}>
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {exercise.alternatives.length ? (
          <div className="mt-5 rounded-2xl bg-canvas p-4">
            <div className="flex items-center gap-2 text-sm font-black">
              <Repeat2 aria-hidden="true" className="text-moss" size={17} />
              Альтернативы
            </div>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-black/55">
              {exercise.alternatives.join(" · ")}
            </p>
          </div>
        ) : null}
      </div>

      <div className="border-t border-black/5 bg-canvas/60 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Dumbbell aria-hidden="true" className="text-moss" size={18} />
          <h3 className="text-lg font-black tracking-tight">Протокол мио-сета</h3>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            ["Активация", protocol.activationSet],
            ["Усилие", protocol.activationRir],
            ["Мини-подходы", protocol.miniSets],
            ["Повторы", protocol.miniSetReps],
            ["Отдых", protocol.restBetweenMiniSets],
          ].map(([label, value]) => (
            <div className="rounded-2xl border border-black/5 bg-white p-3" key={label}>
              <p className="text-[0.65rem] font-black uppercase tracking-wide text-black/35">{label}</p>
              <p className="mt-1 text-sm font-black leading-snug">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-2xl bg-acid/30 p-4 text-sm font-bold leading-relaxed">
          {protocol.stopRule}
        </p>
      </div>

      <div className="grid gap-4 border-t border-black/5 p-5 sm:grid-cols-2 sm:p-6">
        <section>
          <div className="flex items-center gap-2 text-sm font-black text-moss">
            <CheckCircle2 aria-hidden="true" size={18} />
            Технические подсказки
          </div>
          <ul className="mt-3 grid gap-2">
            {exercise.cues.map((cue) => (
              <li className="flex gap-2 text-sm font-semibold leading-relaxed text-black/55" key={cue}>
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-moss" />
                {cue}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <div className="flex items-center gap-2 text-sm font-black text-amber-700">
            <AlertTriangle aria-hidden="true" size={18} />
            Частые ошибки
          </div>
          <ul className="mt-3 grid gap-2">
            {exercise.commonMistakes.map((mistake) => (
              <li className="flex gap-2 text-sm font-semibold leading-relaxed text-black/55" key={mistake}>
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
                {mistake}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="border-t border-black/5 p-4 sm:p-6">
        <RestTimer defaultSeconds={protocol.defaultRestSeconds} />
      </div>

      <div className="border-t border-black/5 bg-canvas/50 p-5 sm:p-6">
        <MyoSetLogger log={log} onChange={onLogChange} />
      </div>
    </article>
  );
}
