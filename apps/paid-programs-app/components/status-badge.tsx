import { Check, Clock3, Minus } from "lucide-react";
import type { WorkoutStatus } from "@/lib/types";

const labels: Record<WorkoutStatus, string> = {
  "not-started": "Не начато",
  "in-progress": "В процессе",
  completed: "Завершено",
};

export function StatusBadge({ status }: { status: WorkoutStatus }) {
  const styles = {
    "not-started": "bg-black/5 text-black/50",
    "in-progress": "bg-amber-100 text-amber-800",
    completed: "bg-moss/10 text-moss",
  }[status];
  const Icon = status === "completed" ? Check : status === "in-progress" ? Clock3 : Minus;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ${styles}`}>
      <Icon aria-hidden="true" size={14} strokeWidth={3} />
      {labels[status]}
    </span>
  );
}
