import type { Manifest } from "pacote";
import npmData from "../../data/npm.js";
import type { File, Framework, Test } from "../types.js";
import type { Linter } from "./linter.js";

export interface PkgJSONOptions {
  cli?: boolean;
  dependencies: (keyof typeof npmData)[];
  framework: Framework;
  lint: Linter;
  test: Test;
}

const ESLINT_FORMAT = "eslint --fix .";
const ESLINT_LINT = "eslint .";
const BIOME_FORMAT = "biome format --write .";
const BIOME_LINT = "biome check .";
const VITEST_TEST = "vitest run";
const JEST_TEST = "jest";

export default function buildPkgJSON({
  cli,
  dependencies,
  framework,
  lint,
  test,
}: PkgJSONOptions): File[] {
  let pkgInfo: Partial<Manifest> = {
    name: "my-library",
    version: "0.0.0",
    type: "module",
    main: "./dist/index.js",
  };

  if (cli) {
    pkgInfo.bin = {
      "my-cli-name": "./path-to-my-cli.js",
    };
  }

  // Note: at first glance this feels too “WET” (opposite of DRY), but there are
  // so many nuanced differences and minor details where there is less
  // duplication than it appears. Trying to abstract this turns into something
  // much harder to reason about, and spot differences, than a standard
  // copy/pate block

  switch (framework) {
    case "nodejs": {
      pkgInfo = {
        ...pkgInfo,
        exports: {
          ".": {
            import: "./dist/index.js",
            require: "./dist/index.cjs",
            types: "./dist/index.d.ts",
            default: "./dist/index.js",
          },
          "./*": "./dist/*",
          "./package.json": "./package.json",
        },
        scripts: {
          build: "rollup -c rollup.config.js",
          format: lint === "eslint" ? ESLINT_FORMAT : BIOME_FORMAT,
          lint: lint === "eslint" ? ESLINT_LINT : BIOME_LINT,
          test: test === "jest" ? JEST_TEST : VITEST_TEST,
        },
        devDependencies: {},
      };
      break;
    }

    case "react": {
      pkgInfo = {
        ...pkgInfo,
        sideEffects: ["**/*.css"],
        exports: {
          ".": {
            import: "./dist/index.js",
            types: "./dist/index.d.ts",
            default: "./dist/index.js",
          },
          "./*": "./dist/*",
          "./package.json": "./package.json",
        },
        scripts: {
          build: "rollup -c rollup.config.js",
          format: lint === "eslint" ? ESLINT_FORMAT : BIOME_FORMAT,
          lint: lint === "eslint" ? ESLINT_LINT : BIOME_LINT,
          test: test === "jest" ? JEST_TEST : VITEST_TEST,
        },
        peerDependencies: {
          react: `^${npmData.react.version}`,
          "react-dom": `^${npmData["react-dom"].version}`,
        },
        devDependencies: {},
      };
      break;
    }

    case "vue": {
      pkgInfo = {
        ...pkgInfo,
        sideEffects: ["**/*.css"],
        exports: {
          ".": {
            import: "./dist/index.js",
            types: "./dist/index.d.ts",
            default: "./dist/index.js",
          },
          "./*": "./dist/*",
          "./package.json": "./package.json",
        },
        scripts: {
          build: "rollup -c rollup.config.js",
          format: lint === "eslint" ? ESLINT_FORMAT : BIOME_FORMAT,
          lint: lint === "eslint" ? ESLINT_LINT : BIOME_LINT,
          test: test === "jest" ? JEST_TEST : VITEST_TEST,
        },
        peerDependencies: {
          vue: `^${npmData.vue.version}`,
        },
        devDependencies: {},
      };
      break;
    }

    case "svelte": {
      pkgInfo = {
        ...pkgInfo,
        sideEffects: ["**/*.css"],
        exports: {
          ".": {
            import: "./dist/index.js",
            types: "./dist/index.d.ts",
            svelte: "./dist/index.js",
            default: "./dist/index.js",
          },
          "./*": "./dist/*",
          "./package.json": "./package.json",
        },
        scripts: {
          build: "svelte-package",
          format: lint === "eslint" ? ESLINT_FORMAT : BIOME_FORMAT,
          lint: lint === "eslint" ? ESLINT_LINT : BIOME_LINT,
          test: test === "jest" ? JEST_TEST : VITEST_TEST,
        },
        peerDependencies: {
          svelte: `^${npmData.svelte.version}`,
        },
        devDependencies: {},
      };
      break;
    }
  }

  // Deps
  const sortedDeps = [...dependencies];
  sortedDeps.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  for (const pkg of sortedDeps) {
    const data = npmData[pkg];
    if (data) {
      // Note: this does not add any packages to dependencies. The logic is as
      // follows: when packaging for npm, you only want to add packages to
      // dependencies that meet ALL the following criteria:
      //
      // - It is a runtime dep
      // - It is not likely to be installed by the user
      // - It is not likely to be a common dep among other packages used
      // - The specific version doesn’t matter to the user
      //
      // Almost none of the common packages used in the build step meet this
      // criteria. Therefore, the only things that are likely to be deps are
      // unique deps that the package author will add naturally.
      //
      // Rather than try and predict what the user’s business logic is—which is
      // WAY beyond the scope of this tool—we just assume devDeps for
      // everything. But as a convenience, add a few packages to peerDeps.

      pkgInfo.devDependencies![pkg] = `^${data.version}`;
    }
  }

  return [
    {
      dependencies: [],
      filename: "package.json",
      language: "json",
      contents: JSON.stringify(pkgInfo, undefined, 2),
    },
  ];
}
