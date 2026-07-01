import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import type {
  Exercise,
  Gender,
  Program,
  ProgramCatalog,
  TrainingDay,
} from "../lib/types";

interface SourceDefinition {
  id: string;
  title: string;
  shortTitle: string;
  gender: Gender;
  daysPerWeek: number;
  fileName: string;
}

const sources: SourceDefinition[] = [
  {
    id: "male-2-days",
    title: "Мужская программа — 2 дня",
    shortTitle: "Мужская · 2 дня",
    gender: "male",
    daysPerWeek: 2,
    fileName: "male-2-days.csv",
  },
  {
    id: "male-3-days",
    title: "Мужская программа — 3 дня",
    shortTitle: "Мужская · 3 дня",
    gender: "male",
    daysPerWeek: 3,
    fileName: "male-3-days.csv",
  },
  {
    id: "female-2-days",
    title: "Женская программа — 2 дня",
    shortTitle: "Женская · 2 дня",
    gender: "female",
    daysPerWeek: 2,
    fileName: "female-2-days.csv",
  },
  {
    id: "female-3-days",
    title: "Женская программа — 3 дня",
    shortTitle: "Женская · 3 дня",
    gender: "female",
    daysPerWeek: 3,
    fileName: "female-3-days.csv",
  },
];

const root = process.cwd();
const sourceDir = path.join(root, "data", "source");
const outputFile = path.join(root, "data", "programs.json");

const clean = (value: unknown) => String(value ?? "").trim();
const normalizeRange = (value: string) => value.replaceAll("-", "–");

function normalizeRest(row: string[]) {
  const sourceValue = row.find((cell) => clean(cell).includes("минуты отдых"));
  if (!sourceValue) return "1,5–3 мин";
  return normalizeRange(clean(sourceValue).replace(" минуты отдых", " мин"));
}

function splitAlternatives(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseExercise(
  row: string[],
  dayNumber: number,
  exerciseNumber: number,
  defaultRest: string,
): Exercise {
  const rawName = clean(row[0]);
  const isOptional = /\(опционально\)/iu.test(rawName);
  const name = rawName.replace(/\s*\(опционально\)\s*/iu, "").trim();
  const setColumnStarts = [2, 5, 8, 11, 14];

  const workingSets = setColumnStarts.flatMap((column, index) => {
    const reps = clean(row[column + 1]);
    if (!reps) return [];

    return [
      {
        id: `set-${index + 1}`,
        reps: normalizeRange(reps),
        rir: clean(row[column + 2]) || null,
      },
    ];
  });

  return {
    id: `day-${dayNumber}-exercise-${exerciseNumber}`,
    order: exerciseNumber,
    name,
    isOptional,
    warmupSets: normalizeRange(clean(row[1])) || null,
    workingSets,
    rest: defaultRest,
    tempo: null,
    coachComment: clean(row[18]) || null,
    videoUrl: null,
    note: null,
    alternatives: splitAlternatives(clean(row[21])),
  };
}

function parseTrainingDays(rows: string[][]): TrainingDay[] {
  const dayStarts = rows.flatMap((row, index) =>
    /^День\s+\d+$/u.test(clean(row[0])) ? [index] : [],
  );

  return dayStarts.map((start, dayIndex) => {
    const dayNumber = dayIndex + 1;
    const end = dayStarts[dayIndex + 1] ?? rows.length;
    const commentRow = rows.findIndex(
      (row, rowIndex) =>
        rowIndex > start &&
        rowIndex < end &&
        clean(row[0]).startsWith("Комментарий к тренировке"),
    );
    const exerciseEnd = commentRow === -1 ? end : commentRow;
    const defaultRest = normalizeRest(rows[start]);
    const exerciseRows = rows
      .slice(start + 3, exerciseEnd)
      .filter((row) => clean(row[0]));
    const exercises = exerciseRows.map((row, exerciseIndex) =>
      parseExercise(row, dayNumber, exerciseIndex + 1, defaultRest),
    );

    return {
      id: `day-${dayNumber}`,
      title: `Тренировка ${dayNumber}`,
      description: null,
      defaultRest,
      exercises,
    };
  });
}

async function importProgram(source: SourceDefinition): Promise<Program> {
  const filePath = path.join(sourceDir, source.fileName);
  const csv = await readFile(filePath, "utf8");
  const rows = parse(csv, {
    bom: true,
    relax_column_count: true,
    skip_empty_lines: false,
  }) as string[][];
  const trainingDays = parseTrainingDays(rows);

  if (trainingDays.length !== source.daysPerWeek) {
    throw new Error(
      `${source.fileName}: ожидалось ${source.daysPerWeek} дней, найдено ${trainingDays.length}`,
    );
  }

  return {
    id: source.id,
    title: source.title,
    shortTitle: source.shortTitle,
    gender: source.gender,
    daysPerWeek: source.daysPerWeek,
    sourceFile: source.fileName,
    trainingDays,
  };
}

const programs = await Promise.all(sources.map(importProgram));
const catalog: ProgramCatalog = { schemaVersion: 1, programs };

await writeFile(outputFile, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

const totalDays = programs.reduce(
  (sum, program) => sum + program.trainingDays.length,
  0,
);
const totalExercises = programs.reduce(
  (sum, program) =>
    sum +
    program.trainingDays.reduce(
      (daySum, day) => daySum + day.exercises.length,
      0,
    ),
  0,
);

console.log(
  `Импортировано: ${programs.length} программы, ${totalDays} тренировок, ${totalExercises} упражнений.`,
);
