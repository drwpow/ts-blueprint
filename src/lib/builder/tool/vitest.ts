import { formatImportStatement } from "../../module.js";
import type { Dependency, File, Framework } from "../../types.js";

export interface VitestOptions {
  framework: Framework;
}

const DEPENDENCIES: Record<Framework, Dependency[]> = {
  nodejs: [],
  react: [{ name: "@vitejs/plugin-react-swc", default: "react" }],
  vue: [{ name: "@vitejs/plugin-vue", default: "vue" }],
  svelte: [{ name: "@sveltejs/vite-plugin-svelte", default: "svelte" }],
};

export default function buildVitest({ framework }: VitestOptions): File[] {
  const hasSetupFiles = framework !== "nodejs";

  const plugins = (DEPENDENCIES[framework] || []).map(
    (p) => `    ${p.default}(),`,
  );

  const files: File[] = [
    {
      dependencies: ["vitest"],
      filename: "vite.config.ts",
      language: "typescript",
      contents: [
        ...(DEPENDENCIES[framework] || []).map(formatImportStatement),
        'import { defineConfig } from "vitest/config";',
        "",
        "export default defineConfig({",
        ...(plugins.length ? ["  plugins: {", ...plugins, "  },"] : []),
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
      filename: "vitest.setup.ts",
      language: "typescript",
      contents: ['import "@testing-library/jest-dom/vitest";'].join("\n"),
    });
  }

  return files;
}
