import { ext } from "../../string.js";
import type { File, Module } from "../../types.js";

export interface ESLintOptions {
  module: Module;
}

export default function buildESLint({ module }: ESLintOptions): File[] {
  return [
    {
      dependencies: ["@eslint/js", "typescript-eslint"],
      filename: ext("eslint.config.mjs", module),
      language: "javascript",
      contents: [
        'import eslint from "@eslint/js";',
        'import tseslint from "typescript-eslint";',
        "",
        "export default tseslint.config(",
        "  eslint.configs.recommended,",
        "  tseslint.configs.recommendedTypeChecked,",
        `  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }`,
        ");",
      ].join("\n"),
    },
  ];
}
