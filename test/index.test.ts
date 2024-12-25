import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import { describe, expect, test } from "vitest";
import { pkgBuilder } from "../src/lib/builder/index.js";
import type { Linter } from "../src/lib/builder/linter.js";
import type { Framework, Test } from "../src/lib/types.js";

const FIXTURES_DIR = new URL("./fixtures/", import.meta.url);

describe("Blueprint", () => {
  describe("snapshots", () => {
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
              await expect(file.contents).toMatchFileSnapshot(
                fileURLToPath(loc),
              );
            }
          });
        }
      }
    }
  });

  describe("scripts", () => {
    const tests: [string, { src: URL }][] = [
      [
        "nodejs",
        {
          src: new URL("./fixtures/nodejs-vitest-biome/", import.meta.url),
        },
      ],
    ];

    // TODO: test actual build output (convert to pnpm workspace first so these deps are included)
    for (const [name, { src }] of tests) {
      const cwd = new URL(`./${name}/`, import.meta.url);
      const pkgJSON = JSON.parse(
        fs.readFileSync(new URL("./package.json", cwd), "utf8"),
      );
      const compareAgainst = JSON.parse(
        fs.readFileSync(new URL("./pkg.json", src), "utf8"),
      );

      describe("name", () => {
        test("package.json", async () => {
          for (const [k, v] of Object.entries(compareAgainst.scripts)) {
            expect(pkgJSON.scripts[k], k).toBe(v);
          }
          for (const [k, v] of Object.entries(compareAgainst.devDependencies)) {
            expect(pkgJSON.devDependencies[k], k).toBe(v);
          }
        });

        test("files", async () => {
          for (const file of fs.readdirSync(src)) {
            if (file === "pkg.json") {
              continue;
            }
            expect(fs.existsSync(new URL(file, cwd)), file).toBe(true);
            expect(
              fs.readFileSync(new URL(file, cwd), "utf8").trim(),
              file,
            ).toBe(fs.readFileSync(new URL(file, src), "utf8").trim());
          }
        });

        test("build script", async () => {
          await execa("pnpm", ["run", "build"], { cwd });
          const actual = new URL("./dist/", cwd);
          const want = new URL("./want/", cwd);
          expect(fs.readdirSync(actual), "generated files").toEqual(
            fs.readdirSync(want),
          );
          for (const file of fs.readdirSync(want)) {
            await expect(
              fs.readFileSync(new URL(file, actual), "utf8").trim(),
            ).toMatchFileSnapshot(fileURLToPath(new URL(file, want)));
          }
        });

        test("lint script", async () => {
          await expect(
            execa("pnpm", ["run", "lint"], { cwd }),
          ).resolves.not.toThrow();
        });

        test("test script", async () => {
          await expect(
            execa("pnpm", ["run", "test"], { cwd }),
          ).resolves.not.toThrow();
        });
      });
    }
  });
});
