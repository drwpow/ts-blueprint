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

export default function buildPkgJSON({
  cli,
  dependencies,
  framework,
  lint,
  test,
}: PkgJSONOptions): File[] {
  const pkgInfo: Partial<Manifest> = {
    name: "my-app",
    type: "module",
    main: "./dist/index.js",
    scripts: {
      format: lint === "eslint" ? "eslint --fix ." : "biome format --write .",
      lint: lint === "eslint" ? "eslint ." : "biome check .",
      test: test === "jest" ? "jest" : "vitest run",
    },
    peerDependencies: {},
    devDependencies: {},
  };

  if (cli) {
    pkgInfo.bin = {
      "my-cli-name": "./path-to-my-cli.js",
    };
  }

  pkgInfo.exports = {
    ".": {
      import: "./dist/index.js",
      require: "./dist/index.cjs",
      types: "./dist/index.d.ts",
      default: "./dist/index.js",
    },
    "./*": "./dist/*",
    "./package.json": "./package.json",
  };

  switch (framework) {
    case "react": {
      pkgInfo.peerDependencies = {
        react: `^${npmData.react.version}`,
        "react-dom": `^${npmData["react-dom"].version}`,
      };
      break;
    }
    case "svelte": {
      pkgInfo.peerDependencies = { svelte: `^${npmData.svelte.version}` };
      break;
    }
    case "vue": {
      pkgInfo.peerDependencies = { vue: `^${npmData.vue.version}` };
      break;
    }
  }

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
      contents: JSON.stringify(sortPkgInfo(pkgInfo as Manifest), undefined, 2),
    },
  ];
}

const KEY_ORDER = [
  "name",
  "version",
  "description",
  "type",
  "bin",
  "main",
  "exports",
  "license",
  "author",
  "scripts",
  "peerDependencies",
  "dependencies",
  "devDependencies",
];

/** Sort package.json by a specific key order */
function sortPkgInfo(pkgInfo: Partial<Manifest>): Manifest {
  const newPkgInfo = {} as Manifest;
  const keysRemaining = Object.keys(pkgInfo);

  // add ordered keys
  for (const key of KEY_ORDER) {
    if (!(key in pkgInfo)) {
      continue;
    }
    keysRemaining.splice(keysRemaining.indexOf(key), 1);
    if (
      typeof pkgInfo[key] === "object" &&
      Object.keys(pkgInfo[key]!).length === 0
    ) {
      continue;
    }
    newPkgInfo[key] = pkgInfo[key];
  }

  // add unknown keys (hopefully this is an empty list, but just in case)
  for (const key of keysRemaining) {
    newPkgInfo[key] = pkgInfo[key];
  }

  return newPkgInfo;
}
