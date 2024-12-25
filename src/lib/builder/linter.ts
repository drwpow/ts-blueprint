import type { File, Framework } from "../types.js";
import buildBiome from "./tool/biome.js";
import buildESLint from "./tool/eslint.js";

export type Linter = "biome" | "eslint";

export interface LinterOptions {
  linter: Linter;
  framework: Framework;
}

export default function buildLinter({
  framework,
  linter,
}: LinterOptions): File[] {
  return linter === "eslint"
    ? buildESLint({ framework })
    : buildBiome({ framework });
}
