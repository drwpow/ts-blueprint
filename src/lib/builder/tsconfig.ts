import type { File, Module } from "./types.js";

export interface TSConfigOptions {
  module: Module;
}

export default function buildTSConfig({ module }: TSConfigOptions): File[] {
  // biome-ignore lint/suspicious/noExplicitAny: Type not exported by typescript
  const tsconfig: any = {
    compilerOptions: {
      module: module === "esm" ? "NodeNext" : "CommonJS",
      moduleResolution: module === "esm" ? "node" : "Node16",
      strict: true,
      target: "ESNext",
    },
    include: ["src"],
    exclude: ["node_modules", "dist", "**/__tests__/**/fixtures"],
  };

  return [
    {
      dependencies: [],
      filename: "tsconfig.json",
      language: "json",
      contents: JSON.stringify(tsconfig, undefined, 2),
    },
    {
      dependencies: [],
      filename: "tsconfig.build.json",
      language: "json",
      contents: JSON.stringify(
        {
          extends: "./tsconfig.json",
          exclude: ["test", "**/*.test.*", "**/__tests__/*"],
        },
        undefined,
        2,
      ),
    },
  ];
}
