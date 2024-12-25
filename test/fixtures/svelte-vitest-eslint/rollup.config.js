import ts from "@rollup/plugin-typescript";
import svelte from "@sveltejs/vite-plugin-svelte";

/** @type {import("rollup").InputOptions} */
const config = {
  plugins: [
    ts({ tsconfig: "tsconfig.build.json" }),
    svelte(),
  ],
  external: ["*"],
  input: "src/index.ts",
  output: [
    {
      dir: "./dist/",
      format: "es",
      preserveModules: true,
      sourcemap: true,
    },
  ],
};

export default config
