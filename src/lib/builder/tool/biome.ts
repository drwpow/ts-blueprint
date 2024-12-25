import type { File, Framework } from "../../types.js";

export interface BiomeOptions {
  framework: Framework;
}

export default function buildBiome({ framework }: BiomeOptions): File[] {
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
            ignore: ["dist/**", "node_modules/**"],
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
          ...(["svelte", "vue"].includes(framework)
            ? {
                /** @see https://biomejs.dev/internals/language-support/#html-super-languages-support */
                overrides: [
                  {
                    include: ["*.svelte", "*.vue"],
                    linter: {
                      rules: {
                        style: {
                          useConst: "off",
                          useImportType: "off",
                        },
                      },
                    },
                  },
                ],
              }
            : {}),
        },
        undefined,
        2,
      ),
    },
  ];
}
