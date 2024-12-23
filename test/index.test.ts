import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import type { Framework, Module } from "../src/lib/types.js";
import type { Linter } from "../src/lib/builder/linter.js";
import { pkgBuilder } from "../src/lib/builder/index.js";

const FIXTURES_DIR = new URL("./fixtures/", import.meta.url);

describe("Blueprint", () => {
  const module: Module[] = ["esm", "cjs"];
  const framework: Framework[] = ["nodejs", "react", "vue", "svelte"];
  const lint: Linter[] = ["eslint", "biome"];

  // TODO: add CLI

  for (const m of module) {
    for (const f of framework) {
      for (const l of lint) {
        const id = `${f}-${m}-${l}`;
        test(id, () => {
          const cwd = new URL(`./${id}/`, FIXTURES_DIR);
          const files = pkgBuilder({
            settings: {
              framework: f,
              module: m,
              linter: l,
              test: "jest",
              cli: false,
            },
          });
          for (const file of files) {
            const loc = new URL(file.filename, cwd);
            expect(file.contents).toMatchFileSnapshot(fileURLToPath(loc));
          }
        });
      }
    }
  }
});
