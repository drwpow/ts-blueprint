import type { Dependency } from "./types.js";

export function formatImportStatement(dep: Dependency): string {
  if (dep.default) {
    return `import ${dep.default} from "${dep.name}";`;
  }
  const named = [...(dep.named ?? [])];
  named.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return `import { ${(named).join(", ")} } from "${dep.name}";`;
}
