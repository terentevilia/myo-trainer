export type Gender = "male" | "female";

export interface WorkingSetTarget {
  id: string;
  reps: string;
  rir: string | null;
}

export interface Exercise {
  id: string;
  order: number;
  name: string;
  isOptional: boolean;
  warmupSets: string | null;
  workingSets: WorkingSetTarget[];
  rest: string;
  tempo: string | null;
  coachComment: string | null;
  videoUrl: string | null;
  note: string | null;
  alternatives: string[];
}

export interface TrainingDay {
  id: string;
  title: string;
  description: string | null;
  defaultRest: string;
  exercises: Exercise[];
}

export interface Program {
  id: string;
  title: string;
  shortTitle: string;
  gender: Gender;
  daysPerWeek: number;
  sourceFile: string;
  trainingDays: TrainingDay[];
}

export interface ProgramCatalog {
  schemaVersion: 1;
  programs: Program[];
}

export type WorkoutStatus = "not-started" | "in-progress" | "completed";

export interface SetLog {
  weight: string;
  reps: string;
  rir: string;
  comment: string;
  completed: boolean;
}

export interface ExerciseLog {
  sets: Record<string, SetLog>;
}

export interface WorkoutSession {
  status: WorkoutStatus;
  updatedAt: string;
  completedAt?: string;
  workoutNote: string;
  exercises: Record<string, ExerciseLog>;
}

export interface ProgressState {
  schemaVersion: 1;
  sessions: Record<string, WorkoutSession>;
}
