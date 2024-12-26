import fs from "node:fs";
import pacote from "pacote";

const PACKAGES = [
  "@babel/core",
  "@babel/preset-env",
  "@babel/preset-typescript",
  "@biomejs/biome",
  "@eslint/js",
  "@rollup/plugin-commonjs",
  "@rollup/plugin-typescript",
  "@sveltejs/package",
  "@sveltejs/vite-plugin-svelte",
  "@testing-library/jest-dom",
  "@testing-library/react",
  "@testing-library/vue",
  "@testing-library/svelte",
  "@types/babel__core",
  "@types/react-dom",
  "@types/react",
  "@vitejs/plugin-react-swc",
  "@vitejs/plugin-vue",
  "eslint",
  "jest",
  "react-dom",
  "react",
  "rollup",
  "rollup-plugin-import-css",
  "svelte",
  "ts-jest",
  "tslib",
  "typescript",
  "typescript-eslint",
  "vitest",
  "vue",
];

const OUT_FILE = new URL("../src/data/npm.ts", import.meta.url);

async function main() {
  const manifests = await Promise.all(
    PACKAGES.map((name) => pacote.manifest(name)),
  );

  // Note: we have to use a more aggressive  “as” here because Pacote’s types are out of date

  fs.writeFileSync(
    OUT_FILE,
    `import type pacote from "pacote";

const manifests = {${manifests
      .map(
        (m) => `
  "${m.name}": ${JSON.stringify(m)},`,
      )
      .join("")}
} as unknown as Record<${PACKAGES.map((n) => JSON.stringify(n)).join(" | ")}, Awaited<ReturnType<typeof pacote.manifest>>>;

export default manifests`,
  );
}

main();
