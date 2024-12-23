import type npmData from "../../data/npm.js";
import type { File, Framework, Module } from "../types.js";
import buildBundler from "./bundler.js";
import buildLinter, { type Linter } from "./linter.js";
import buildPkgJSON from "./pkgjson.js";
import buildTest, { type Test } from "./test.js";
import buildTSConfig from "./tsconfig.js";

export * from "./bundler.js";
export * from "./linter.js";
export * from "./pkgjson.js";
export * from "./tsconfig.js";
export * from "./test.js";

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
    }),
  );

  return files;
}
