import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig, globalIgnores } from "eslint/config";
import angular from 'angular-eslint';

export default defineConfig([
  globalIgnores([
    '.vscode/**',
    'package*.json',
    'dist/**',
    'vite/**',
    '.angular/**',          // Angular cache
    '.angular/cache/**',    // specific cache subfolders
    '**/node_modules/**',   // always ignore deps
    '**/out-tsc/**',        // compiled TS output
  ]),
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  {
    files: ['**/*.ts'],
    plugins: { angular, tseslint },
    extends: [...angular.configs.tsRecommended, ...tseslint.configs.recommended],
    rules: {
      '@angular-eslint/prefer-inject': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    }
  },
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
  { files: ["**/*.json5"], plugins: { json }, language: "json/json5", extends: ["json/recommended"] },
  { files: ["**/*.md"], plugins: { markdown }, language: "markdown/commonmark", extends: ["markdown/recommended"] },
  {
    files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"],
    rules: {
      "css/no-invalid-properties": "off",
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // our project thinks using negated async pipes is ok
      '@angular-eslint/template/no-negated-async': 'off',
    },
  },
]);
