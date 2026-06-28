import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const FORBIDDEN_CROSS_IMPORTS: Array<[string, string]> = [
  ["apps/web", "apps/api"],
  ["apps/web", "apps/mobile"],
  ["apps/mobile", "apps/api"],
  ["apps/mobile", "apps/web"],
  ["apps/api", "apps/mobile"],
  ["apps/api", "apps/web"],
];

function findTsFiles(dir: string): string[] {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    return entries.flatMap((e) =>
      e.isDirectory()
        ? findTsFiles(join(dir, e.name))
        : e.name.endsWith(".ts") || e.name.endsWith(".tsx")
        ? [join(dir, e.name)]
        : []
    );
  } catch {
    return [];
  }
}

export function lintImportBoundaries(root: string): string[] {
  const violations: string[] = [];
  for (const [from, to] of FORBIDDEN_CROSS_IMPORTS) {
    const files = findTsFiles(join(root, from));
    for (const file of files) {
      const content = readFileSync(file, "utf-8");
      if (content.includes(`from "${to}`) || content.includes(`require("${to}`)) {
        violations.push(`${file}: illegal import from ${to}`);
      }
    }
  }
  return violations;
}
