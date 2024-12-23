import { ext } from "../../string.js";
import type { File, Framework, Module } from "../../types.js";

export interface VitestOptions {
  framework: Framework;
  module: Module;
}

export default function buildVitest({
  framework,
  module,
}: VitestOptions): File[] {
  const hasSetupFiles = framework !== "nodejs";

  const files: File[] = [
    {
      dependencies: ["vitest"],
      filename: ext("vite.config.mts", module),
      language: "typescript",
      contents: [
        'import { defineConfig } from "vitest/config";',
        "",
        "export default defineConfig({",
        "  test: {",
        `    environment: "${framework === "nodejs" ? "node" : "jsdom"}",`,
        ...(hasSetupFiles
          ? [`    setupFiles: ["./${ext("vitest.setup.mts", module)}"],`]
          : []),
        "  },",
        "});",
      ].join("\n"),
    },
  ];

  if (hasSetupFiles) {
    const setupDependencies: File["dependencies"] = [
      "@testing-library/jest-dom",
    ];
    if (framework === "react") {
      setupDependencies.push("@testing-library/react");
    } else if (framework === "vue") {
      setupDependencies.push("@testing-library/vue");
    } else if (framework === "svelte") {
      setupDependencies.push("@testing-library/svelte");
    }

    files.push({
      dependencies: setupDependencies,
      filename: ext("vite.setup.mts", module),
      language: "typescript",
      contents: ['import "@testing-library/jest-dom/vitest";'].join("\n"),
    });
  }

  return files;
}
