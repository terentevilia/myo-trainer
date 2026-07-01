export interface MyoProtocol {
  activationSet: string;
  activationRir: string;
  miniSets: string;
  miniSetReps: string;
  restBetweenMiniSets: string;
  defaultRestSeconds: number;
  stopRule: string;
}

export interface MyoExercise {
  id: string;
  name: string;
  order: number;
  imageUrl: string;
  videoUrl: string;
  targetMuscles: string[];
  alternatives: string[];
}

export interface MyoTrainingDay {
  title: string;
  description: string;
  demoVideoUrl: string;
  myoProtocol: MyoProtocol;
  cues: string[];
  commonMistakes: string[];
  exercises: MyoExercise[];
}

export interface MyoActivationSetLog {
  weight: string;
  reps: string;
  rir: string;
}

export interface MyoMiniSetLog {
  id: string;
  reps: string;
}

export interface MyoStopState {
  status: "active" | "stopped";
  baselineMiniSetReps: number | null;
  stoppedAtMiniSetId: string | null;
  stopReason: string | null;
  stopOverride: boolean;
}

export interface MyoExerciseLog {
  activationSet: MyoActivationSetLog;
  miniSets: MyoMiniSetLog[];
  stopState: MyoStopState;
  updatedAt: string;
}

export interface MyoStorageState {
  schemaVersion: 1;
  selectedExerciseId: string;
  exerciseLogs: Record<string, MyoExerciseLog>;
}
