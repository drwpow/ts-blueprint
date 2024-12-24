import commonjs from "@rollup/plugin-commonjs";
import ts from "@rollup/plugin-typescript";

/** @type {import("rollup").InputOptions} */
const config = {
  plugins: [
    ts({ tsconfig: "tsconfig.build.json" }),
    commonjs(),
  ],
  output: [
    {
      dir: "./dist/",
      format: "es",
      preserveModules: true,
      sourcemap: true,
    },
    {
      dir: "./dist/",
      format: "cjs",
      preserveModules: true,
      sourcemap: true,
      entryFileNames: "[name].cjs",
    },
  ],
};

export default config
