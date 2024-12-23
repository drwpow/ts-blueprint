/** Trim leading whitespace */
export function trimLeading(str: string, replacement = "") {
  return str.replace(/^\s+/, replacement);
}

/** Figure out extension */
export function ext(basename: string, module: "esm" | "cjs" = "esm") {
  if (module === "cjs") {
    return basename
      .replace(/\.js$/i, ".mjs")
      .replace(/\.ts$/i, ".mts")
      .replace(/\.cjs$/i, ".js");
  }
  return basename.replace(/\.mjs$/i, ".js").replace(/\.mts$/i, ".ts");
}
