import { trimLeading } from "../../string.js";
import type { File, Framework } from "../../types.js";

export interface RollupOptions {
  framework: Framework;
}

export default function buildRollup({ framework }: RollupOptions): File[] {
  const imports = ['import ts from "@rollup/plugin-typescript";'];
  const filename = "rollup.config.js";
  const language = "javascript";
  const dependencies: File["dependencies"] = [
    "@rollup/plugin-typescript",
    "rollup",
  ];
  const files: File[] = [];

  switch (framework) {
    case "nodejs": {
      imports.push('import commonjs from "@rollup/plugin-commonjs";');
      dependencies.push("@rollup/plugin-commonjs");
      files.push({
        dependencies,
        filename,
        language,
        contents: buildRollupConfig({
          imports,
          plugins: [`ts({ tsconfig: "tsconfig.build.json" })`, "commonjs()"],
          output: [
            `   {
      dir: "./dist/",
      format: "es",
      preserveModules: true,
      sourcemap: true,
      globals: {
        "react/jsx-runtime": "jsxRuntime",
        "react-dom/client": "ReactDOM",
        react: "React",
      }
    }`,
            `   {
      dir: "./dist/",
      format: "cjs",
      preserveModules: true,
      sourcemap: true,
      entryFileNames: "[name].cjs",
      globals: {
        "react/jsx-runtime": "jsxRuntime",
        "react-dom/client": "ReactDOM",
        react: "React",
      }
    }`,
          ],
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
          external: `["*"]`,
          output: [
            "[{",
            '    dir: "./dist/"',
            "    sourcemap: true",
            `    globals: {
      "react/jsx-runtime": "jsxRuntime",
      "react-dom/client": "ReactDOM",
      react: "React",
    }`,
            "  ],",
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
  external?: string;
  output?: string[];
}

/** Build Rollup Config */
export function buildRollupConfig({
  inputs,
  imports,
  external,
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
      ...plugins.map((p) => `${trimLeading(p, "    ")},`),
      "  ],",
    );
  }

  if (external) {
    config.push(`  external: ${external},`);
  }

  if (inputs) {
    config.push(
      "  inputs: [",
      ...inputs.map((i) => `${trimLeading(i, "    ")},`),
      "  ],",
    );
  }

  if (output) {
    config.push(
      "  output: [",
      ...output.map((o) => `${trimLeading(o, "    ")},`),
      "  ],",
    );
  }

  config.push("};", "", "export default config", "");
  return config.join("\n");
}
