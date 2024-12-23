import fs from "node:fs";
import pacote from "pacote";

const PACKAGES = [
  "@babel/core",
  "@babel/preset-env",
  "@babel/preset-typescript",
  "@biomejs/biome",
  "@eslint/js",
  "@rollup/plugin-typescript",
  "@sveltejs/vite-plugin-svelte",
  "@testing-library/jest-dom",
  "@testing-library/react",
  "@testing-library/vue",
  "@testing-library/svelte",
  "@types/babel__core",
  "@types/react-dom",
  "@types/react",
  "@vitejs/plugin-react",
  "@vitejs/plugin-vue",
  "eslint",
  "jest",
  "react-dom",
  "react",
  "rollup",
  "svelte",
  "ts-jest",
  "typescript-eslint",
  "typescript",
  "vitest",
  "vue",
];

const OUT_FILE = new URL("../src/data/npm.ts", import.meta.url);

async function main() {
  const manifests = await Promise.all(
    PACKAGES.map((name) => pacote.manifest(name)),
  );
  fs.writeFileSync(
    OUT_FILE,
    `import type { Manifest } from "pacote";

const manifests: Record<${PACKAGES.map((n) => JSON.stringify(n)).join(" | ")}, Manifest> = {${manifests
      .map(
        (m) => `
  "${m.name}": ${JSON.stringify(m)},`,
      )
      .join("")}
};

export default manifests`,
  );
}

main();
