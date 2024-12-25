import ts from "@rollup/plugin-typescript";
import vue from "@vitejs/plugin-vue";

/** @type {import("rollup").InputOptions} */
const config = {
  plugins: [
    ts({ tsconfig: "tsconfig.build.json" }),
    vue(),
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
