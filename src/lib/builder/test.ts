import type { File, Framework, Module, Test } from "../types.js";
import buildJest from "./tool/jest.js";
import buildVitest from "./tool/vitest.js";

export interface TestOptions {
  framework: Framework;
  module: Module;
  test: Test;
}

export default function buildTest({
  framework,
  module,
  test,
}: TestOptions): File[] {
  return test === "jest"
    ? buildJest({ module })
    : buildVitest({ framework, module });
}
