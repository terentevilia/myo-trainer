"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Pause, Play, Plus, RotateCcw, TimerReset } from "lucide-react";

type TimerStatus = "ready" | "running" | "paused" | "done";

const statusLabels: Record<TimerStatus, string> = {
  ready: "готов",
  running: "отдых",
  paused: "пауза",
  done: "готово",
};

const presets = [15, 20, 30];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function RestTimer({ defaultSeconds = 20 }: { defaultSeconds?: number }) {
  const [configuredSeconds, setConfiguredSeconds] = useState(defaultSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(defaultSeconds);
  const [status, setStatus] = useState<TimerStatus>("ready");
  const endAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "running") return;

    const updateFromTimestamp = () => {
      if (endAtRef.current === null) return;
      const remaining = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setRemainingSeconds(remaining);

      if (remaining === 0) {
        endAtRef.current = null;
        setStatus("done");
      }
    };

    updateFromTimestamp();
    const intervalId = window.setInterval(updateFromTimestamp, 250);
    document.addEventListener("visibilitychange", updateFromTimestamp);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", updateFromTimestamp);
    };
  }, [status]);

  function choosePreset(seconds: number) {
    endAtRef.current = null;
    setConfiguredSeconds(seconds);
    setRemainingSeconds(seconds);
    setStatus("ready");
  }

  function start() {
    const seconds = remainingSeconds > 0 ? remainingSeconds : configuredSeconds;
    setRemainingSeconds(seconds);
    endAtRef.current = Date.now() + seconds * 1000;
    setStatus("running");
  }

  function pause() {
    if (endAtRef.current !== null) {
      setRemainingSeconds(
        Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000)),
      );
    }
    endAtRef.current = null;
    setStatus("paused");
  }

  function reset() {
    endAtRef.current = null;
    setRemainingSeconds(configuredSeconds);
    setStatus("ready");
  }

  function adjust(delta: number) {
    const nextConfigured = Math.max(5, configuredSeconds + delta);
    setConfiguredSeconds(nextConfigured);

    if (status === "running" && endAtRef.current !== null) {
      endAtRef.current = Math.max(Date.now() + 1000, endAtRef.current + delta * 1000);
      setRemainingSeconds(
        Math.max(1, Math.ceil((endAtRef.current - Date.now()) / 1000)),
      );
      return;
    }

    setRemainingSeconds(
      status === "done" ? nextConfigured : Math.max(5, remainingSeconds + delta),
    );
    if (status === "done") setStatus("ready");
  }

  return (
    <section
      aria-labelledby="rest-timer-title"
      className={`overflow-hidden rounded-[1.5rem] border p-5 transition sm:p-6 ${
        status === "done"
          ? "border-acid bg-acid text-ink shadow-[0_0_0_4px_rgba(215,255,82,0.2)]"
          : "border-white/10 bg-ink text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TimerReset aria-hidden="true" size={18} />
            <h3 id="rest-timer-title" className="text-sm font-black uppercase tracking-[0.12em]">
              Таймер отдыха
            </h3>
          </div>
          <p className={`mt-1 text-xs font-bold ${status === "done" ? "text-ink/55" : "text-white/45"}`}>
            Статус: {statusLabels[status]}
          </p>
        </div>
        <div className="text-right" aria-live="polite">
          <span className="block text-5xl font-black tabular-nums tracking-[-0.06em]">
            {formatTime(remainingSeconds)}
          </span>
        </div>
      </div>

      {status === "done" ? (
        <p className="mt-4 rounded-2xl bg-ink px-4 py-3 text-sm font-black text-white">
          Отдых окончен — начинай мини-подход
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-3 gap-1.5" aria-label="Быстрый выбор времени">
        {presets.map((seconds) => (
          <button
            type="button"
            className={`focus-ring min-h-10 rounded-xl text-xs font-black transition ${
              configuredSeconds === seconds
                ? "bg-acid text-ink"
                : status === "done"
                  ? "bg-ink/10 text-ink"
                  : "bg-white/10 text-white hover:bg-white/15"
            }`}
            key={seconds}
            onClick={() => choosePreset(seconds)}
          >
            {seconds}с
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {status === "running" ? (
          <button
            type="button"
            className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white font-black text-ink"
            onClick={pause}
          >
            <Pause aria-hidden="true" size={17} fill="currentColor" />
            Пауза
          </button>
        ) : (
          <button
            type="button"
            className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-xl bg-acid font-black text-ink"
            onClick={start}
          >
            <Play aria-hidden="true" size={17} fill="currentColor" />
            Старт отдыха
          </button>
        )}
        <button
          type="button"
          className={`focus-ring flex min-h-12 items-center justify-center gap-2 rounded-xl font-black ${
            status === "done" ? "bg-ink/10" : "bg-white/10"
          }`}
          onClick={reset}
        >
          <RotateCcw aria-hidden="true" size={17} />
          Сброс
        </button>
        <button
          type="button"
          className={`focus-ring flex min-h-11 items-center justify-center gap-1 rounded-xl text-sm font-black ${
            status === "done" ? "bg-ink/10" : "bg-white/10"
          }`}
          onClick={() => adjust(-5)}
        >
          <Minus aria-hidden="true" size={15} />
          5 секунд
        </button>
        <button
          type="button"
          className={`focus-ring flex min-h-11 items-center justify-center gap-1 rounded-xl text-sm font-black ${
            status === "done" ? "bg-ink/10" : "bg-white/10"
          }`}
          onClick={() => adjust(5)}
        >
          <Plus aria-hidden="true" size={15} />
          5 секунд
        </button>
      </div>
    </section>
  );
}
