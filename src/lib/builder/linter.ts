import type { File, Module } from "../types.js";
import buildBiome from "./tool/biome.js";
import buildESLint from "./tool/eslint.js";

export type Linter = "biome" | "eslint";

export interface LinterOptions {
  linter: Linter;
  module: Module;
}

export default function buildLinter({ linter, module }: LinterOptions): File[] {
  return linter === "eslint" ? buildESLint({ module }) : buildBiome();
}
