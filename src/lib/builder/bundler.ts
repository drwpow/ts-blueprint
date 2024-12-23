import type { File, Framework, Module } from "../types.js";
import buildRollup from "./tool/rollup.js";

export interface BundlerOptions {
  framework: Framework;
  module: Module;
}

export default function buildBundler({
  framework,
  module,
}: BundlerOptions): File[] {
  return buildRollup({ framework, module });
}
