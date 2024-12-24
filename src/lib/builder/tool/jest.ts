import { trimLeading } from "../../string.js";
import type { File, Framework } from "../../types.js";

export interface JestOptions {
  framework: Framework;
}

export default function buildJest({ framework }: JestOptions): File[] {
  return [
    {
      dependencies: ["jest", "ts-jest"],
      filename: "jest.config.cjs",
      language: "javascript",
      contents: [
        '/** @type {import("jest").Config} */',
        "module.exports = {",
        '  testEnvironment: "jsdom",',
        trimLeading(
          `setupFilesAfterEnv: ["<rootDir>/${"jest.setup.ts"}"],`,
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
      filename: "babel.config.cjs",
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
