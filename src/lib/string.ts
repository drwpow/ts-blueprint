/** Trim leading whitespace */
export function trimLeading(str: string, replacement = "") {
  return str.replace(/^\s*/, replacement);
}
