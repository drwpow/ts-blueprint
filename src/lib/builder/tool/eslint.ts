import type { File, Framework } from "../../types.js";

export interface ESLintOptions {
  framework: Framework;
}

export default function buildESLint({ framework }: ESLintOptions): File[] {
  return [
    {
      dependencies: ["@eslint/js", "typescript-eslint"],
      filename: "eslint.config.js",
      language: "javascript",
      contents: [
        'import eslint from "@eslint/js";',
        'import tseslint from "typescript-eslint";',
        "",
        "export default tseslint.config(",
        "  eslint.configs.recommended,",
        "  tseslint.configs.recommendedTypeChecked,",
        `  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }`,
        ");",
      ].join("\n"),
    },
  ];
}
