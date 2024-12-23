import { ext } from "../string.js";
import type { File, Module } from "../types.js";

export type Linter = "biome" | "eslint";

export interface LinterOptions {
  linter: Linter;
  module: Module;
}

export default function buildLinter({ linter, module }: LinterOptions): File[] {
  if (linter === "eslint") {
    return [
      {
        dependencies: ["@eslint/js", "eslint", "typescript-eslint"],
        filename: ext("eslint.config.mjs", module),
        language: "javascript",
        contents: `export default [
]`,
      },
    ];
  }

  return [
    {
      dependencies: ["@biomejs/biome"],
      filename: "biome.json",
      language: "json",
      contents: `{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "files": {
    "ignoreUnknown": false,
    "ignore": []
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space"
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    }
  }
}`,
    },
  ];
}
