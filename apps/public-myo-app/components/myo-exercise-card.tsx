"use client";

import { ImageOff, Repeat2 } from "lucide-react";
import { MyoSetLogger } from "@/components/myo-set-logger";
import { RestTimer } from "@/components/rest-timer";
import type { MyoExercise, MyoExerciseLog } from "@/lib/myo-types";

interface MyoExerciseCardProps {
  exercise: MyoExercise;
  log: MyoExerciseLog;
  defaultRestSeconds: number;
  onLogChange: (log: MyoExerciseLog) => void;
}

export function MyoExerciseCard({
  exercise,
  log,
  defaultRestSeconds,
  onLogChange,
}: MyoExerciseCardProps) {
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
          {exercise.videoUrl ? (
            <iframe
              src={exercise.videoUrl}
              title={`Видео упражнения: ${exercise.name}`}
              className="aspect-video w-full border-0"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write"
              allowFullScreen
              loading="lazy"
            />
          ) : exercise.imageUrl ? (
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="aspect-[16/10] w-full object-cover"
            />
          ) : (
            <div className="grid aspect-[16/9] place-items-center px-8 text-center text-white">
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/10 text-acid">
                  <ImageOff aria-hidden="true" size={25} />
                </span>
                <p className="mt-4 text-sm font-black">
                  Изображение упражнения будет добавлено позже
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-black/35">
            Целевые мышцы
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {exercise.targetMuscles.map((muscle) => (
              <span
                className="rounded-full bg-moss/10 px-3 py-1.5 text-xs font-black text-moss"
                key={muscle}
              >
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

      <div className="border-t-2 border-black/5 bg-canvas/50 p-4 sm:p-6">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-moss">
          Отдых и выполнение
        </p>
        <RestTimer defaultSeconds={defaultRestSeconds} />
      </div>

      <div className="border-t border-black/5 bg-canvas/50 p-5 sm:p-6">
        <MyoSetLogger log={log} onChange={onLogChange} />
      </div>
    </article>
  );
}
