import ts from "@rollup/plugin-typescript";
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
  output: [
    [{,
    dir: "./dist/",
    sourcemap: true,
    globals: {
      "react/jsx-runtime": "jsxRuntime",
      "react-dom/client": "ReactDOM",
      react: "React",
    },
    ],,
  ],
};

export default config
