"use client";

import { ChevronDown, Dumbbell } from "lucide-react";
import type { Program } from "@/lib/types";

interface AppHeaderProps {
  programs: Program[];
  selectedProgramId: string;
  onProgramChange: (programId: string) => void;
}

export function AppHeader({
  programs,
  selectedProgramId,
  onProgramChange,
}: AppHeaderProps) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/95 text-white backdrop-blur-xl"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="mx-auto flex h-[5.75rem] max-w-2xl items-center gap-3 px-4">
        <div className="flex shrink-0 items-center gap-2" aria-label="Сила">
          <span className="grid size-10 place-items-center rounded-2xl bg-acid text-ink">
            <Dumbbell aria-hidden="true" size={21} strokeWidth={2.5} />
          </span>
          <span className="hidden text-sm font-black uppercase tracking-[0.18em] min-[390px]:block">
            Сила
          </span>
        </div>

        <div className="relative ml-auto min-w-0 flex-1 min-[390px]:max-w-[17rem]">
          <label
            htmlFor="program-selector"
            className="mb-1 block text-[0.65rem] font-bold uppercase tracking-[0.13em] text-white/45"
          >
            Программа
          </label>
          <select
            id="program-selector"
            className="focus-ring h-11 w-full appearance-none truncate rounded-xl border border-white/10 bg-white/10 pl-3 pr-10 text-sm font-bold text-white"
            value={selectedProgramId}
            onChange={(event) => onProgramChange(event.target.value)}
          >
            {programs.map((program) => (
              <option className="bg-ink text-white" key={program.id} value={program.id}>
                {program.shortTitle}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 right-3 text-acid"
            size={18}
          />
        </div>
      </div>
    </header>
  );
}
