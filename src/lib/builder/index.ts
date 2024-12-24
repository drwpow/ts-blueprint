import type npmData from "../../data/npm.js";
import type { File, Framework, Test } from "../types.js";
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

export interface PkgBuilderOptions {
  settings: {
    framework: Framework;
    cli: boolean;
    linter: Linter;
    test: Test;
  };
}

export function pkgBuilder({ settings }: PkgBuilderOptions): File[] {
  const files = [
    ...buildBundler({
      framework: settings.framework,
    }),
    ...buildLinter({
      framework: settings.framework,
      linter: settings.linter,
    }),
    ...buildTSConfig({
      framework: settings.framework,
    }),
    ...buildTest({
      framework: settings.framework,
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
      framework: settings.framework,
      lint: settings.linter,
      test: settings.test,
      cli: settings.cli,
    }),
  );

  const sorted = [...files];
  sorted.sort((a, b) => {
    // sort package.json first
    if (a.filename === "package.json") {
      return -1;
    }
    if (b.filename === "package.json") {
      return 1;
    }
    return a.filename.localeCompare(b.filename, undefined, { numeric: true });
  });
  return sorted;
}
