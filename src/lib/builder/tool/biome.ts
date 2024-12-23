import type { File } from "../../types.js";

export default function buildBiome(): File[] {
  return [
    {
      dependencies: ["@biomejs/biome"],
      filename: "biome.json",
      language: "json",
      contents: JSON.stringify(
        {
          $schema: "https://biomejs.dev/schemas/1.9.4/schema.json",
          files: {
            ignoreUnknown: false,
            ignore: ["dist/**", "node_modules/**", "public/**"],
          },
          formatter: {
            enabled: true,
            indentStyle: "space",
          },
          organizeImports: {
            enabled: true,
          },
          linter: {
            enabled: true,
            rules: {
              recommended: true,
            },
          },
          javascript: {
            formatter: {
              quoteStyle: "double",
            },
          },
        },
        undefined,
        2,
      ),
    },
  ];
}
