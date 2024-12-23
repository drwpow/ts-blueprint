import type { Manifest } from "pacote";
import npmData from "../../data/npm.js";
import type { File, Test } from "../types.js";

export interface PkgJSONOptions {
  cli?: boolean;
  cjs?: boolean;
  dependencies: (keyof typeof npmData)[];
  test: Test;
}

/** Only include dependencies that are likely runtime deps */
const PEER_DEP: (keyof typeof npmData)[] = ["react", "svelte", "vue"];

export default function buildPkgJSON({
  cli,
  cjs,
  dependencies,
  test,
}: PkgJSONOptions): File[] {
  const pkgInfo: Partial<Manifest> = {
    name: "my-app",
    type: cjs ? "commonjs" : "module",
    main: "./dist/index.js",
    scripts: {
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

  if (cjs) {
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
  }

  const sortedDeps = [...dependencies];
  sortedDeps.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  for (const pkg of sortedDeps) {
    const data = npmData[pkg];
    if (data) {
      if (PEER_DEP.includes(pkg)) {
        pkgInfo.peerDependencies![pkg] = `^${data.version}`;
      }

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
