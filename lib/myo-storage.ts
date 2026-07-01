import type {
  MyoExerciseLog,
  MyoMiniSetLog,
  MyoStopState,
  MyoStorageState,
} from "@/lib/myo-types";

export const MYO_STORAGE_KEY = "gym-program:myo-sets:v1";

export const createMiniSetLog = (number: number): MyoMiniSetLog => ({
  id: `mini-set-${number}`,
  weight: "",
  reps: "",
  comment: "",
});

export const createActiveStopState = (): MyoStopState => ({
  status: "active",
  baselineMiniSetReps: null,
  stoppedAtMiniSetId: null,
  stopReason: null,
  stopOverride: false,
});

export const createMyoExerciseLog = (): MyoExerciseLog => ({
  activationSet: {
    weight: "",
    reps: "",
    rir: "",
    comment: "",
  },
  miniSets: [createMiniSetLog(1), createMiniSetLog(2), createMiniSetLog(3)],
  stopState: createActiveStopState(),
  updatedAt: new Date(0).toISOString(),
});

export const createMyoStorageState = (selectedExerciseId: string): MyoStorageState => ({
  schemaVersion: 1,
  selectedExerciseId,
  exerciseLogs: {},
});

function parsePositiveReps(value: string) {
  if (!/^\d+$/u.test(value.trim())) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function calculateMyoStopState(
  miniSets: MyoMiniSetLog[],
  stopOverride = false,
): MyoStopState {
  const firstFilledIndex = miniSets.findIndex(
    (miniSet) => parsePositiveReps(miniSet.reps) !== null,
  );

  if (firstFilledIndex === -1) return createActiveStopState();

  const baseline = parsePositiveReps(miniSets[firstFilledIndex].reps);
  if (baseline === null) return createActiveStopState();

  const stoppedSet = miniSets
    .slice(firstFilledIndex + 1)
    .find((miniSet) => {
      const currentReps = parsePositiveReps(miniSet.reps);
      return currentReps !== null && baseline - currentReps >= 1;
    });

  if (!stoppedSet) {
    return {
      ...createActiveStopState(),
      baselineMiniSetReps: baseline,
    };
  }

  const currentReps = parsePositiveReps(stoppedSet.reps) ?? 0;
  return {
    status: "stopped",
    baselineMiniSetReps: baseline,
    stoppedAtMiniSetId: stoppedSet.id,
    stopReason: `Повторы снизились с ${baseline} до ${currentReps}.`,
    stopOverride,
  };
}

export function normalizeMyoExerciseLog(log: MyoExerciseLog): MyoExerciseLog {
  return {
    ...log,
    stopState: calculateMyoStopState(log.miniSets, log.stopState.stopOverride),
    updatedAt: new Date().toISOString(),
  };
}

export function loadMyoStorage(selectedExerciseId: string): MyoStorageState {
  if (typeof window === "undefined") return createMyoStorageState(selectedExerciseId);

  try {
    const stored = window.localStorage.getItem(MYO_STORAGE_KEY);
    if (!stored) return createMyoStorageState(selectedExerciseId);

    const parsed = JSON.parse(stored) as MyoStorageState;
    if (parsed.schemaVersion !== 1 || !parsed.exerciseLogs) {
      return createMyoStorageState(selectedExerciseId);
    }

    return parsed;
  } catch {
    return createMyoStorageState(selectedExerciseId);
  }
}

export function saveMyoStorage(state: MyoStorageState) {
  window.localStorage.setItem(MYO_STORAGE_KEY, JSON.stringify(state));
}
