import ts from "@rollup/plugin-typescript";
import react from "@vitejs/plugin-react-swc";
import css from "rollup-plugin-import-css";

/** @type {import("rollup").InputOptions} */
const config = {
  plugins: [
    css({
      output: "all-components.css",
    }),
    ts({
      tsconfig: "./tsconfig.build.json",
    }),
  ],
  external: ["*"],
  input: "src/index.ts",
  output: [
    {
      dir: "./dist/",
      format: "es",
      preserveModules: true,
      sourcemap: true,
      globals: {
        "react/jsx-runtime": "jsxRuntime",
        "react-dom/client": "ReactDOM",
        react: "React",
      }
    },
  ],
};

export default config
