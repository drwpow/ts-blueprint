import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { pkgBuilder } from "../src/lib/builder/index.js";
import type { Linter } from "../src/lib/builder/linter.js";
import type { Framework, Module, Test } from "../src/lib/types.js";

const FIXTURES_DIR = new URL("./fixtures/", import.meta.url);

describe("Blueprint", () => {
  const module: Module[] = ["esm", "cjs"];
  const framework: Framework[] = ["nodejs", "react", "vue", "svelte"];
  const testFramework: Test[] = ["jest", "vitest"];
  const lint: Linter[] = ["eslint", "biome"];

  // TODO: add CLI

  for (const m of module) {
    for (const f of framework) {
      for (const t of testFramework) {
        for (const l of lint) {
          const id = `${f}-${m}-${t}-${l}`;
          test(id, async () => {
            const cwd = new URL(`./${id}/`, FIXTURES_DIR);
            const files = pkgBuilder({
              settings: {
                framework: f,
                module: m,
                linter: l,
                test: t,
                cli: false,
              },
            });
            for (const file of files) {
              const loc = new URL(file.filename, cwd);
              await expect(file.contents).toMatchFileSnapshot(
                fileURLToPath(loc),
              );
            }
          });
        }
      }
    }
  }
});
