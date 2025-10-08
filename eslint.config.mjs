// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    // Modern way to ignore files (replaces deprecated .eslintignore)
    ignores: [
      "eslint.config.mjs",
      "dist/**",
      "node_modules/**",
      "build/**",
      "*.js",
      "*.d.ts",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 2024,
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "prettier/prettier": "warn", // Make Prettier issues warnings, not errors
    },
  },
);
