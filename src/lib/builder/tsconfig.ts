import type { File, Framework } from "../types.js";

export interface TSConfigOptions {
  framework: Framework;
}

export default function buildTSConfig({ framework }: TSConfigOptions): File[] {
  // biome-ignore lint/suspicious/noExplicitAny: Type not exported by typescript
  const tsconfig: any = {
    compilerOptions: {
      declaration: true,
      module: "NodeNext",
      moduleResolution: "nodenext",
      ...(framework === "react" ? { react: "react-jsx" } : {}),
      outDir: "dist",
      sourceMap: true,
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
