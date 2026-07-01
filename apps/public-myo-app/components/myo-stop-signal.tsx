"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { MyoStopState } from "@/lib/myo-types";

interface MyoStopSignalProps {
  stopState: MyoStopState;
  onOverride: () => void;
}

export function MyoStopSignal({ stopState, onOverride }: MyoStopSignalProps) {
  if (stopState.status !== "stopped") {
    return (
      <div className="rounded-2xl border border-moss/15 bg-moss/5 p-4">
        <div className="flex gap-3">
          <ShieldCheck aria-hidden="true" className="shrink-0 text-moss" size={20} />
          <div>
            <p className="text-sm font-black text-moss">Стоп-сигнал пока не сработал</p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-black/50">
              Первый заполненный мио-подход станет ориентиром для следующих.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-4 text-red-950">
      <div className="flex gap-3">
        <ShieldAlert aria-hidden="true" className="shrink-0 text-red-600" size={23} />
        <div>
          <p className="text-sm font-black leading-snug">
            Стоп-сигнал: повторы начали снижаться. Мио-подходы завершены. Дальше продолжать не нужно — это уже лишний объем.
          </p>
          {stopState.stopReason ? (
            <p className="mt-2 text-xs font-bold text-red-700">{stopState.stopReason}</p>
          ) : null}
          <p className="mt-3 text-xs font-semibold leading-relaxed text-red-900/70">
            В мио-подходах снижение повторений — сигнал, что нужный стимул уже набран. Продолжать дальше обычно не нужно.
          </p>
          {stopState.stopOverride ? (
            <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-black text-red-700">
              Стоп-сигнал был отключен вручную
            </p>
          ) : (
            <button
              type="button"
              className="focus-ring mt-4 min-h-11 rounded-xl bg-red-700 px-4 text-sm font-black text-white"
              onClick={onOverride}
            >
              Разблокировать вручную
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
