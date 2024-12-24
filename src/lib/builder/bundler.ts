import type { File, Framework } from "../types.js";
import buildRollup from "./tool/rollup.js";

export interface BundlerOptions {
  framework: Framework;
}

export default function buildBundler({ framework }: BundlerOptions): File[] {
  return buildRollup({ framework });
}
