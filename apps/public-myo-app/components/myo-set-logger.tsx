"use client";

import { Lock, Sparkles } from "lucide-react";
import { MyoStopSignal } from "@/components/myo-stop-signal";
import type {
  MyoActivationSetLog,
  MyoExerciseLog,
} from "@/lib/myo-types";

interface MyoSetLoggerProps {
  log: MyoExerciseLog;
  onChange: (log: MyoExerciseLog) => void;
}

type ActivationField = keyof MyoActivationSetLog;

export function MyoSetLogger({ log, onChange }: MyoSetLoggerProps) {
  const stoppedIndex = log.stopState.stoppedAtMiniSetId
    ? log.miniSets.findIndex((miniSet) => miniSet.id === log.stopState.stoppedAtMiniSetId)
    : -1;
  const blocksFollowingSets =
    log.stopState.status === "stopped" && !log.stopState.stopOverride;

  function updateActivation(field: ActivationField, value: string) {
    onChange({
      ...log,
      activationSet: {
        ...log.activationSet,
        [field]: value,
      },
    });
  }

  function updateMiniSet(id: string, value: string) {
    onChange({
      ...log,
      miniSets: log.miniSets.map((miniSet) =>
        miniSet.id === id ? { ...miniSet, reps: value } : miniSet,
      ),
    });
  }

  function overrideStop() {
    onChange({
      ...log,
      stopState: {
        ...log.stopState,
        stopOverride: true,
      },
    });
  }

  return (
    <section aria-labelledby="myo-logger-title" className="grid gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden="true" className="text-moss" size={18} />
          <h3 id="myo-logger-title" className="text-lg font-black tracking-tight">
            Логирование подходов
          </h3>
        </div>
        <p className="mt-1 text-sm font-medium text-black/45">
          Записи доступны только до обновления страницы.
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-acid/50 bg-acid/15 p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-moss">
              Шаг 1
            </p>
            <h4 className="mt-1 text-base font-black">Активационный подход</h4>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-black/45">
            12–20
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <label className="block" htmlFor="myo-activation-weight">
            <span className="mb-1 block text-[0.65rem] font-black uppercase tracking-wide text-black/40">
              Вес, кг
            </span>
            <input
              id="myo-activation-weight"
              className="field bg-white"
              inputMode="decimal"
              placeholder="—"
              value={log.activationSet.weight}
              onChange={(event) => updateActivation("weight", event.target.value)}
            />
          </label>
          <label className="block" htmlFor="myo-activation-reps">
            <span className="mb-1 block text-[0.65rem] font-black uppercase tracking-wide text-black/40">
              Повторы
            </span>
            <input
              id="myo-activation-reps"
              className="field bg-white"
              inputMode="numeric"
              placeholder="12–20"
              value={log.activationSet.reps}
              onChange={(event) => updateActivation("reps", event.target.value)}
            />
          </label>
          <label className="block" htmlFor="myo-activation-rir">
            <span className="mb-1 block text-[0.65rem] font-black uppercase tracking-wide text-black/40">
              RIR
            </span>
            <input
              id="myo-activation-rir"
              className="field bg-white"
              inputMode="numeric"
              placeholder="1–2"
              value={log.activationSet.rir}
              onChange={(event) => updateActivation("rir", event.target.value)}
            />
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-moss">Шаг 2</p>
            <h4 className="mt-1 text-base font-black">Пять мио-подходов</h4>
          </div>
          {log.stopState.baselineMiniSetReps !== null ? (
            <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-black text-white">
              Ориентир: {log.stopState.baselineMiniSetReps}
            </span>
          ) : null}
        </div>

        <p className="mt-2 px-1 text-xs font-semibold text-black/45">
          {log.activationSet.weight
            ? `Сохраняй вес ${log.activationSet.weight} кг во всех подходах.`
            : "Вес остается таким же, как в активационном подходе."}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {log.miniSets.map((miniSet, index) => {
            const disabled = blocksFollowingSets && stoppedIndex >= 0 && index > stoppedIndex;
            return (
              <fieldset
                className={`min-w-0 rounded-2xl border p-3 transition ${
                  disabled
                    ? "border-black/5 bg-black/[0.03] opacity-50"
                    : "border-black/5 bg-white"
                }`}
                disabled={disabled}
                key={miniSet.id}
              >
                <legend className="sr-only">Мио-подход {index + 1}</legend>
                <div className="mb-2 flex min-h-6 items-center justify-between gap-1">
                  <span className="text-xs font-black">Мио {index + 1}</span>
                  {disabled ? <Lock aria-hidden="true" size={13} className="text-black/35" /> : null}
                </div>

                <label className="block" htmlFor={`${miniSet.id}-reps`}>
                  <span className="mb-1 block text-[0.6rem] font-black uppercase tracking-wide text-black/40">
                    Повторы
                  </span>
                  <input
                    id={`${miniSet.id}-reps`}
                    className="field px-2 text-center"
                    inputMode="numeric"
                    placeholder="3–5"
                    value={miniSet.reps}
                    onChange={(event) => updateMiniSet(miniSet.id, event.target.value)}
                  />
                </label>

              </fieldset>
            );
          })}
        </div>
      </div>

      <MyoStopSignal stopState={log.stopState} onOverride={overrideStop} />
    </section>
  );
}
