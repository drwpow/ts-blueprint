import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import { describe, expect, test } from "vitest";
import { pkgBuilder } from "../src/lib/builder/index.js";
import type { Linter } from "../src/lib/builder/linter.js";
import type { Framework, Test } from "../src/lib/types.js";

const FIXTURES_DIR = new URL("./fixtures/", import.meta.url);

describe("Blueprint", () => {
  const framework: Framework[] = ["nodejs", "react", "vue", "svelte"];
  const testFramework: Test[] = ["jest", "vitest"];
  const lint: Linter[] = ["eslint", "biome"];

  for (const f of framework) {
    for (const t of testFramework) {
      for (const l of lint) {
        const id = `${f}-${t}-${l}`;
        test(id, async () => {
          const cwd = new URL(`./${id}/`, FIXTURES_DIR);
          const files = pkgBuilder({
            settings: {
              framework: f,
              linter: l,
              test: t,
              cli: false,
            },
          });
          for (const file of files) {
            // don’t actually save `package.json` files because it will slow `pnpm i`
            const loc = new URL(
              file.filename.replace("package.json", "pkg.json"),
              cwd,
            );
            await expect(file.contents).toMatchFileSnapshot(fileURLToPath(loc));
          }
        });
      }
    }
  }

  test("build: Node.js", async () => {
    const from = new URL("./fixtures/nodejs-vitest-biome/", import.meta.url);
    const cwd = new URL("./fixtures/build-nodejs/", import.meta.url);
    copyFixture(from, cwd);
    await execa(
      "pnpm",
      ["exec", "rollup", "-c", fileURLToPath(new URL("rollup.config.js", cwd))],
      { cwd },
    );
  });
});

function copyFixture(from: URL, to: URL) {
  fs.mkdirSync(to, { recursive: true });
  for (const file of fs.readdirSync(from)) {
    if (fs.statSync(fileURLToPath(new URL(file, from))).isFile()) {
      fs.copyFileSync(new URL(file, from), new URL(file, to));
    }
  }
}
