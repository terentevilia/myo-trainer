import { notFound } from "next/navigation";
import { WorkoutClient } from "@/components/workout-client";
import { getProgram, programs } from "@/lib/programs";

interface WorkoutPageProps {
  params: Promise<{
    programId: string;
    dayId: string;
  }>;
}

export function generateStaticParams() {
  return programs.flatMap((program) =>
    program.trainingDays.map((day) => ({
      programId: program.id,
      dayId: day.id,
    })),
  );
}

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const { programId, dayId } = await params;
  const program = getProgram(programId);
  const day = program?.trainingDays.find((trainingDay) => trainingDay.id === dayId);

  if (!program || !day) notFound();

  return <WorkoutClient day={day} program={program} programs={programs} />;
}
