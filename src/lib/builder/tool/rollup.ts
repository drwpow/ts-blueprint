import { ext, trimLeading } from "../../string.js";
import type { File, Framework, Module } from "../../types.js";

export interface RollupOptions {
  framework: Framework;
  module: Module;
}

export default function buildRollup({
  framework,
  module,
}: RollupOptions): File[] {
  const imports = ['import ts from "@rollup/plugin-typescript";'];
  const filename = ext("rollup.config.mjs", module);
  const language = "javascript";
  const dependencies: File["dependencies"] = [
    "@rollup/plugin-typescript",
    "rollup",
  ];
  const files: File[] = [];

  switch (framework) {
    case "nodejs": {
      files.push({
        dependencies,
        filename,
        language,
        contents: buildRollupConfig({
          imports,
          plugins: ["ts()"],
        }),
      });
      break;
    }

    case "react": {
      files.push({
        dependencies,
        filename,
        language,
        contents: buildRollupConfig({
          imports: [...imports, 'import css from "rollup-plugin-import-css";'],
          plugins: [
            `css({
output: "all-components.css",
})`,
            `ts({
tsconfig: "./tsconfig.build.json",
})`,
          ],
          output: [
            'dir: "./dist/"',
            "sourcemap: true",
            `globals: {
"react/jsx-runtime": "jsxRuntime",
"react-dom/client": "ReactDOM",
react: 'React',
}`,
          ],
        }),
      });
      break;
    }

    case "svelte": {
      files.push({
        dependencies,
        filename,
        language,
        contents: buildRollupConfig({
          imports: ['import svelte from "rollup-plugin-svelte";'],
          plugins: ["ts()", "svelte()"],
        }),
      });
      break;
    }

    case "vue": {
      files.push({
        dependencies,
        filename,
        language,
        contents: buildRollupConfig({
          imports: ['import vue from "rollup-plugin-vue";'],
          plugins: ["vue()"],
        }),
      });
      break;
    }
  }

  return files;
}

export interface RollupConfigOptions {
  plugins?: string[];
  inputs?: string[];
  imports?: string[];
  output?: string[];
}

/** Build Rollup Config */
export function buildRollupConfig({
  inputs,
  imports,
  plugins,
  output,
}: RollupConfigOptions) {
  const config = [
    ...(imports ? imports.concat("") : []),
    '/** @type {import("rollup").InputOptions} */',
    "const config = {",
  ];

  if (plugins) {
    config.push(
      "  plugins: [",
      ...plugins.map((p) => trimLeading(p, "    ")),
      "  ],",
    );
  }

  if (inputs) {
    config.push(
      "  inputs: [",
      ...inputs.map((i) => trimLeading(i, "    ")),
      "  ],",
    );
  }

  if (output) {
    config.push(
      "  output: {",
      ...output.map((o) => trimLeading(o, "    ")),
      "  },",
    );
  }

  config.push("};", "", "export default config", "");
  return config.join("\n");
}
