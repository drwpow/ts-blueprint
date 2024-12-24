import type npmData from "../data/npm.js";

export type Framework = "nodejs" | "react" | "vue" | "svelte";

export type Test = "vitest" | "jest";

export interface Dependency {
  name: keyof typeof npmData;
  default?: string;
  named?: string[];
}

export interface File {
  dependencies: (keyof typeof npmData)[];
  filename: string;
  language: "javascript" | "json" | "typescript";
  contents: string;
}
