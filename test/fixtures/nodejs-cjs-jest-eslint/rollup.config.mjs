import ts from "@rollup/plugin-typescript";

/** @type {import("rollup").InputOptions} */
const config = {
  plugins: [
    ts()
  ],
};

export default config
