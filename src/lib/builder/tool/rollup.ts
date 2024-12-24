import { formatImportStatement } from "../../module.js";
import { trimLeading } from "../../string.js";
import type { Dependency, File, Framework } from "../../types.js";

export interface RollupOptions {
  framework: Framework;
}

const PLUGIN_IMPORT_CSS: Dependency = {
  name: "rollup-plugin-import-css",
  default: "css",
};
const PLUGIN_TS: Dependency = {
  name: "@rollup/plugin-typescript",
  default: "ts",
};

export default function buildRollup({ framework }: RollupOptions): File[] {
  const filename = "rollup.config.js";
  const language = "javascript";
  const dependencies: Dependency[] = [];
  const depNames = dependencies.map((d) => d.name).concat("rollup");
  const files: File[] = [];

  switch (framework) {
    case "nodejs": {
      dependencies.push(
        { name: "@rollup/plugin-commonjs", default: "commonjs" },
        PLUGIN_TS,
      );
      files.push({
        dependencies: [...depNames, ...dependencies.map((d) => d.name)],
        filename,
        language,
        contents: buildRollupConfig({
          dependencies,
          plugins: [`ts({ tsconfig: "tsconfig.build.json" })`, "commonjs()"],
          output: [
            `   {
      dir: "./dist/",
      format: "es",
      preserveModules: true,
      sourcemap: true,
    }`,
            `   {
      dir: "./dist/",
      format: "cjs",
      preserveModules: true,
      sourcemap: true,
      entryFileNames: "[name].cjs",
    }`,
          ],
        }),
      });
      break;
    }

    case "react": {
      dependencies.push(
        PLUGIN_TS,
        { name: "@vitejs/plugin-react-swc", default: "react" },
        PLUGIN_IMPORT_CSS,
      );
      files.push({
        dependencies: [...depNames, ...dependencies.map((d) => d.name)],
        filename,
        language,
        contents: buildRollupConfig({
          dependencies,
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
          ],
        }),
      });
      break;
    }

    case "svelte": {
      dependencies.push(PLUGIN_TS, {
        name: "@sveltejs/vite-plugin-svelte",
        default: "svelte",
      });
      files.push({
        dependencies: [
          ...depNames,
          ...dependencies.map((d) => d.name),
          "@sveltejs/package",
        ],
        filename,
        language,
        contents: buildRollupConfig({
          dependencies,
          plugins: [`ts({ tsconfig: "tsconfig.build.json" })`, "svelte()"],
          external: '["*"]',
          output: [
            `   {
      dir: "./dist/",
      format: "es",
      preserveModules: true,
      sourcemap: true,
    }`,
          ],
        }),
      });
      break;
    }

    case "vue": {
      dependencies.push(PLUGIN_TS, {
        name: "@vitejs/plugin-vue",
        default: "vue",
      });
      files.push({
        dependencies: [...depNames, ...dependencies.map((d) => d.name)],
        filename,
        language,
        contents: buildRollupConfig({
          dependencies,
          plugins: [`ts({ tsconfig: "tsconfig.build.json" })`, "vue()"],
          external: '["*"]',
          output: [
            `   {
      dir: "./dist/",
      format: "es",
      preserveModules: true,
      sourcemap: true,
    }`,
          ],
        }),
      });
      break;
    }
  }

  return files;
}

export interface RollupConfigOptions {
  dependencies?: Dependency[];
  plugins?: string[];
  inputs?: string[];
  external?: string;
  output?: string[];
}

/** Build Rollup Config */
export function buildRollupConfig({
  dependencies,
  inputs,
  external,
  plugins,
  output,
}: RollupConfigOptions) {
  const config = [
    ...(dependencies ? dependencies.map(formatImportStatement).concat("") : []),
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
