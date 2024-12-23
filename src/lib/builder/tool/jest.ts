import { ext, trimLeading } from "../../string.js";
import type { File, Framework, Module } from "../../types.js";

export interface JestOptions {
  framework: Framework;
  module: Module;
}

export default function buildJest({ framework, module }: JestOptions): File[] {
  return [
    {
      dependencies: ["jest", "ts-jest"],
      filename: ext("jest.config.cjs", module),
      language: "javascript",
      contents: [
        '/** @type {import("jest").Config} */',
        "module.exports = {",
        '  testEnvironment: "jsdom",',
        trimLeading(
          `setupFilesAfterEnv: ["<rootDir>/${ext("jest.setup.cts", module)}"],`,
          "  ",
        ),
        "};",
        "",
      ].join("\n"),
    },

    // note: Even though Babel is its own tool, it’s only needed for Jest in modern setups
    {
      dependencies: [
        "@babel/core",
        "@babel/preset-env",
        "@babel/preset-typescript",
        "@types/babel__core",
      ],
      filename: ext("babel.config.cjs", module),
      language: "javascript",
      contents: `/** @type {import("@types/babel__core").TransformOptions} */
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
};
`,
    },
  ];
}
