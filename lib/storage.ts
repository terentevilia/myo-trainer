import type {
  ProgressState,
  SetLog,
  WorkoutSession,
} from "@/lib/types";

export const SELECTED_PROGRAM_KEY = "gym-program:selected-program";
export const PROGRESS_KEY = "gym-program:progress:v1";

export const emptyProgress = (): ProgressState => ({
  schemaVersion: 1,
  sessions: {},
});

export const emptySetLog = (): SetLog => ({
  weight: "",
  reps: "",
  rir: "",
  comment: "",
  completed: false,
});

export const emptyWorkoutSession = (): WorkoutSession => ({
  status: "not-started",
  updatedAt: new Date(0).toISOString(),
  workoutNote: "",
  exercises: {},
});

export function workoutKey(programId: string, dayId: string) {
  return `${programId}:${dayId}`;
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return emptyProgress();

  try {
    const stored = window.localStorage.getItem(PROGRESS_KEY);
    if (!stored) return emptyProgress();

    const parsed = JSON.parse(stored) as ProgressState;
    if (parsed.schemaVersion !== 1 || !parsed.sessions) return emptyProgress();
    return parsed;
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: ProgressState) {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function formatCompletionDate(value?: string) {
  if (!value) return null;

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
