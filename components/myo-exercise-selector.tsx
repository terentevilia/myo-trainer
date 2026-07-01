"use client";

import { Check } from "lucide-react";
import type { MyoExercise } from "@/lib/myo-types";

interface MyoExerciseSelectorProps {
  exercises: MyoExercise[];
  selectedExerciseId: string;
  onSelect: (exerciseId: string) => void;
}

export function MyoExerciseSelector({
  exercises,
  selectedExerciseId,
  onSelect,
}: MyoExerciseSelectorProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2">
        {exercises.map((exercise) => {
          const selected = exercise.id === selectedExerciseId;
          return (
            <button
              type="button"
              aria-pressed={selected}
              className={`focus-ring flex min-h-14 max-w-[14rem] items-center gap-3 rounded-2xl border px-3.5 text-left transition ${
                selected
                  ? "border-ink bg-ink text-white shadow-lg"
                  : "border-black/5 bg-white text-ink shadow-card"
              }`}
              key={exercise.id}
              onClick={() => onSelect(exercise.id)}
            >
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-xl text-xs font-black ${
                  selected ? "bg-acid text-ink" : "bg-canvas"
                }`}
              >
                {selected ? <Check aria-hidden="true" size={16} strokeWidth={3} /> : exercise.order}
              </span>
              <span className="text-sm font-black leading-tight">{exercise.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
