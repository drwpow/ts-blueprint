import type npmData from "../../data/npm.js";

export type Framework = "nodejs" | "react" | "vue" | "svelte";

export type Module = "esm" | "cjs";

export interface File {
  dependencies: (keyof typeof npmData)[];
  filename: string;
  language: "javascript" | "json" | "typescript";
  contents: string;
}
