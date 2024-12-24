import type { File, Framework } from "../../types.js";

export interface VitestOptions {
  framework: Framework;
}

export default function buildVitest({ framework }: VitestOptions): File[] {
  const hasSetupFiles = framework !== "nodejs";

  const files: File[] = [
    {
      dependencies: ["vitest"],
      filename: "vite.config.ts",
      language: "typescript",
      contents: [
        'import { defineConfig } from "vitest/config";',
        "",
        "export default defineConfig({",
        "  test: {",
        `    environment: "${framework === "nodejs" ? "node" : "jsdom"}",`,
        ...(hasSetupFiles
          ? [`    setupFiles: ["./${"vitest.setup.ts"}"],`]
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
      filename: "vite.setup.ts",
      language: "typescript",
      contents: ['import "@testing-library/jest-dom/vitest";'].join("\n"),
    });
  }

  return files;
}
