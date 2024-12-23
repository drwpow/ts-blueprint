import { ext } from "../string.js";
import type { File, Framework, Module } from "../types.js";

export type Test = "jest" | "vitest";

export interface TestOptions {
  framework: Framework;
  module: Module;
  test: Test;
}

export default function buildTest({
  framework,
  module,
  test,
}: TestOptions): File[] {
  if (test === "jest") {
    return [
      {
        dependencies: ["jest"],
        filename: ext("jest.config.cjs", module),
        language: "javascript",
        contents: [
          '** @type {import("jest").Config} */',
          "module.exports = {",
          "};",
          "",
        ].join("\n"),
      },
      {
        dependencies: ["@babel/core"],
        filename: ext("babel.config.cjs", module),
        language: "javascript",
        contents: [].join("\n"),
      },
    ];
  }

  return [
    {
      dependencies: ["vitest"],
      filename: ext("vite.config.mts", module),
      language: "typescript",
      contents: `import { defineConfig } from "vitest/config";

export default defineConfig({
});
`,
    },
  ];
}
