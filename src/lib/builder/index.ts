import type npmData from "../../data/npm.js";
import type { File, Framework, Module, Test } from "../types.js";
import buildBundler from "./bundler.js";
import buildLinter, { type Linter } from "./linter.js";
import buildPkgJSON from "./pkg-json.js";
import buildTest from "./test.js";
import buildTSConfig from "./tsconfig.js";

export * from "./bundler.js";
export * from "./linter.js";
export * from "./pkg-json.js";
export * from "./tsconfig.js";
export * from "./test.js";

const FILE_ORDER = [
  // constants
  "package.json",
  "tsconfig.json",
  "tsconfig.build.json",

  // variables
  "babel.config",
  "biome.json",
  "eslint.config",
  "jest.config",
  "jest.setup",
  "rollup.config",
  "vitest.config",
  "vitest.setup",
];

export interface PkgBuilderOptions {
  settings: {
    framework: Framework;
    cli: boolean;
    module: Module;
    linter: Linter;
    test: Test;
  };
}

export function pkgBuilder({ settings }: PkgBuilderOptions): File[] {
  const files = [
    ...buildBundler({
      framework: settings.framework,
      module: settings.module,
    }),
    ...buildLinter({
      linter: settings.linter,
      module: settings.module,
    }),
    ...buildTSConfig({
      module: settings.module,
    }),
    ...buildTest({
      framework: settings.framework,
      module: settings.module,
      test: settings.test,
    }),
  ];

  const allDeps = files.reduce((deps, file) => {
    for (const dep of file.dependencies) {
      deps.add(dep);
    }
    return deps;
  }, new Set<keyof typeof npmData>());

  files.push(
    ...buildPkgJSON({
      dependencies: [...allDeps],
      cjs: settings.module === "cjs",
      test: settings.test,
      cli: settings.cli,
    }),
  );

  const sorted = [...files];
  sorted.sort((a, b) => {
    const aInd = FILE_ORDER.findIndex((f) => a.filename.startsWith(f));
    const bInd = FILE_ORDER.findIndex((f) => b.filename.startsWith(f));
    return (aInd === -1 ? 10_000 : aInd) - (bInd === -1 ? 10_000 : bInd);
  });
  return sorted;
}
