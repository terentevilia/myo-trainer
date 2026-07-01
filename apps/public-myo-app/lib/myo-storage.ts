import type {
  MyoExerciseLog,
  MyoMiniSetLog,
  MyoStopState,
  MyoStorageState,
} from "@/lib/myo-types";

export const createMiniSetLog = (number: number): MyoMiniSetLog => ({
  id: `mini-set-${number}`,
  reps: "",
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
  },
  miniSets: [1, 2, 3, 4, 5].map(createMiniSetLog),
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

  const baseline =
    firstFilledIndex === -1 ? null : parsePositiveReps(miniSets[firstFilledIndex].reps);
  const repsStopIndex =
    baseline === null
      ? -1
      : miniSets.findIndex((miniSet, index) => {
          if (index <= firstFilledIndex) return false;
          const currentReps = parsePositiveReps(miniSet.reps);
          return currentReps !== null && baseline - currentReps >= 1;
        });
  const stoppedIndex = repsStopIndex;

  if (stoppedIndex === -1) {
    return {
      ...createActiveStopState(),
      baselineMiniSetReps: baseline,
    };
  }

  const stoppedSet = miniSets[stoppedIndex];
  const currentReps = parsePositiveReps(stoppedSet.reps);
  const stopReason = `Повторы снизились с ${baseline} до ${currentReps}.`;
  return {
    status: "stopped",
    baselineMiniSetReps: baseline,
    stoppedAtMiniSetId: stoppedSet.id,
    stopReason,
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
