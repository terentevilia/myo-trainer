"use client";

import { Lock, Plus, Sparkles } from "lucide-react";
import { MyoStopSignal } from "@/components/myo-stop-signal";
import { createMiniSetLog } from "@/lib/myo-storage";
import type {
  MyoActivationSetLog,
  MyoExerciseLog,
  MyoMiniSetLog,
} from "@/lib/myo-types";

interface MyoSetLoggerProps {
  log: MyoExerciseLog;
  onChange: (log: MyoExerciseLog) => void;
}

type ActivationField = keyof MyoActivationSetLog;
type MiniSetField = Exclude<keyof MyoMiniSetLog, "id">;

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

  function updateMiniSet(id: string, field: MiniSetField, value: string) {
    onChange({
      ...log,
      miniSets: log.miniSets.map((miniSet) =>
        miniSet.id === id ? { ...miniSet, [field]: value } : miniSet,
      ),
    });
  }

  function addMiniSet() {
    if (blocksFollowingSets) return;
    onChange({
      ...log,
      miniSets: [...log.miniSets, createMiniSetLog(log.miniSets.length + 1)],
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
          Данные сохраняются автоматически на этом устройстве.
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
        <label className="mt-2 block" htmlFor="myo-activation-comment">
          <span className="sr-only">Комментарий к активационному подходу</span>
          <input
            id="myo-activation-comment"
            className="field bg-white"
            placeholder="Комментарий к активационному подходу"
            value={log.activationSet.comment}
            onChange={(event) => updateActivation("comment", event.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-3">
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-moss">Шаг 2</p>
            <h4 className="mt-1 text-base font-black">Мини-подходы</h4>
          </div>
          {log.stopState.baselineMiniSetReps !== null ? (
            <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-black text-white">
              Ориентир: {log.stopState.baselineMiniSetReps}
            </span>
          ) : null}
        </div>

        {log.miniSets.map((miniSet, index) => {
          const disabled = blocksFollowingSets && stoppedIndex >= 0 && index > stoppedIndex;
          return (
            <fieldset
              className={`rounded-[1.35rem] border p-4 transition ${
                disabled ? "border-black/5 bg-black/[0.03] opacity-60" : "border-black/5 bg-white"
              }`}
              disabled={disabled}
              key={miniSet.id}
            >
              <legend className="sr-only">Мини-подход {index + 1}</legend>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-black">Мини-подход {index + 1}</span>
                {disabled ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-black/45">
                    <Lock aria-hidden="true" size={13} />
                    Заблокирован
                  </span>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block" htmlFor={`${miniSet.id}-weight`}>
                  <span className="mb-1 block text-[0.65rem] font-black uppercase tracking-wide text-black/40">
                    Вес, кг
                  </span>
                  <input
                    id={`${miniSet.id}-weight`}
                    className="field"
                    inputMode="decimal"
                    placeholder="—"
                    value={miniSet.weight}
                    onChange={(event) => updateMiniSet(miniSet.id, "weight", event.target.value)}
                  />
                </label>
                <label className="block" htmlFor={`${miniSet.id}-reps`}>
                  <span className="mb-1 block text-[0.65rem] font-black uppercase tracking-wide text-black/40">
                    Повторы
                  </span>
                  <input
                    id={`${miniSet.id}-reps`}
                    className="field"
                    inputMode="numeric"
                    placeholder="3–5"
                    value={miniSet.reps}
                    onChange={(event) => updateMiniSet(miniSet.id, "reps", event.target.value)}
                  />
                </label>
              </div>
              <label className="mt-2 block" htmlFor={`${miniSet.id}-comment`}>
                <span className="sr-only">Комментарий к мини-подходу {index + 1}</span>
                <input
                  id={`${miniSet.id}-comment`}
                  className="field"
                  placeholder={`Комментарий к мини-подходу ${index + 1}`}
                  value={miniSet.comment}
                  onChange={(event) => updateMiniSet(miniSet.id, "comment", event.target.value)}
                />
              </label>
            </fieldset>
          );
        })}
      </div>

      <MyoStopSignal stopState={log.stopState} onOverride={overrideStop} />

      <button
        type="button"
        className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-moss/25 bg-moss/5 px-4 text-sm font-black text-moss transition enabled:hover:border-moss/50 enabled:hover:bg-moss/10 disabled:cursor-not-allowed disabled:opacity-45"
        disabled={blocksFollowingSets}
        onClick={addMiniSet}
      >
        {blocksFollowingSets ? <Lock aria-hidden="true" size={17} /> : <Plus aria-hidden="true" size={18} />}
        Добавить мини-подход
      </button>
    </section>
  );
}
