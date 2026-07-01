import catalog from "@/data/programs.json";
import type { Program, ProgramCatalog } from "@/lib/types";

const typedCatalog = catalog as ProgramCatalog;

export const programs = typedCatalog.programs;

export function getProgram(programId: string): Program | undefined {
  return programs.find((program) => program.id === programId);
}

export function getTrainingDay(programId: string, dayId: string) {
  return getProgram(programId)?.trainingDays.find((day) => day.id === dayId);
}
