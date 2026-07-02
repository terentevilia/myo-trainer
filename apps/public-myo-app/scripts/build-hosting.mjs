import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(appRoot, "out");
const archivePath = path.join(appRoot, "hosting-package.zip");
const packageOnly = process.argv.includes("--package-only");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: appRoot,
    encoding: "utf8",
    stdio: "inherit",
    ...options,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Команда завершилась с кодом ${result.status}: ${command} ${args.join(" ")}`);
  }
}

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const absolutePath = path.join(directory, name);
    return statSync(absolutePath).isDirectory() ? walk(absolutePath) : [absolutePath];
  });
}

function verifyExport() {
  const indexPath = path.join(outDir, "index.html");
  if (!existsSync(indexPath)) {
    throw new Error("Статический экспорт не создан: отсутствует out/index.html");
  }

  const files = walk(outDir);
  const forbiddenNames = files.filter((file) => {
    const relative = path.relative(outDir, file).toLowerCase();
    return relative.endsWith("programs.json") || relative.endsWith(".csv");
  });

  const textExtensions = new Set([".html", ".js", ".json", ".txt", ".xml", ".webmanifest"]);
  const forbiddenContent = files.filter((file) => {
    if (!textExtensions.has(path.extname(file).toLowerCase())) return false;
    const content = readFileSync(file, "utf8").toLowerCase();
    return content.includes("paid-programs-app") || content.includes("programs.json");
  });

  if (forbiddenNames.length || forbiddenContent.length) {
    const found = [...forbiddenNames, ...forbiddenContent]
      .map((file) => path.relative(outDir, file))
      .join(", ");
    throw new Error(`В статическом экспорте обнаружены запрещенные платные данные: ${found}`);
  }
}

if (!packageOnly) {
  rmSync(outDir, { recursive: true, force: true });
  rmSync(archivePath, { force: true });
  run("npm", ["run", "build"]);
} else {
  rmSync(archivePath, { force: true });
}

verifyExport();
run("zip", ["-q", "-r", archivePath, ".", "-x", "*.DS_Store"], { cwd: outDir });

console.log(`Готово: ${path.relative(appRoot, outDir)}/`);
console.log(`Готово: ${path.relative(appRoot, archivePath)}`);
