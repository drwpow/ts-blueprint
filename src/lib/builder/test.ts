import type { File, Framework, Test } from "../types.js";
import buildJest from "./tool/jest.js";
import buildVitest from "./tool/vitest.js";

export interface TestOptions {
  framework: Framework;
  test: Test;
}

export default function buildTest({ framework, test }: TestOptions): File[] {
  return test === "jest"
    ? buildJest({ framework })
    : buildVitest({ framework });
}
