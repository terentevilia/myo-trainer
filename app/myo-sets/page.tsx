import type { Metadata } from "next";
import { MyoSetsClient } from "@/components/myo-sets-client";
import trainingDayData from "@/data/myo-training-day.json";
import type { MyoTrainingDay } from "@/lib/myo-types";

export const metadata: Metadata = {
  title: "Мио-сеты: обучающая тренировка",
  description: "Интерактивная обучалка по выполнению мио-сет подходов.",
};

export default function MyoSetsPage() {
  return <MyoSetsClient trainingDay={trainingDayData as MyoTrainingDay} />;
}
